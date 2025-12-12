# Arquitetura da Implementação de Localização

## 📐 Estrutura de Arquivos Criados

```
app-aluguel-patinetes/
├── config/
│   └── supabaseConfig.ts              ← Configuração do Supabase
├── services/
│   └── locationService.ts             ← Serviço de localização (GPS + AsyncStorage)
├── hooks/
│   └── useLocation.ts                 ← Hook personalizado para gerenciar localização
├── app/screens/
│   ├── teste/
│   │   ├── index.tsx                  ← Tela de teste atualizada
│   │   └── components/location/
│   │       └── LocationPermissionModal.tsx  ← Modal de permissão
│   └── inicio-corrida/
│       └── index.tsx                  ← Tela de corrida atualizada
├── app.json                           ← Atualizado com permissões iOS/Android
├── .env.local.example                 ← Template de variáveis de ambiente
└── LOCATION_SETUP.md                  ← Documentação completa
```

## 🔗 Fluxo de Dados

### 1️⃣ Inicialização da Aplicação

```
App Inicia
    ↓
useLocation Hook Verificado
    ↓
┌─────────────────────────────────┐
│ Tem Permissão de Localização?  │
└─────────────────────────────────┘
    ├─ SIM → Obter Localização via GPS
    └─ NÃO → Mostrar Modal de Permissão
```

### 2️⃣ Obtenção de Localização

```
getCurrentLocation()
    ↓
┌─────────────────────────────────┐
│ Solicitar Localização GPS       │
└─────────────────────────────────┘
    ├─ ✅ Sucesso
    │   ├─ Salvar em AsyncStorage
    │   ├─ Sincronizar com Supabase
    │   └─ Retornar dados
    │
    └─ ❌ Falhou
        └─ Recuperar de AsyncStorage
            ├─ ✅ Dados válidos (< 5 min)
            │   └─ Retornar dados locais
            │
            └─ ❌ Dados expirados
                └─ Erro: Sem localização
```

### 3️⃣ Rastreamento Contínuo (Durante Corrida)

```
startTracking()
    ↓
┌─────────────────────────────────────────┐
│ Monitorar Localização a Cada 10s       │
│ ou 10 metros de movimento              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Localização Atualizada                 │
└─────────────────────────────────────────┘
    ├─ Salvar em AsyncStorage
    ├─ Sincronizar com Supabase
    └─ Chamar Callback do Componente

[Repetir até parar rastreamento]
```

## 🏗️ Arquitetura de Componentes

```
LocationPermissionModal
    ├─ useLocation Hook
    │   ├─ LocationService
    │   │   ├─ expo-location (GPS)
    │   │   ├─ AsyncStorage (Local)
    │   │   └─ Supabase (Cloud)
    │   └─ State Management
    └─ UI (Modal com Tailwind)

┌─────────────────────────────────────────┐
│         Tela de Teste                   │
├─────────────────────────────────────────┤
│  useLocation Hook                       │
│  ├─ Exibir Status de Permissão          │
│  ├─ Exibir Localização Atual            │
│  ├─ Exibir Fonte (GPS/Local)            │
│  └─ Botão para Solicitar Permissão      │
│      → Exibe Modal de Permissão         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Tela de Início de Corrida          │
├─────────────────────────────────────────┤
│  useLocation Hook                       │
│  ├─ Verificar Permissão ao Abrir        │
│  ├─ Exibir Status de Localização        │
│  └─ Iniciar Rastreamento ao Clicar      │
│      "Iniciar Corrida"                  │
│      → Sincroniza com Supabase          │
└─────────────────────────────────────────┘
```

## 📦 Dependências Adicionadas

```json
{
  "expo-location": "^16.7.0+",
  "@supabase/supabase-js": "^2.38.0+",
  "@react-native-async-storage/async-storage": "^1.21.0+"
}
```

## 🔐 Segurança & Privacidade

```
┌──────────────────────────────────────────┐
│   Dados de Localização                   │
└──────────────────────────────────────────┘
    │
    ├─ AsyncStorage (Dispositivo)
    │   ├─ Criptografado pelo SO
    │   └─ Apenas 5 minutos de cache
    │
    ├─ Supabase (Servidor)
    │   ├─ HTTPS Criptografado
    │   ├─ RLS (Row Level Security)
    │   ├─ Apenas usuário autenticado
    │   └─ Apenas dados do próprio usuário
    │
    └─ Expo-Location
        ├─ Usa GPS do dispositivo
        ├─ Sem compartilhamento de dados
        └─ Permissão solicitada ao usuário
```

## 💾 Banco de Dados Supabase

### Estrutura da Tabela

```sql
user_locations
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── latitude (FLOAT)
├── longitude (FLOAT)
├── accuracy (FLOAT, opcional)
├── created_at (TIMESTAMP)
└── Índices
    ├─ idx_user_locations_user_id
    └─ idx_user_locations_created_at
```

### Políticas RLS

