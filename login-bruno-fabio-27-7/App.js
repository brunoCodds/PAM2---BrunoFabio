import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function handleLogin() {
    // Aqui ainda não tem backend, então só validação básica local.
    // Depois é só trocar essa função por uma chamada de API (fetch/axios).
    if (!email || !senha) {
      setErro('Preencha e-mail e senha para continuar.');
      return;
    }
    setErro('');
    console.log('Tentando login com:', { email, senha });
    // ex: futura integração -> await api.post('/login', { email, senha })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={{ uri: 'https://template.canva.com/EAGQZgd0Tgc/1/0/1600w-5r5hKbLi6Fg.jpg' }}
          style={styles.logo}
        />

        <Text style={styles.titulo}>Bem-vindo de volta</Text>
        <Text style={styles.subtitulo}>Entre com sua conta</Text>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua senha"
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <TouchableOpacity style={styles.botao} onPress={handleLogin}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log('Ir para cadastro')}>
            <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  erro: {
    color: '#d32f2f',
    fontSize: 13,
    marginTop: 12,
  },
  botao: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#2563eb',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
});