import { Stack } from "expo-router";

export default function RootLayout() {
  return (
<<<<<<< HEAD
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "App" }} />
      <Stack.Screen name="configuracoes-usuario" options={{ title: "Configurações do Usuário" }} />
=======
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "App" }} />
      <Stack.Screen name="screens/teste/index" options={{ title: "Teste" }} />
      <Stack.Screen name="screens/RideSummary" options={{ headerShown: false }} />
      <Stack.Screen name="screens/pagamento/index" options={{ title: "Pagamento" }} />
      <Stack.Screen
        name="screens/detalhes-patinete/index"
        options={{ title: "Patinetes" }}
      />
      <Stack.Screen
        name="screens/detalhes-patinete/[id]/index"
        options={{ title: "Detalhes do Patinete" }}
      />
>>>>>>> upstream
    </Stack>
  );
}
