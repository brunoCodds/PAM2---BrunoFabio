import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { usuarios } from '../data/usuarios';

export default function HomeScreen({ navigation, route }) {
  const nome = route?.params?.nome ?? 'usuário';

  function handleSair() {
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo, {nome}! 👋</Text>
      <Text style={styles.subtitulo}>Login realizado com sucesso.</Text>

      <Text style={styles.listaTitulo}>Usuários cadastrados:</Text>

      <FlatList
        style={styles.lista}
        contentContainerStyle={styles.listaConteudo}
        data={usuarios}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardEmail}>{item.email}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSair}>
        <Text style={styles.botaoTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
  },
  listaTitulo: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  lista: {
    width: '100%',
  },
  listaConteudo: {
    paddingBottom: 16,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    marginBottom: 10,
  },
  cardNome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardEmail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  botao: {
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
