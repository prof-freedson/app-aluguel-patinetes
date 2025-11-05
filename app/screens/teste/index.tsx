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
    </View>
  );
}