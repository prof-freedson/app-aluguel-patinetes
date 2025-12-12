# Exemplos de Uso - Localização e Supabase

## 📝 Exemplos Práticos

### Exemplo 1: Usar Hook em um Componente Simples

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocation } from '@/hooks/useLocation';

export const SimpleLocationComponent = () => {
  const { location, hasPermission, getCurrentLocation } = useLocation();

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold mb-4">
        Status: {hasPermission ? '✅ Ativa' : '❌ Desativa'}
      </Text>

      {location && (
        <Text className="text-sm text-gray-600 mb-4">
          Lat: {location.latitude.toFixed(4)} | Lng: {location.longitude.toFixed(4)}
        </Text>
      )}

      <TouchableOpacity 
        className="bg-blue-500 px-6 py-3 rounded-lg"
        onPress={getCurrentLocation}
      >
        <Text className="text-white font-bold">Obter Localização</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

### Exemplo 2: Rastreamento Durante Corrida

```tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import LocationService, { LocationData } from '@/services/locationService';

export const RideTrackingComponent = () => {
  const { startTracking, hasPermission, location } = useLocation();
  const locationsRef = useRef<LocationData[]>([]);

  const handleStartRide = async () => {
    if (!hasPermission) {
      alert('Permissão de localização não concedida');
      return;
    }

    // Callback executado a cada atualização de localização
    await startTracking((newLocation) => {
      // Armazenar localização na memória
      locationsRef.current.push(newLocation);

      // Calcular distância percorrida
      const distance = calculateDistance(locationsRef.current);
      console.log(`Distância percorrida: ${distance}m`);

      // Atualizar UI, salvar em banco de dados, etc.
    });
  };

  const calculateDistance = (locations: LocationData[]) => {
    if (locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      const lat1 = locations[i - 1].latitude;
      const lon1 = locations[i - 1].longitude;
      const lat2 = locations[i].latitude;
      const lon2 = locations[i].longitude;

      const R = 6371000; // Raio da Terra em metros
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      totalDistance += distance;
    }
    return totalDistance;
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-lg font-bold mb-4">Rastreamento de Corrida</Text>
      <Text className="text-sm text-gray-600 mb-4">
        Posições rastreadas: {locationsRef.current.length}
      </Text>

      <TouchableOpacity 
        className={`px-6 py-3 rounded-lg ${
          hasPermission ? 'bg-green-500' : 'bg-red-500'
        }`}
        onPress={handleStartRide}
      >
        <Text className="text-white font-bold">
          {hasPermission ? 'Iniciar Rastreamento' : 'Ativar Localização'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

### Exemplo 3: Componente com Status Visual

```tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useLocation } from '@/hooks/useLocation';

