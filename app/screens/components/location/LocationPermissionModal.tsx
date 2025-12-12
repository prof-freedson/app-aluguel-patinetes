import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useLocation } from '../../../../hooks/useLocation';

interface LocationPermissionModalProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
  enableOnClose?: boolean;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  visible,
  onDismiss,
  title = 'Habilitar Localização',
  message = 'Precisamos acessar sua localização para aluguel de patinetes',
  enableOnClose = false,
}) => {
  const { requestPermission, hasPermission, loading, error } = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Se já tem permissão, mostrar sucesso brevemente
    if (hasPermission && visible) {
      setShowSuccess(true);
      setTimeout(() => {
        onDismiss();
      }, 1500);
    }
  }, [hasPermission, visible]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowSuccess(true);
      setTimeout(() => {
        onDismiss();
      }, 1500);
    }
  };

  const handleSkip = () => {
    if (enableOnClose) {
      // Se enableOnClose for true, solicita permissão ao fechar
      requestPermission();
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 rounded-3xl bg-white p-8">
          {/* Ícone de Status */}
          {showSuccess ? (
            <View className="items-center mb-6">
              <CheckCircle size={56} color="#10b981" />
            </View>
          ) : (
            <View className="items-center mb-6">
              <MapPin size={56} color="#3b82f6" />
            </View>
          )}

          {/* Título */}
          <Text className="text-xl font-bold text-center text-gray-800 mb-2">
            {showSuccess ? 'Localização Habilitada' : title}
          </Text>

          {/* Mensagem */}
          <Text className="text-base text-center text-gray-600 mb-6">
            {showSuccess ? 'Sua localização foi ativada com sucesso!' : message}
          </Text>

          {/* Erro (se houver) */}
          {error && !showSuccess && (
            <View className="flex-row items-center bg-red-50 rounded-xl p-4 mb-6">
              <AlertCircle size={20} color="#ef4444" className="mr-3" />
              <Text className="flex-1 text-red-700 text-sm">{error}</Text>
            </View>
          )}

          {/* Botões */}
          {!showSuccess && (
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleRequestPermission}
                disabled={loading}
                className={`py-3 px-4 rounded-xl ${
                  loading ? 'bg-gray-300' : 'bg-blue-500'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-center">
                    Habilitar Localização
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSkip}
                disabled={loading}
                className="py-3 px-4 rounded-xl border-2 border-gray-300"
              >
                <Text className="text-gray-700 font-semibold text-center">
                  {enableOnClose ? 'Habilitar Depois' : 'Agora Não'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
