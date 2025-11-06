import React, { useState, type FC } from 'react';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';

// --- Constantes de Estilo (Baseadas no Tailwind/Design Original) ---
const PRIMARY_COLOR = '#3B82F6';
const BACKGROUND_LIGHT = '#F9FAFB';
const TEXT_DARK = '#1F2937'; // gray-900
const BORDER_COLOR = '#D1D5DB'; // gray-300
const ERROR_COLOR = '#DC2626'; // red-600
const ICON_COLOR = '#9CA3AF'; // default icon color (gray-400)

// Altura da tela para ajuste de layout
const { height } = Dimensions.get('window');

// --- Componente Customizado para Ícones (Placeholder) ---
// Em um projeto React Native real, você usaria:
// import Icon from 'react-native-vector-icons/MaterialIcons';
const IconPlaceholder: FC<{ name: string; style?: any }> = ({ name, style }) => (
  <Text style={[{ fontSize: 24 }, style]}>
    {name === 'person' && '👤'}
    {name === 'mail' && '✉️'}
    {name === 'call' && '📞'}
    {name === 'visibility' && '👁️'}
    {name === 'visibility_off' && '🔒'}
    {name === 'arrow_back' && '⬅️'}
  </Text>
);

// --- Componente Principal ---
const CreateAccountScreen = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('seuemail@exemplo.com');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // Validações locais
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handleRegister = () => {
    // Validação final antes de submeter
    if (!fullName.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor insira seu nome completo.');
      return;
    }
    if (!isEmailValid) {
      Alert.alert('E-mail inválido', 'Verifique o formato do e-mail.');
      return;
    }
    if (!isPasswordValid) {
      Alert.alert('Senha inválida', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    // Simular cadastro efetuado
    console.log('Dados de Cadastro:', { fullName, email, phone, password });
    Alert.alert('Cadastro realizado', 'Sua conta foi criada com sucesso.');
    // Limpar campos
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
  };

  // Validações reativas
  React.useEffect(() => {
    // valida email simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
    setIsPasswordValid(password.length >= 8);
    // telefone: considerar apenas dígitos e exigir pelo menos 10 números
    const digits = phone.replace(/\D/g, '');
    setIsPhoneValid(digits.length >= 10);
  }, [email, password, phone]);

  interface InputFieldProps {
    label: string;
    iconName: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: any;
    secureTextEntry?: boolean;
    errorMessage?: string | null;
    showToggle?: boolean;
    onToggle?: () => void;
  }

  const InputField: FC<InputFieldProps> = ({
    label,
    iconName,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
    errorMessage,
    showToggle = false,
    onToggle,
  }) => {
    const inputStyle = [
      styles.input,
      errorMessage ? styles.inputError : styles.inputDefault,
      secureTextEntry ? styles.inputWithTogglePadding : null,
    ];

    // Se houver mensagem de erro, o ícone também fica vermelho
  // Não utilizar styles.icon.color (StyleSheet.create retorna números).
  const iconColor = errorMessage ? ERROR_COLOR : ICON_COLOR;

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={inputStyle}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            // Garante que o focus traga o teclado certo e o retorno de linha seja 'next'
            returnKeyType="next" 
          />
          <View style={styles.iconPosition}>
            {showToggle ? (
              <TouchableOpacity onPress={onToggle}>
                <IconPlaceholder
                  name={isPasswordVisible ? 'visibility' : 'visibility_off'}
                  style={{ color: iconColor }}
                />
              </TouchableOpacity>
            ) : (
              <IconPlaceholder name={iconName} style={{ color: iconColor }} />
            )}
          </View>
        </View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconPlaceholder name="arrow_back" style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Criar Conta</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Nome Completo"
            iconName="person"
            placeholder="Insira seu nome completo"
            value={fullName}
            onChangeText={setFullName}
          />

          <InputField
            label="E-mail"
            iconName="mail"
            placeholder="Insira seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            // O erro é exibido se isEmailValid for false
            errorMessage={!isEmailValid ? 'Formato de e-mail inválido.' : null}
          />

          <InputField
            label="Telefone"
            iconName="call"
            placeholder="(DD) 9XXXX-XXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <InputField
            label="Crie sua Senha"
            iconName="visibility_off"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            showToggle={true}
            onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          <View style={styles.buttonSpacing}>
            <TouchableOpacity
              style={[styles.button, !fullName || !isEmailValid || !isPasswordValid ? styles.buttonDisabled : null]}
              onPress={handleRegister}
              disabled={!fullName || !isEmailValid || !isPasswordValid}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Já tenho conta.
            {' '}
            <Text
              style={styles.loginLink}
              onPress={() => console.log('Ir para Login')}
            >
              Fazer login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- StyleSheet para React Native ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT, // Cor de fundo claro
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: height * 0.05, // Espaçamento superior ajustável
    paddingBottom: 32,
    minHeight: height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  backIcon: {
    color: '#6B7280', // gray-500
  },
  title: {
    fontSize: 24,
    fontWeight: '700', // bold
    color: TEXT_DARK,
    // [REMOVIDO: fontFamily: 'Inter_700Bold'] -> Correção de erro de fonte
  },
  form: {
    // Espaçamento entre campos é controlado por margem em cada inputContainer
  },
  inputContainer: {
    marginBottom: 24, // espaçamento entre campos (substitui gap)
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563', // gray-700
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 52, // py-3 (12px * 2 + altura)
    borderRadius: 12, // rounded-DEFAULT (0.75rem)
    paddingLeft: 16, // pl-4
    paddingRight: 40, // pr-10 (para o ícone)
    backgroundColor: '#FFFFFF',
    color: TEXT_DARK,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
  },
  inputDefault: {
    borderColor: BORDER_COLOR, // ring-1 ring-gray-300
  },
  inputError: {
    borderColor: ERROR_COLOR, // border-red-500 ring-red-500
    borderWidth: 2,
  },
  inputWithTogglePadding: {
    paddingRight: 40, // Garante espaço para o botão de toggle
  },
  iconPosition: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  icon: {
    color: '#9CA3AF', // gray-400
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: ERROR_COLOR,
  },
  buttonSpacing: {
    paddingTop: 16, // pt-4
  },
  button: {
    width: '100%',
    borderRadius: 12, // rounded-DEFAULT
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14, // py-3.5
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    // [REMOVIDO: fontFamily: 'Inter_600SemiBold'] -> Correção de erro de fonte
  },
  footer: {
    marginTop: 32, // mt-8
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4B5563', // gray-600
  },
  loginLink: {
    fontWeight: '500',
    color: PRIMARY_COLOR,
  },
});

export default CreateAccountScreen;