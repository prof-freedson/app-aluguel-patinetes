import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { LocationPermissionModal } from '../teste/components/location/LocationPermissionModal';

const RideStartScreen = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { location, hasPermission, startTracking } = useLocation();

  useEffect(() => {
    // Se não tiver permissão, mostrar modal
    if (!hasPermission) {
      setShowLocationModal(true);
    }
  }, [hasPermission]);

  const handleStartRide = async () => {
    // Verificar se tem permissão
    if (!hasPermission) {
      setShowLocationModal(true);
      return;
    }

    // Iniciar rastreamento de localização
    await startTracking((location) => {
      console.log('Localização atualizada durante corrida:', location);
      // Aqui você pode salvar a localização no Supabase ou fazer qualquer outra ação
    });

    // Iniciar a corrida (você implementará isso)
    console.log('Corrida iniciada com localização:', location);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
      >
        <View className="flex-1 px-5 py-6">
          {/* Header Image Section */}
          <View className="mb-5 rounded-xl overflow-hidden h-48">
            <Image
              source={require('../../../assets/images/map-image.png')}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/30" />
            <View className="flex-1 justify-end p-4">
              <View className="z-10">
                <Text className="text-white text-2xl font-bold mb-1 shadow">
                  Pronto para iniciar?
                </Text>
              </View>
            </View>
          </View>

          {/* Content Card */}
          <View className="bg-white rounded-xl p-5 shadow-sm flex-1">
            {/* Info Section */}
            <View className="mb-6 flex-row items-start">
              <View className="mr-4 mt-1">
                <Ionicons name="bicycle" size={24} color="#2575fc" />
              </View>
              
              <View className="flex-1">
                <Text className="text-lg font-semibold mb-1">
                  Modelo: UrbanGlide Pro
                </Text>
                
                <Text className="text-gray-600 text-base mb-4">
                  ID: XZ45-B789
                </Text>
                
                <View className="flex-row items-start">
                  <View className="mr-3 mt-0.5">
                    <MaterialIcons 
                      name="warning" 
                      size={18} 
                      color="#f59e0b" 
                    />
                  </View>
                  <Text className="text-gray-600 text-sm flex-1 leading-5">
                    A cobrança por minuto começará assim que a corrida iniciar.
                  </Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-200 my-5" />

            {/* Location Status */}
            <View className="bg-blue-50 rounded-lg p-4 mb-5">
              <View className="flex-row items-center">
                <Ionicons 
                  name={hasPermission ? "location" : "location-outline"} 
                  size={18} 
                  color={hasPermission ? "#10b981" : "#ef4444"} 
                />
                <Text className="ml-2 text-sm font-medium text-gray-700">
                  Localização: {hasPermission ? '✓ Ativa' : '✗ Desativa'}
                </Text>
              </View>
              {location && (
                <Text className="text-xs text-gray-500 mt-2">
                  Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
                </Text>
              )}
            </View>

            {/* Buttons */}
            <View className="mt-auto space-y-3">
              <TouchableOpacity 
                className={`${hasPermission ? 'bg-blue-500' : 'bg-orange-500'} rounded-xl py-4 px-4 active:scale-95`}
                activeOpacity={0.8}
                onPress={handleStartRide}
              >
                <Text className="text-white text-lg font-semibold text-center">
                  {hasPermission ? 'Iniciar Corrida' : 'Ativar Localização e Iniciar'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="border border-gray-300 rounded-xl py-4 px-4 active:scale-95 bg-transparent"
                activeOpacity={0.8}
              >
                <Text className="text-black text-lg font-semibold text-center">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Permissão de Localização */}
      <LocationPermissionModal 
        visible={showLocationModal}
        onDismiss={() => setShowLocationModal(false)}
        message="Precisamos acessar sua localização para rastrear a corrida do patinete"
        enableOnClose={true}
      />
    </SafeAreaView>
  );
};

export default RideStartScreen;