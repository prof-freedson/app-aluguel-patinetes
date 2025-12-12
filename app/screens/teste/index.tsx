import '../../styles/global.css'
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { useLocation } from "@/hooks/useLocation";
import { LocationPermissionModal } from "./components/location/LocationPermissionModal";

export default function Teste() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { location, hasPermission, error, source } = useLocation();

  useEffect(() => {
    // Mostrar modal de localização ao carregar (simulando login)
    // Você pode descomentar esta linha após implementar autenticação
    // setShowLocationModal(true);
  }, []);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center justify-center p-6">
        <Text className="text-xl font-bold text-blue-500 mb-8">
          Tela inicial de teste do app!
        </Text>

        {/* Seção de Localização */}
        <View className="w-full bg-blue-50 rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold text-blue-900 mb-3">
            Status de Localização
          </Text>

          <View className="gap-2 mb-4">
            <Text className="text-gray-700">
              Permissão: <Text className={hasPermission ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {hasPermission ? '✓ Ativada' : '✗ Desativada'}
              </Text>
            </Text>
            {location && (
              <>
                <Text className="text-gray-700">
                  Latitude: <Text className="font-mono">{location.latitude.toFixed(6)}</Text>
                </Text>
                <Text className="text-gray-700">
                  Longitude: <Text className="font-mono">{location.longitude.toFixed(6)}</Text>
                </Text>
                <Text className="text-gray-700">
                  Fonte: <Text className={source === 'gps' ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
                    {source === 'gps' ? 'GPS' : source === 'local' ? 'Armazenamento Local' : 'Nenhuma'}
                  </Text>
                </Text>
              </>
            )}
            {error && (
              <Text className="text-red-600 text-sm">{error}</Text>
            )}
          </View>

          <TouchableOpacity 
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => setShowLocationModal(true)}
          >
            <Text className="text-white font-semibold text-center">
              Habilitar Localização
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botões de Navegação */}
        <View className="w-full gap-3">
          <Link href="/screens/detalhes-patinete" asChild>
            <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
              <Text className="text-white font-bold text-lg text-center">
                Ver Patinetes
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/cadastro" asChild>
            <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-lg">
              <Text className="text-white font-bold text-lg text-center">
                Cadastrar
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/inicio-corrida" asChild>
            <TouchableOpacity className="bg-purple-500 px-6 py-3 rounded-lg">
              <Text className="text-white font-bold text-lg text-center">
                Iniciar Corrida
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Modal de Permissão de Localização */}
      <LocationPermissionModal 
        visible={showLocationModal}
        onDismiss={() => setShowLocationModal(false)}
        enableOnClose={false}
      />
    </ScrollView>
  );
}
