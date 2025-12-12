# Guia de Testes - Localização e Supabase

## 🧪 Testando a Implementação

### Pré-requisitos
- ✅ Variáveis de ambiente configuradas (`.env.local`)
- ✅ Supabase projeto criado
- ✅ Tabela `user_locations` criada no banco de dados
- ✅ Dependências instaladas (`npm install`)

---

## 1️⃣ Teste: Solicitar Permissão de Localização

### Passos
1. Abra o app em um dispositivo/emulador
2. Vá para a tela de Teste (`/screens/teste`)
3. Clique no botão "Habilitar Localização"
4. Um modal deve aparecer pedindo permissão

### Comportamento Esperado
- **iOS**: Dialog pedindo "Permitir uso de localização"
- **Android**: Dialog pedindo "Permitir acesso à localização"
- Ao clicar "Permitir" → Modal mostra "✓ Localização Habilitada"
- Status na tela deve mudar para "✓ Ativada"

### Troubleshooting
- ❌ Modal não aparece → Verifique se `LocationPermissionModal.tsx` foi criado
- ❌ Erro de importação → Verifique alias `@/` no `tsconfig.json`
- ❌ Não pede permissão → Permissão pode já estar concedida

---

## 2️⃣ Teste: Obter Localização Atual

### Passos
1. Após habilitar permissão (Teste 1)
2. Volte para tela de Teste
3. Verifique se "Latitude" e "Longitude" aparecem
4. Clique novamente em "Habilitar Localização" para atualizar

### Comportamento Esperado
```
Latitude: -23.550520
Longitude: -46.633309
Fonte: GPS
```

### Troubleshooting
- ❌ Mostra "Fonte: Armazenamento Local" → GPS não disponível ou negado
- ❌ Mostra "Fonte: Nenhuma" → Sem dados locais também
- ❌ Coordenadas 0,0 → Aguarde alguns segundos para GPS fixar

---

## 3️⃣ Teste: Armazenamento Local (Fallback)

### Passos
1. Obter localização com GPS habilitado (Teste 2)
2. Desativar GPS do dispositivo
3. Fechar o app
4. Reabrir o app
5. Na tela de Teste, visualizar status

### Comportamento Esperado
- Mesmo sem GPS, deve mostrar "Latitude" e "Longitude" do cache
- Fonte deve ser "Armazenamento Local"
- Dados devem ser válidos por até 5 minutos

### Troubleshooting
- ❌ Sem dados → Tempo de cache expirou (> 5 minutos) ou não foi obtida antes
- ✅ Solução → Obter localização novamente com GPS ativo

---

## 4️⃣ Teste: Sincronização com Supabase

### Pré-requisito
- Usuário deve estar autenticado no Supabase

### Passos
1. Fazer login na aplicação (se houver autenticação)
2. Habilitar permissão de localização
3. Obter localização
4. Abrir Supabase Console
5. Ir para SQL Editor
6. Executar:

```sql
SELECT * FROM user_locations 
WHERE user_id = (SELECT auth.uid())
ORDER BY created_at DESC
LIMIT 10;
```

### Comportamento Esperado
```
id                              | user_id                         | latitude    | longitude   | created_at
--------------------------------|---------------------------------|-------------|-------------|-------------------
550e8400-e29b-41d4-a716...     | 123e4567-e89b-12d3-a456...     | -23.550520  | -46.633309  | 2025-11-25 14:30:45.123
```

### Troubleshooting
- ❌ Nenhum registro → Usuário não está autenticado
- ❌ Nenhum registro → Supabase credenciais incorretas
- ❌ Erro de conexão → Verifique internet do dispositivo
- ✅ Solução → Ver logs no console: `console.log` no `locationService.ts`

---

## 5️⃣ Teste: Rastreamento Contínuo

### Passos
1. Abra tela "Iniciar Corrida" (`/screens/inicio-corrida`)
2. Se sem permissão → Modal aparece, clique "Habilitar"
3. Clique em "Iniciar Corrida"
4. Caminhe ou dirija pelo mapa (mínimo 10 metros)
5. Aguarde 10 segundos para próxima atualização

