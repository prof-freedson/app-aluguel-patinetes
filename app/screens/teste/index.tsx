<<<<<<< HEAD
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "App" }} />
      <Stack.Screen name="screens/teste/index" options={{ title: "Teste" }} />
      <Stack.Screen name="configuracoes-usuario" options={{ title: "Configurações" }} />
    </Stack>
=======
import '../../styles/global.css'
import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Teste() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Tela inicial de teste do app!
      </Text>

      <Link href="/screens/detalhes-patinete" asChild>
        <TouchableOpacity className="mt-6 bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-bold text-lg">
            Ver Patinetes
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Botão para abrir a tela de cadastro */}
      <Link href="/screens/cadastro" asChild>
        <TouchableOpacity className="mt-4 bg-green-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-bold text-lg">Cadastrar</Text>
        </TouchableOpacity>
      </Link>
    </View>
>>>>>>> upstream
  );
}
