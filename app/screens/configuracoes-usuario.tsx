import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { ArrowLeft, Pencil, Bell, CreditCard, Shield, HelpCircle, FileText } from "lucide-react-native";
import usuario from "@/data/usuario.json";

export default function ConfiguracoesUsuario() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  const handleSave = () => {
    alert("Alterações salvas!");
  };

  const handleEditPerfil = () => {
    alert("Modo de edição de perfil ativado!");
  };

  const handleVoltar = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Cabeçalho com seta de voltar */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={handleVoltar}>
          <ArrowLeft color="#3B82F6" size={26} />
        </TouchableOpacity>
      </View>

      {/* Nome do usuário centralizado e botão editar perfil */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Maria Souza</Text>
        <TouchableOpacity onPress={handleEditPerfil} className="flex-row items-center mt-2">
          <Pencil color="#3B82F6" size={18} />
          <Text className="text-blue-500 font-semibold text-base ml-2">Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Título da seção */}
      <Text className="text-lg font-semibold mb-3 text-gray-800">Dados Pessoais</Text>

      {/* Campos de dados pessoais */}
      <Text className="text-base font-medium mb-2 text-gray-700">Nome</Text>
      <TextInput
        placeholder="Digite seu nome"
        value={usuario.nome}
        className="border border-gray-300 rounded-xl p-3 mb-3"
      />

      <Text className="text-base font-medium mb-2 text-gray-700">E-mail</Text>
      <TextInput
        placeholder="Digite seu e-mail"
        value={usuario.email}
        keyboardType="email-address"
        className="border border-gray-300 rounded-xl p-3 mb-3"
      />

      <Text className="text-base font-medium mb-2 text-gray-700">Telefone</Text>
      <TextInput
        placeholder="Digite seu telefone"
        value={usuario.telefone}
        keyboardType="phone-pad"
        className="border border-gray-300 rounded-xl p-3 mb-3"
      />

      {/* Ajustes da Conta */}
      <View className="mt-6">
        <Text className="text-lg font-semibold mb-3 text-gray-800">Ajustes da Conta</Text>

        <Link href="../(tabs)/notificacoes" asChild>
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
            <Bell color="#3B82F6" size={22} />
            <Text className="ml-3 text-gray-700 text-base">Notificações</Text>
          </TouchableOpacity>
        </Link>

        <Link href="../(tabs)/pagamento" asChild>
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
            <CreditCard color="#3B82F6" size={22} />
            <Text className="ml-3 text-gray-700 text-base">Pagamento</Text>
          </TouchableOpacity>
        </Link>

        <Link href="../(tabs)/seguranca" asChild>
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
            <Shield color="#3B82F6" size={22} />
            <Text className="ml-3 text-gray-700 text-base">Segurança</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Suporte */}
      <View className="mt-6">
        <Text className="text-lg font-semibold mb-3 text-gray-800">Suporte</Text>

        <Link href="../(tabs)/ajuda" asChild>
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
            <HelpCircle color="#3B82F6" size={22} />
            <Text className="ml-3 text-gray-700 text-base">Ajuda & Suporte</Text>
          </TouchableOpacity>
        </Link>

        <Link href="../(tabs)/termos" asChild>
          <TouchableOpacity className="flex-row items-center py-3">
            <FileText color="#3B82F6" size={22} />
            <Text className="ml-3 text-gray-700 text-base">Termos de Serviço</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Botões */}
      <TouchableOpacity
        className="bg-blue-500 rounded-xl py-3 mt-8"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold text-center">
          Salvar alterações
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-3" onPress={handleLogout}>
        <Text className="text-red-500 text-center">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