### Comportamento Esperado
- Localização se atualiza a cada 10 segundos OU 10 metros
- Cada atualização é salva em AsyncStorage
- Se autenticado → Sincroniza com Supabase
- No Supabase SQL:

```sql
SELECT COUNT(*) as total FROM user_locations 
WHERE user_id = (SELECT auth.uid())
AND created_at > NOW() - INTERVAL '1 minute';
```

Deve mostrar múltiplas entradas em curto período

### Troubleshooting
- ❌ Não atualiza → Talvez não tenha se movido 10 metros ainda
- ⏱️ Teste demore: Mova-se mais de 10 metros ou aguarde 10 segundos
- ❌ Não sincroniza → Verifique autenticação e internet

---

## 6️⃣ Teste: Offline Mode (Sem Internet)

### Passos
1. Desativar WiFi e dados móveis
2. Habilitar localização (vai usar AsyncStorage)
3. Obter localização via GPS
4. Dados devem aparecer na tela
5. Verificar AsyncStorage localmente

### Verificar AsyncStorage via React Native Debugger

```javascript
// No console do debugger, executar:
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getItem('@location_data').then(console.log);
```

### Comportamento Esperado
```json
{
  "latitude": -23.550520,
  "longitude": -46.633309,
  "accuracy": 8.5,
  "timestamp": 1732535445123
}
```

### Troubleshooting
- ❌ Dados vazios → Nenhuma localização foi obtida com GPS ativo
- ❌ Erro de import → Verificar se AsyncStorage foi instalado

---

## 7️⃣ Teste: Permissão Negada

### iOS
1. Ir para Configurações → Privacidade → Localização
2. Encontrar seu app
3. Mudar para "Nunca"
4. Reabrir app

### Android
1. Ir para Configurações → Aplicativos
2. Encontrar seu app
3. Ir para Permissões
4. Desativar "Localização"
5. Reabrir app

### Comportamento Esperado
- Status mostra "✗ Desativada"
- Sem botão ou botão desabilitado para obter localização
- Modal pode aparecer solicitando permissão novamente

### Troubleshooting
- ❌ Não solicita permissão → Pode já estar negada permanentemente
- ✅ Solução iOS → Ir para Configurações → Reset Location & Privacy
- ✅ Solução Android → Desinstalar/reinstalar app

---

## 8️⃣ Teste: Performance e Battery

### Monitorar Consumo

```tsx
// Adicione ao seu componente para monitorar
useEffect(() => {
  const startTime = Date.now();
  
  startTracking(() => {
    const elapsed = Date.now() - startTime;
    console.log(`Rastreamento ativo há ${elapsed}ms`);
  });
}, []);
```

### Comportamento Esperado
- Battery drain esperado: ~5-10% por hora em rastreamento contínuo
- Sem rastreamento: < 1% por hora
- Intervalos de 10s e 10m são otimizados para bateria

### Otimizações Possíveis

Se houver consumo excessivo:

```typescript
// Em locationService.ts, aumentar intervalos:
Location.watchPositionAsync({
  timeInterval: 30000,    // 30 segundos em vez de 10
  distanceInterval: 50,   // 50 metros em vez de 10
})
```

---

## 9️⃣ Teste: Precisão de Localização

### Verificar Acurácia

```javascript
// No console após obter localização:
console.log(`Acurácia: ±${location.accuracy}m`);
```

### Esperado por Tipo
| Tipo | Acurácia |
|------|----------|
| GPS Indoor | ±50-100m ❌ |
| GPS Outdoor Aberto | ±5-10m ✅ |
| GPS Urbano | ±15-30m ✅ |
| Assisted-GPS | ±20-50m ⚠️ |

