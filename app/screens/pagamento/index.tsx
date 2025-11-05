import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const paymentMethods = [
  { key: 'debito', label: 'Débito' },
  { key: 'credito', label: 'Crédito' },
  { key: 'pix', label: 'Pix' },
];

export default function Pagamento() {
  const [selected, setSelected] = useState('debito');
  const valorSimulado = 'R$ 12,90';
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento</Text>
      <Text style={styles.valueLabel}>Valor da Corrida</Text>
      <Text style={styles.value}>{valorSimulado}</Text>
      <Text style={styles.methodLabel}>Escolha o método de pagamento:</Text>
      <View style={styles.methodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.key}
            style={[
              styles.methodButton,
              selected === method.key && styles.methodButtonSelected,
            ]}
            onPress={() => setSelected(method.key)}
          >
            <Text
              style={[
                styles.methodText,
                selected === method.key && styles.methodTextSelected,
              ]}
            >
              {method.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Campos de cartão */}
      {(selected === 'debito' || selected === 'credito') && (
        <View style={styles.cardForm}>
          <TextInput style={styles.input} placeholder="Número do cartão" keyboardType="numeric" maxLength={19} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Validade (MM/AA)" maxLength={5} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="CVV" keyboardType="numeric" maxLength={4} secureTextEntry />
          </View>
          <TextInput style={styles.input} placeholder="Nome impresso no cartão" />
        </View>
      )}

      {/* QR Code Pix */}
      {selected === 'pix' && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Escaneie o QR Code para pagar com Pix:</Text>
          <Image source={require('../../../assets/images/qrcode-pix.png')} style={styles.qrImage} />
        </View>
      )}

      <TouchableOpacity style={styles.payButton} onPress={() => router.push('/screens/teste')}>
        <Text style={styles.payButtonText}>Confirmar Pagamento</Text>
      </TouchableOpacity>
    </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 24,
  },
  methodLabel: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 8,
  },
  methodsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  methodButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  methodButtonSelected: {
    backgroundColor: '#2563eb',
  },
  methodText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  methodTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  payButton: {
    marginTop: 16,
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardForm: {
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
});