```
ALLOW INSERT → Usuário pode inserir suas próprias localizações
ALLOW SELECT → Usuário pode ver suas próprias localizações
```

## 🎯 Casos de Uso

### Caso 1: Novo Usuário se Registra
```
1. Usuário faz login
2. Tela de teste carrega
3. Modal de permissão aparece
4. Usuário clica "Habilitar Localização"
5. Permissão solicitada no SO
6. Se concedido → Localização salva em AsyncStorage
7. Se concedido + Autenticado → Sincroniza com Supabase
```

### Caso 2: Usuário Aluga Patinete
```
1. Usuário abre tela "Iniciar Corrida"
2. Sistema verifica permissão
3. Se SIM → Mostra status "Localização Ativa"
4. Se NÃO → Mostra modal de permissão
5. Usuário clica "Iniciar Corrida"
6. Rastreamento inicia (10s + 10m)
7. Cada atualização → AsyncStorage + Supabase
8. Fim da corrida → Para rastreamento
```

### Caso 3: Sem Conexão GPS
```
1. Usuário tenta obter localização
2. GPS não disponível/negado
3. Sistema recupera do AsyncStorage
4. Se dados válidos (< 5 min) → Usa dados locais
5. Se dados inválidos → Retorna erro
6. UI mostra "Fonte: Armazenamento Local"
```

## ⚙️ Configurações Personalizáveis

```typescript
// Em locationService.ts
const MAX_LOCATION_AGE = 5 * 60 * 1000;  // 5 minutos para cache

// Em startLocationTracking
Location.watchPositionAsync({
  accuracy: Location.Accuracy.Balanced,  // ← Mudar precisão
  timeInterval: 10000,                   // ← 10 segundos
  distanceInterval: 10,                  // ← 10 metros
})
```

## 📊 Fluxo Completo: Aluguel de Patinete

```
┌─────────────────────────────────────────────────┐
│ 1. Usuário na Tela de Testes                    │
├─────────────────────────────────────────────────┤
│ • Vê status de permissão (Ativa/Desativa)       │
│ • Pode clicar "Habilitar Localização"           │
│ • Modal aparece solicitando permissão           │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 2. Usuário Clica em "Ver Patinetes"             │
├─────────────────────────────────────────────────┤
│ • Localização continua disponível               │
│ • Dados armazenados localmente                  │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 3. Usuário Clica em "Iniciar Corrida"           │
├─────────────────────────────────────────────────┤
│ • Abre tela de início de corrida                │
│ • Mostra status de localização                  │
│ • Se sem permissão → Modal aparece              │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 4. Usuário Clica "Iniciar Corrida"              │
├─────────────────────────────────────────────────┤
│ • startTracking() inicia                        │
│ • watchPositionAsync() monitora movimento       │
│ • Cada atualização:                             │
│   • Salva em AsyncStorage (backup offline)      │
│   • Envia para Supabase (se conectado)          │
│   • Callback atualiza UI                        │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 5. Durante a Corrida                            │
├─────────────────────────────────────────────────┤
│ • Localização atualizada a cada 10s             │
│ • Ou a cada 10 metros de movimento             │
│ • Dados sincronizados com Supabase              │
│ • Se offline → Recupera do AsyncStorage         │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 6. Fim da Corrida                               │
├─────────────────────────────────────────────────┤
│ • Rastreamento para                             │
│ • Última localização salva                      │
│ • Histórico armazenado no Supabase              │
└─────────────────────────────────────────────────┘
```

## 🔄 Sincronização com Supabase

```
Localização Obtida
    ↓
┌─────────────────────────────────────────┐
│ 1. Verificar Autenticação               │
└─────────────────────────────────────────┘
    ├─ Usuário logado? SIM
    │   ↓
    │   Inserir em user_locations
    │   ├─ Sucesso ✅
    │   │  └─ Log: "Localização sincronizada"
    │   └─ Erro ❌
    │      └─ Log: "Erro ao sincronizar"
    │
    └─ Usuário não logado? NÃO
        └─ Log: "Usuário não autenticado"
            └─ Apenas salva em AsyncStorage
```

## 🎨 Componentes UI Utilizados

```
LocationPermissionModal
├── Modal (React Native)
├── View (Containers)
├── Text (Textos)
├── TouchableOpacity (Botões)
├── ActivityIndicator (Loading)
└── Lucide Icons
    ├── MapPin (Ícone de localização)
    ├── AlertCircle (Ícone de erro)
    └── CheckCircle (Ícone de sucesso)

Tailwind CSS Classes
├── Flexbox (flex, flex-1, flex-row, items-center)
├── Cores (bg-blue-500, text-white, border-gray-300)
├── Espaçamento (p-4, m-6, gap-3)
├── Arredondamento (rounded-lg, rounded-xl)
└── Estados (active:scale-95, disabled:opacity-50)
```

---

**Último atualizado:** 25 de Novembro de 2025
**Versão:** 1.0.0
**Status:** ✅ Implementação Completa
