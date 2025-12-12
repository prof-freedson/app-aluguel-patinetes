# Configuração de Localização e Supabase

## 📋 Resumo da Implementação

Este documento descreve a implementação de localização usando `expo-location` e integração com `Supabase`, com fallback para armazenamento local do dispositivo.

## 🚀 Funcionalidades Implementadas

### 1. **Serviço de Localização** (`services/locationService.ts`)
- ✅ Obtenção de localização em tempo real via GPS
- ✅ Sincronização automática com Supabase
- ✅ Fallback para armazenamento local (AsyncStorage)
- ✅ Rastreamento contínuo de movimento
- ✅ Controle de permissões

### 2. **Hook Personalizado** (`hooks/useLocation.ts`)
- ✅ Gerenciamento de estado de localização
- ✅ Controle de permissões
- ✅ Métodos para solicitar permissão e obter localização
- ✅ Rastreamento contínuo e limpeza de dados

### 3. **Modal de Permissões** (`app/screens/teste/components/location/LocationPermissionModal.tsx`)
- ✅ Interface amigável para solicitar permissão
- ✅ Feedback visual de sucesso
- ✅ Tratamento de erros
- ✅ Opção para habilitar depois

### 4. **Integração com Telas**
- ✅ Tela de Teste: Demonstração de funcionalidades
- ✅ Tela de Início de Corrida: Solicita permissão antes de iniciar aluguel

## ⚙️ Configuração do Supabase

### Passo 1: Criar Credenciais no Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto ou use um existente
3. Vá para **Settings → API** para encontrar suas credenciais:
   - **Project URL** (SUPABASE_URL)
   - **Anon Key** (SUPABASE_ANON_KEY)

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**Importante:** As variáveis devem começar com `EXPO_PUBLIC_` para serem expostas ao aplicativo Expo.

### Passo 3: Criar Tabela de Localizações (Supabase)

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Criar tabela de localizações do usuário
CREATE TABLE public.user_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  accuracy FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  
  -- Índices para melhor performance
  CONSTRAINT user_locations_unique UNIQUE(user_id, created_at)
);

-- Criar índice para consultas rápidas
CREATE INDEX idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX idx_user_locations_created_at ON public.user_locations(created_at);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Permitir que o usuário insira suas próprias localizações
CREATE POLICY "Usuários podem inserir suas próprias localizações"
  ON public.user_locations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir que o usuário veja suas próprias localizações
CREATE POLICY "Usuários podem ver suas próprias localizações"
  ON public.user_locations
  FOR SELECT
  USING (auth.uid() = user_id);
```

## 📱 Permissões no App

### iOS (app.json)

```json
"ios": {
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "Precisamos acessar sua localização para aluguel de patinetes",
    "NSLocationAlwaysAndWhenInUseUsageDescription": "Precisamos acessar sua localização para rastreamento de corrida"
  }
}
```

### Android (app.json)

```json
"android": {
  "permissions": [
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION"
  ]
}
```

## 💻 Como Usar

### 1. Solicitar Permissão de Localização

```tsx
import { useLocation } from '@/hooks/useLocation';

const MyComponent = () => {
  const { requestPermission, hasPermission } = useLocation();

  const handleLocationRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      console.log('Localização habilitada!');
    }
  };

  return (
    <TouchableOpacity onPress={handleLocationRequest}>
      <Text>Habilitar Localização</Text>
    </TouchableOpacity>
  );
};
```

### 2. Obter Localização Atual

```tsx
import { useLocation } from '@/hooks/useLocation';

const MyComponent = () => {
  const { location, getCurrentLocation } = useLocation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Text>
      Latitude: {location?.latitude}, Longitude: {location?.longitude}
    </Text>
  );
};
```

### 3. Rastrear Movimento em Tempo Real

```tsx
import { useLocation } from '@/hooks/useLocation';

const RideComponent = () => {
  const { startTracking } = useLocation();

  const handleStartTracking = async () => {
    await startTracking((location) => {
      console.log('Nova localização:', location);
      // Salvar ou processar a localização
    });
  };

  return (
    <TouchableOpacity onPress={handleStartTracking}>
      <Text>Iniciar Rastreamento</Text>
    </TouchableOpacity>
  );
};
```

### 4. Mostrar Modal de Permissão

```tsx
import { LocationPermissionModal } from '@/app/screens/teste/components/location/LocationPermissionModal';

