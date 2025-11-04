import { Stack } from "expo-router";
import "./styles/global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "App" }} />
      <Stack.Screen name="screens/teste" options={{ title: "Teste" }} />
  <Stack.Screen name="page10/mapa" options={{ title: "Mapa" }} />
    </Stack>
  );
}