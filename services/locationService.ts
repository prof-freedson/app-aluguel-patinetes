import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { supabase } from '@/config/supabaseConfig';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface LocationServiceResult {
  success: boolean;
  data?: LocationData;
  error?: string;
  source: 'gps' | 'local' | 'none';
}

const LOCATION_STORAGE_KEY = '@location_data';
const MAX_LOCATION_AGE = 5 * 60 * 1000; // 5 minutos

class LocationService {
  /**
   * Solicita permissão de localização ao usuário
   */
  static async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      return false;
    }
  }

  /**
   * Verifica se a permissão de localização foi concedida
   */
  static async checkLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Erro ao verificar permissão de localização:', error);
      return false;
    }
  }

  /**
   * Obtém a localização atual do usuário
   * Tenta usar GPS primeiro, depois fallback para local storage
   */
  static async getCurrentLocation(): Promise<LocationServiceResult> {
    try {
      // Verificar se a permissão foi concedida
      const hasPermission = await this.checkLocationPermission();

      if (!hasPermission) {
        console.warn('Permissão de localização não concedida');
        // Tentar recuperar do armazenamento local
        const localLocation = await this.getLocalLocation();
        if (localLocation) {
          return {
            success: true,
            data: localLocation,
            source: 'local',
          };
        }
        return {
          success: false,
          error: 'Permissão de localização não concedida',
          source: 'none',
        };
      }

      // Obter localização atual via GPS
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        timestamp: Date.now(),
      };

      // Salvar no armazenamento local
      await this.saveLocalLocation(locationData);

      // Tentar sincronizar com Supabase
      await this.syncLocationToSupabase(locationData);

      return {
        success: true,
        data: locationData,
        source: 'gps',
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);

      // Fallback para armazenamento local
      const localLocation = await this.getLocalLocation();
      if (localLocation) {
        return {
          success: true,
          data: localLocation,
          error: `Erro ao obter GPS: ${error instanceof Error ? error.message : 'Desconhecido'}`,
          source: 'local',
        };
      }

      return {
        success: false,
        error: `Erro ao obter localização: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        source: 'none',
      };
    }
  }

  /**
   * Inicia monitoramento contínuo de localização
   */
  static async startLocationTracking(callback: (location: LocationData) => void): Promise<void> {
    try {
      const hasPermission = await this.checkLocationPermission();

      if (!hasPermission) {
        console.warn('Permissão de localização não concedida para rastreamento');
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // 10 segundos
          distanceInterval: 10, // 10 metros
        },
        async (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? undefined,
            timestamp: Date.now(),
          };

          // Salvar localmente
          await this.saveLocalLocation(locationData);

          // Sincronizar com Supabase
          await this.syncLocationToSupabase(locationData);

          // Chamar callback
          callback(locationData);
        }
      );
    } catch (error) {
      console.error('Erro ao iniciar rastreamento de localização:', error);
    }
  }

  /**
   * Salva a localização no armazenamento local
   */
  static async saveLocalLocation(location: LocationData): Promise<void> {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('Erro ao salvar localização localmente:', error);
    }
  }

  /**
   * Obtém a localização do armazenamento local
   */
  static async getLocalLocation(): Promise<LocationData | null> {
    try {
      const data = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (!data) return null;

      const location: LocationData = JSON.parse(data);

      // Verificar se a localização ainda é válida (menos de 5 minutos)
      if (Date.now() - location.timestamp > MAX_LOCATION_AGE) {
        await AsyncStorage.removeItem(LOCATION_STORAGE_KEY);
        return null;
      }

      return location;
    } catch (error) {
      console.error('Erro ao obter localização local:', error);
      return null;
    }
  }

  /**
   * Sincroniza a localização com o Supabase
   */
  static async syncLocationToSupabase(location: LocationData): Promise<void> {
    try {
      // Verificar se o usuário está autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn('Usuário não autenticado, localizações não serão sincronizadas com Supabase');
        return;
      }

      // Inserir localização no Supabase
      // ⚠️ IMPORTANTE: Você precisa criar uma tabela 'user_locations' no seu banco de dados Supabase
      // com as colunas: id (UUID), user_id (UUID), latitude (FLOAT), longitude (FLOAT), accuracy (FLOAT), created_at (TIMESTAMP)
      const { error } = await supabase.from('user_locations').insert([
        {
          user_id: user.id,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          created_at: new Date(location.timestamp).toISOString(),
        },
      ]);

      if (error) {
        console.warn('Erro ao sincronizar localização com Supabase:', error);
      }
    } catch (error) {
      console.warn('Erro ao conectar com Supabase:', error);
      // Não lançar erro, apenas avisar para que o app continue funcionando offline
    }
  }

  /**
   * Limpa dados de localização armazenados localmente
   */
  static async clearLocalLocation(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LOCATION_STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar localização local:', error);
    }
  }
}

export default LocationService;