const MyComponent = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text>Solicitar Permissão</Text>
      </TouchableOpacity>

      <LocationPermissionModal 
        visible={visible}
        onDismiss={() => setVisible(false)}
        enableOnClose={true}
      />
    </>
  );
};
```

## 🔄 Fluxo de Fallback

```
┌─────────────────────────────────┐
│  Tentar Obter Localização       │
└──────────────┬──────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    [GPS OK]   [GPS Falhou/Negado]
        │             │
        │             └─────────────────────────┐
        │                                       │
        ▼                                       ▼
   Usar GPS                      Recuperar do AsyncStorage
   Salvar Local                           │
   Sincronizar Supabase                   ▼
                                    [Dados Locais OK]
                                         │
                                         ▼
                                    Usar Dados Locais
                                    (até 5 minutos)
```

## 📊 Estrutura de Dados

### LocationData
```typescript
interface LocationData {
  latitude: number;      // Latitude do usuário
  longitude: number;     // Longitude do usuário
  accuracy?: number;     // Acurácia em metros
  timestamp: number;     // Timestamp em ms
}
```

### UseLocationReturn
```typescript
interface UseLocationReturn {
  location: LocationData | null;                              // Localização atual
  loading: boolean;                                            // Carregando?
  error: string | null;                                        // Mensagem de erro
  hasPermission: boolean;                                      // Tem permissão?
  source: 'gps' | 'local' | 'none';                          // Fonte da localização
  requestPermission: () => Promise<boolean>;                  // Solicitar permissão
  getCurrentLocation: () => Promise<void>;                    // Obter localização
  startTracking: (callback?: Function) => Promise<void>;     // Iniciar rastreamento
  clearLocation: () => Promise<void>;                         // Limpar dados
}
```

## ⚠️ Importante

1. **Variáveis de Ambiente**: Configure `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` no `.env.local`
2. **Banco de Dados**: Crie a tabela `user_locations` conforme o SQL acima
3. **Segurança RLS**: O Supabase usa Row Level Security, certifique-se de que está ativado
4. **Android Runtime Permissions**: O `expo-location` solicita permissões automaticamente no Android
5. **iOS Info.plist**: Certifique-se de que as mensagens de permissão estão em português ou idioma desejado

## 🧪 Testando

### Tela de Teste (`/screens/teste`)
- Visualize o status de permissões
- Teste a solicitação de localização
- Veja a localização em tempo real (quando GPS está disponível)

### Tela de Início de Corrida (`/screens/inicio-corrida`)
- A permissão é solicitada automaticamente ao abrir
- O rastreamento inicia quando o usuário clica em "Iniciar Corrida"
- Status de localização é exibido visualmente

## 🔍 Troubleshooting

### "Cannot find module" Errors
- Certifique-se de usar o alias `@/` para importações
- Verificar se os arquivos foram criados no local correto

### Permissão Negada no Android
- Vá para Configurações → Aplicativos → [Seu App] → Permissões
- Ative a permissão de Localização

### Permissão Negada no iOS
- Vá para Configurações → Privacidade → Localização → [Seu App]
- Selecione "Durante o Uso do App"

### Não Sincroniza com Supabase
- Verifique as credenciais no `.env.local`
- Certifique-se de que a tabela `user_locations` foi criada
- Verifique as políticas de RLS no Supabase
- O usuário deve estar autenticado

### Sempre Usa "Armazenamento Local"
- Verifique se o GPS está ativado no dispositivo
- Teste em um local com boa cobertura GPS
- Verifique as permissões do aplicativo em Configurações

## 📚 Recursos Adicionais

- [Documentação Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Documentação Supabase](https://supabase.com/docs)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [React Native Geolocation](https://reactnative.dev/docs/geolocation)

## ✅ Checklist Final

- [ ] Configurar variáveis de ambiente (`.env.local`)
- [ ] Criar tabela `user_locations` no Supabase
- [ ] Ativar RLS no Supabase
- [ ] Testar solicitar permissão no dispositivo
- [ ] Testar obter localização
- [ ] Testar rastreamento contínuo
- [ ] Testar fallback para armazenamento local (desativar GPS)
- [ ] Testar sincronização com Supabase
- [ ] Testar no iOS e Android
