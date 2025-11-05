import { Stack } from "expo-router";
 
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false}}>
  <Stack.Screen name="/index" options={{ title: 'App' }} />
  <Stack.Screen name="/screens/teste/index" options={{ title: 'Teste' }} />
  <Stack.Screen name="screens/RideSummary" options={{ headerShown: false }} />
  <Stack.Screen name="/screens/pagamento" options={{ title: 'Pagamento' }} />
    </Stack> 
  );
}