### Melhorar Acurácia
```typescript
// Em locationService.ts, mudar accuracy:
Location.Accuracy.Highest      // Mais preciso, mais bateria
Location.Accuracy.BestForNavigation  // Ideal para maps
Location.Accuracy.Balanced     // Padrão (atual)
Location.Accuracy.Low          // Menos preciso, menos bateria
```

---

## 🔟 Teste: Integração Completa (Cenário Real)

### Cenário: Usuário Aluga Patinete

1. **Login** → Usuário se autentica no Supabase
2. **Permissão** → Modal aparece, usuário clica "Habilitar"
3. **Seleção** → Usuário vai para "Ver Patinetes" e seleciona um
4. **Checkout** → Usuário vai para "Iniciar Corrida"
5. **Corrida** → Usuário clica "Iniciar Corrida"
   - ✅ Rastreamento inicia
   - ✅ Localização atualiza a cada movimento
   - ✅ Dados salvos em AsyncStorage (offline)
   - ✅ Dados sincronizados com Supabase (online)
6. **Término** → Usuário termina corrida
7. **Histórico** → Visualizar todas as localizações da corrida

### Verificação Final

No Supabase:
```sql
-- Contar todas as localizações do usuário
SELECT DATE(created_at), COUNT(*) as posicoes
FROM user_locations
WHERE user_id = (SELECT auth.uid())
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;
```

---

## 📋 Checklist de Testes

- [ ] Teste 1: Solicitar permissão ✅
- [ ] Teste 2: Obter localização ✅
- [ ] Teste 3: Armazenamento local (fallback) ✅
- [ ] Teste 4: Sincronização com Supabase ✅
- [ ] Teste 5: Rastreamento contínuo ✅
- [ ] Teste 6: Modo offline (sem internet) ✅
- [ ] Teste 7: Permissão negada ✅
- [ ] Teste 8: Performance e bateria ✅
- [ ] Teste 9: Precisão de localização ✅
- [ ] Teste 10: Integração completa ✅

---

## 🐛 Debug & Logging

### Ativar Logs Detalhados

Adicione ao início do `locationService.ts`:

```typescript
const DEBUG = true;

const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[LocationService] ${message}`, data || '');
  }
};

// Uso:
log('Obtendo localização...');
log('Localização obtida:', locationData);
log('Erro ao sincronizar:', error);
```

### Monitorar AsyncStorage

```typescript
// Ver tudo armazenado localmente
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getAllKeys().then(keys => {
  AsyncStorage.multiGet(keys).then(data => {
    console.log('AsyncStorage Contents:', data);
  });
});
```

### Monitorar Network

```typescript
import NetInfo from '@react-native-community/netinfo';

NetInfo.fetch().then(state => {
  console.log('Network:', {
    isConnected: state.isConnected,
    type: state.type,
  });
});
```

---

## 📊 Métricas para Produção

### Deve Monitorar

1. **Taxa de Sucesso de Permissão**
   - Objetivo: > 80%
   - Cálculo: (permissões concedidas / solicitações) × 100

2. **Taxa de Sincronização**
   - Objetivo: > 95%
   - Cálculo: (registros sincronizados / registros obtidos) × 100

3. **Latência de Localização**
   - Objetivo: < 5 segundos
   - Medir: tempo entre solicitação e resposta

4. **Taxa de Erro**
   - Objetivo: < 5%
   - Monitorar: falhas ao obter localização

---

## 🎯 Próximas Etapas Após Testes

1. ✅ Todos os testes passaram?
   - Sim → Prosseguir para produção
   - Não → Verificar troubleshooting acima

2. 🔒 Segurança
   - Implementar validação de localização no servidor
   - Limpar dados antigos regularmente

3. 📈 Analytics
   - Rastrear uso de localização
   - Monitorar erros e exceções

4. 🎨 UX
   - Adicionar indicador visual de rastreamento
   - Mostrar tempo decorrido da corrida
   - Exibir distância percorrida

---

**Última atualização:** 25 de Novembro de 2025
**Status:** Pronto para Testes