export const LocationStatusBar = () => {
  const { 
    location, 
    hasPermission, 
    requestPermission, 
    getCurrentLocation,
    source,
    loading 
  } = useLocation();

  useEffect(() => {
    // Obter localização ao carregar
    if (hasPermission) {
      getCurrentLocation();
    }
  }, [hasPermission]);

  return (
    <View className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg m-4">
      {/* Status Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          {hasPermission ? (
            <CheckCircle size={20} color="#10b981" className="mr-2" />
          ) : (
            <AlertCircle size={20} color="#ef4444" className="mr-2" />
          )}
          <Text className={`font-semibold ${
            hasPermission ? 'text-green-700' : 'text-red-700'
          }`}>
            {hasPermission ? 'Localização Ativa' : 'Localização Desativa'}
          </Text>
        </View>
      </View>

      {/* Location Details */}
      {location && (
        <View className="bg-white rounded p-3 mb-3">
          <Text className="text-xs text-gray-500 mb-1">COORDENADAS</Text>
          <Text className="font-mono text-sm">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
          <Text className="text-xs text-gray-500 mt-2">
            Precisão: ±{(location.accuracy || 0).toFixed(0)}m
          </Text>
          <Text className="text-xs text-gray-500">
            Fonte: {source === 'gps' ? '🛰️ GPS' : '💾 Local'}
          </Text>
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        onPress={requestPermission}
        disabled={loading}
        className={`py-2 px-4 rounded ${
          hasPermission ? 'bg-green-500' : 'bg-blue-500'
        }`}
      >
        <Text className="text-white font-semibold text-center text-sm">
          {hasPermission ? 'Atualizar Localização' : 'Ativar Localização'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

### Exemplo 4: Integração com Contexto (Context API)

```tsx
import React, { createContext, useContext } from 'react';
import { useLocation } from '@/hooks/useLocation';

// Criar contexto
const LocationContext = createContext({});

// Provider
export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const locationData = useLocation();

  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext deve ser usado dentro de LocationProvider');
  }
  return context;
};

// Uso em qualquer componente:
const MyComponent = () => {
  const { location, hasPermission } = useLocationContext();
  return <Text>{location?.latitude}</Text>;
};
```

---

### Exemplo 5: Sincronização Manual com Supabase

```tsx
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import LocationService from '@/services/locationService';
import { supabase } from '@/config/supabaseConfig';

export const ManualSyncComponent = () => {
  const handleSyncLocation = async () => {
    try {
      // Obter localização atual
      const result = await LocationService.getCurrentLocation();

      if (result.success && result.data) {
        // Sincronizar com Supabase manualmente
        await LocationService.syncLocationToSupabase(result.data);
        
        alert(`Localização sincronizada!\nLat: ${result.data.latitude.toFixed(4)}\nLng: ${result.data.longitude.toFixed(4)}`);
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
    }
  };

  return (
    <View className="p-4">
      <TouchableOpacity 
        className="bg-purple-500 py-3 px-6 rounded-lg"
        onPress={handleSyncLocation}
      >
        <Text className="text-white font-bold text-center">
          Sincronizar com Supabase
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

### Exemplo 6: Histórico de Localizações

```tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { LocationData } from '@/services/locationService';

export const LocationHistoryComponent = () => {
  const [history, setHistory] = useState<LocationData[]>([]);
  const { startTracking, hasPermission } = useLocation();

  const handleTrackAndHistory = async () => {
    if (!hasPermission) {
      alert('Permissão necessária');
      return;
    }

    setHistory([]);

    await startTracking((location) => {
      setHistory((prev) => [...prev, location]);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <TouchableOpacity 
          className="bg-blue-500 py-3 px-4 rounded-lg mb-2"
          onPress={handleTrackAndHistory}
        >
          <Text className="text-white font-bold text-center">
            Rastrear Localização
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-red-500 py-3 px-4 rounded-lg"
          onPress={clearHistory}
        >
          <Text className="text-white font-bold text-center">
            Limpar Histórico
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-bold mb-2">
        Histórico ({history.length} localizações)
      </Text>

      <ScrollView className="flex-1">
        {history.map((location, index) => (
          <View 
            key={index} 
            className="bg-gray-100 p-3 rounded-lg mb-2 border-l-4 border-blue-500"
          >
            <Text className="text-xs text-gray-500">
              #{index + 1} - {new Date(location.timestamp).toLocaleTimeString()}
            </Text>
            <Text className="font-mono text-sm mt-1">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
            <Text className="text-xs text-gray-600 mt-1">
              Precisão: ±{(location.accuracy || 0).toFixed(0)}m
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
```

---

### Exemplo 7: Tratamento de Erros

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocation } from '@/hooks/useLocation';

export const ErrorHandlingComponent = () => {
  const { 
    location, 
    error, 
    hasPermission,
    getCurrentLocation,
    requestPermission 
  } = useLocation();

  const handleGetLocation = async () => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            'Permissão Necessária',
            'Para usar localização, você precisa ativar a permissão nas configurações do dispositivo.',
            [
              { text: 'OK' }
            ]
          );
          return;
        }
      }

      await getCurrentLocation();

      if (error) {
        Alert.alert(
          'Aviso',
          `Localização obtida, mas com avisos: ${error}`,
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      Alert.alert(
        'Erro',
        `Falha ao obter localização: ${err instanceof Error ? err.message : 'Desconhecido'}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View className="p-4">
      {error && (
        <View className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 rounded">
          <Text className="text-red-700 font-semibold">Erro</Text>
          <Text className="text-red-600 text-sm mt-1">{error}</Text>
        </View>
      )}

      <TouchableOpacity 
        className="bg-blue-500 py-3 px-4 rounded-lg"
        onPress={handleGetLocation}
      >
        <Text className="text-white font-bold text-center">
          Obter Localização
        </Text>
      </TouchableOpacity>

      {location && (
        <View className="bg-green-100 p-4 rounded-lg mt-4">
          <Text className="text-green-700 font-semibold">Sucesso!</Text>
          <Text className="text-green-600 text-sm mt-1">
            Lat: {location.latitude.toFixed(4)}
          </Text>
          <Text className="text-green-600 text-sm">
            Lng: {location.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
};
```

---

### Exemplo 8: Teste Unitário

```tsx
import { renderHook, act } from '@testing-library/react-native';
import { useLocation } from '@/hooks/useLocation';

describe('useLocation Hook', () => {
  it('deve iniciar sem permissão', () => {
    const { result } = renderHook(() => useLocation());
    expect(result.current.hasPermission).toBe(false);
  });

  it('deve solicitar permissão corretamente', async () => {
    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.requestPermission();
    });

    // Verificar se a permissão foi solicitada
    // (comportamento real depende do SO)
  });

  it('deve obter localização quando permitido', async () => {
    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.getCurrentLocation();
    });

    // Se obteve com sucesso, deve ter localização
    // Se não, deve estar no armazenamento local ou erro
  });
});
```

---

## 🎯 Resumo dos Exemplos

| Exemplo | Caso de Uso | Complexidade |
|---------|-----------|--------------|
| 1 | Componente simples com localização | ⭐ Básico |
| 2 | Rastreamento durante corrida | ⭐⭐⭐ Avançado |
| 3 | Barra de status visual | ⭐⭐ Intermediário |
| 4 | Integração com Context API | ⭐⭐⭐ Avançado |
| 5 | Sincronização manual com Supabase | ⭐⭐ Intermediário |
| 6 | Histórico de localizações | ⭐⭐⭐ Avançado |
| 7 | Tratamento de erros | ⭐⭐ Intermediário |
| 8 | Testes unitários | ⭐⭐⭐ Avançado |

## 📚 Próximos Passos

1. **Copiar** um dos exemplos acima para seu componente
2. **Adaptar** às suas necessidades
3. **Testar** no dispositivo real
4. **Monitorar** logs no console para debugging

---

**Última atualização:** 25 de Novembro de 2025
