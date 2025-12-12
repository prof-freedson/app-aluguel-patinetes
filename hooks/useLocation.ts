import { useCallback, useEffect, useState } from 'react';
import LocationService, { LocationData, LocationServiceResult } from '@/services/locationService';

export interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  source: 'gps' | 'local' | 'none';
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  startTracking: (callback?: (location: LocationData) => void) => Promise<void>;
  clearLocation: () => Promise<void>;
}

/**
 * Hook personalizado para gerenciar localização do usuário
 * Fornece métodos para solicitar permissão, obter localização e rastrear movimento
 */
export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [source, setSource] = useState<'gps' | 'local' | 'none'>('none');

  // Verificar permissão ao montar o componente
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  /**
   * Verifica o status atual da permissão
   */
  const checkPermissionStatus = useCallback(async () => {
    try {
      const granted = await LocationService.checkLocationPermission();
      setHasPermission(granted);
    } catch (err) {
      console.error('Erro ao verificar permissão:', err);
      setHasPermission(false);
    }
  }, []);

  /**
   * Solicita permissão de localização ao usuário
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const granted = await LocationService.requestLocationPermission();
      setHasPermission(granted);

      if (granted) {
        // Se a permissão foi concedida, obter localização imediatamente
        await getCurrentLocation();
      } else {
        setError('Permissão de localização foi negada');
      }

      return granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao solicitar permissão';
      setError(errorMessage);
      return false;
    }
  }, []);

  /**
   * Obtém a localização atual
   */
  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result: LocationServiceResult = await LocationService.getCurrentLocation();

      if (result.success && result.data) {
        setLocation(result.data);
        setSource(result.source);

        if (result.error) {
          setError(result.error);
        }
      } else {
        setError(result.error || 'Não foi possível obter a localização');
        setSource('none');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter localização';
      setError(errorMessage);
      setSource('none');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Inicia rastreamento contínuo de localização
   */
  const startTracking = useCallback(async (callback?: (location: LocationData) => void) => {
    try {
      setError(null);

      await LocationService.startLocationTracking((newLocation) => {
        setLocation(newLocation);
        setSource('gps');
        callback?.(newLocation);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar rastreamento';
      setError(errorMessage);
    }
  }, []);

  /**
   * Limpa a localização armazenada
   */
  const clearLocation = useCallback(async () => {
    try {
      await LocationService.clearLocalLocation();
      setLocation(null);
      setSource('none');
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar localização';
      setError(errorMessage);
    }
  }, []);

  return {
    location,
    loading,
    error,
    hasPermission,
    source,
    requestPermission,
    getCurrentLocation,
    startTracking,
    clearLocation,
  };
};
