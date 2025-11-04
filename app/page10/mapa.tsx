import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MapaScreen() {
  return (
    <View className="flex-1 relative">
      <ImageBackground
        source={{ uri: "https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AvH7fb-tzLapLAFVOxFp7dw.png" }}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Botão menu */}
        <TouchableOpacity className="absolute top-10 left-5 bg-white p-3 rounded-full shadow">
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>

        {/* Botão perfil */}
        <TouchableOpacity className="absolute top-10 right-5 bg-white p-3 rounded-full shadow">
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>

        {/* Marcadores de patinetes */}
        {/* Verde - 95% */}
        <View className="absolute left-[80px] top-[150px] items-center">
          <View className="bg-white px-2 py-0.5 rounded-full shadow">
            <Text className="text-xs font-semibold">95%</Text>
          </View>
          <View className="w-6 h-6 bg-green-500 rounded-full mt-1 shadow" />
        </View>

        {/* Amarelo - 45% */}
        <View className="absolute right-[120px] top-[300px] items-center">
          <View className="bg-white px-2 py-0.5 rounded-full shadow">
            <Text className="text-xs font-semibold">45%</Text>
          </View>
          <View className="w-6 h-6 bg-yellow-400 rounded-full mt-1 shadow" />
        </View>

        {/* Vermelho - 15% */}
        <View className="absolute left-[100px] bottom-[230px] items-center">
          <View className="bg-white px-2 py-0.5 rounded-full shadow">
            <Text className="text-xs font-semibold">15%</Text>
          </View>
          <View className="w-6 h-6 bg-red-500 rounded-full mt-1 shadow" />
        </View>

        {/* Verde - 88% */}
        <View className="absolute right-[80px] bottom-[180px] items-center">
          <View className="bg-white px-2 py-0.5 rounded-full shadow">
            <Text className="text-xs font-semibold">88%</Text>
          </View>
          <View className="w-6 h-6 bg-green-500 rounded-full mt-1 shadow" />
        </View>

        {/* Ponto azul central */}
        <View className="absolute left-[50%] top-[50%] -ml-1 -mt-1 w-2 h-2 bg-blue-600 rounded-full" />

        {/* Botão Escanear QR */}
        <View className="absolute bottom-14 w-full items-center">
          <TouchableOpacity className="flex-row items-center bg-green-600 px-6 py-3 rounded-full shadow">
            <Ionicons name="qr-code-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Escanear QR
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão de localização */}
        <TouchableOpacity className="absolute bottom-24 right-5 bg-white p-3 rounded-full shadow">
          <Ionicons name="locate-outline" size={22} color="black" />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
