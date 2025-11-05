import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Importa os dados do JSON
import patinetesData from '@/data/patinetes.json';

// Componentes estilizados
const StyledView = View;
const StyledText = Text;
const StyledTouchableOpacity = TouchableOpacity;

// Mapeamento das imagens locais
const imagensPatinetes: Record<string, any> = {
  'patinete1': require('../../../assets/images/patinete1.jpg'),
  'patinete2': require('../../../assets/images/patinete2.png'),
  'patinete3': require('../../../assets/images/patinete3.jpg'),
  'patinete4': require('../../../assets/images/patinete4.jpg'),
};

const ListaPatinetes = () => {
  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return '#10B981'; // Verde
      case 'reservado':
        return '#F59E0B'; // Amarelo/Laranja
      case 'em_uso':
        return '#EF4444'; // Vermelho
      default:
        return '#6B7280'; // Cinza
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'reservado':
        return 'Reservado';
      case 'em_uso':
        return 'Em Uso';
      default:
        return 'Indisponível';
    }
  };

  // Função para obter a cor da bateria
  const getBatteryColor = (batteryLevel: number) => {
    if (batteryLevel >= 70) return '#10B981';
    if (batteryLevel >= 30) return '#F59E0B';
    return '#EF4444';
  };

  // Item da lista de patinetes
  const PatineteCard = ({ patinete }: { patinete: any }) => (
    <StyledView className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-gray-100">
      <StyledView className="flex-row items-start">
        {/* Imagem do patinete */}
        <StyledView className="mr-4">
          <Image 
            source={imagensPatinetes[patinete.imagem]}
            className="w-20 h-20 rounded-xl"
            resizeMode="cover"
          />
        </StyledView>

        {/* Informações do patinete */}
        <StyledView className="flex-1">
          <StyledView className="flex-row justify-between items-start mb-2">
            <StyledView>
              <StyledText className="text-xl font-bold text-gray-800">
                Patinete #{patinete.id}
              </StyledText>
              <StyledText className="text-gray-600 text-sm mt-1">
                {patinete.modelo} • {patinete.cor}
              </StyledText>
            </StyledView>
            <StyledView 
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${getStatusColor(patinete.status)}20` }}
            >
              <StyledText 
                className="text-xs font-medium"
                style={{ color: getStatusColor(patinete.status) }}
              >
                {getStatusText(patinete.status)}
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Especificações */}
          <StyledView className="flex-row justify-between mb-4">
            <StyledView className="flex-row items-center">
              <Ionicons name="battery-charging" size={18} color={getBatteryColor(patinete.bateria)} />
              <StyledText className="text-gray-700 ml-2 font-medium">
                {patinete.bateria}%
              </StyledText>
            </StyledView>

            <StyledView className="flex-row items-center">
              <MaterialIcons name="attach-money" size={18} color="#F59E0B" />
              <StyledText className="text-gray-700 ml-2 font-medium">
                R${patinete.precoPorMinuto.toFixed(2)}/min
              </StyledText>
            </StyledView>

            <StyledView className="flex-row items-center">
              <Ionicons name="speedometer" size={18} color="#8B5CF6" />
              <StyledText className="text-gray-700 ml-2 font-medium">
                25 km/h
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Localização */}
          <StyledView className="flex-row items-center mb-4">
            <Ionicons name="location" size={16} color="#EF4444" />
            <StyledText className="text-gray-600 text-sm ml-2">
              {patinete.localizacao.lat.toFixed(4)}, {patinete.localizacao.lng.toFixed(4)}
            </StyledText>
          </StyledView>

          {/* Botão Selecionar */}
          <Link href={`/screens/detalhes-patinete/${patinete.id}`} asChild>
            <StyledTouchableOpacity 
              className={`rounded-xl py-3 items-center ${
                patinete.status === 'disponivel' 
                  ? 'bg-blue-500' 
                  : 'bg-gray-400'
              }`}
              disabled={patinete.status !== 'disponivel'}
            >
              <StyledText className="text-white font-bold text-lg">
                {patinete.status === 'disponivel' ? 'Selecionar Patinete' : 'Indisponível'}
              </StyledText>
              {patinete.status === 'disponivel' && (
                <StyledText className="text-blue-100 text-sm mt-1">
                  Clique para ver detalhes e reservar
                </StyledText>
              )}
            </StyledTouchableOpacity>
          </Link>
        </StyledView>
      </StyledView>
    </StyledView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <StyledView className="bg-white px-5 py-6 border-b border-gray-200">
        <StyledText className="text-3xl font-bold text-gray-800 text-center">
          Nossos Patinetes
        </StyledText>
        <StyledText className="text-gray-600 text-center mt-2">
          Escolha um patinete para ver os detalhes e fazer sua reserva
        </StyledText>
      </StyledView>

      {/* Contador de status */}
      <StyledView className="bg-white px-5 py-4 border-b border-gray-200">
        <StyledView className="flex-row justify-between">
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold text-green-600">
              {patinetesData.filter(p => p.status === 'disponivel').length}
            </StyledText>
            <StyledText className="text-gray-600 text-sm">Disponíveis</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold text-orange-500">
              {patinetesData.filter(p => p.status === 'reservado').length}
            </StyledText>
            <StyledText className="text-gray-600 text-sm">Reservados</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold text-red-600">
              {patinetesData.filter(p => p.status === 'em_uso').length}
            </StyledText>
            <StyledText className="text-gray-600 text-sm">Em Uso</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>

      {/* Lista de patinetes */}
      <FlatList
        data={patinetesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PatineteCard patinete={item} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <StyledView className="bg-white px-5 py-4 border-t border-gray-200">
        <StyledText className="text-center text-gray-600">
          {patinetesData.length} patinetes na frota • 
          {patinetesData.filter(p => p.status === 'disponivel').length} disponíveis agora
        </StyledText>
      </StyledView>
    </SafeAreaView>
  );
};

export default ListaPatinetes;