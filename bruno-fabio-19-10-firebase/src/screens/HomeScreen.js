import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Banner from '../components/Banner';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import Screen from '../components/Screen';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { createPost, deletePost, subscribePosts, updatePost } from '../services/postsService';
import { colors, space } from '../theme';
import { dataErrorMessage } from '../utils/errors';

export default function HomeScreen({ navigation }) {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [posts, setPosts] = useState(null); // null = carregando
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setPosts(null);
    setLoadError('');
    return subscribePosts(setPosts, (error) => {
      setLoadError(dataErrorMessage(error));
      setPosts([]);
    });
  }, [attempt]);

  async function handleCreate(values) {
    await createPost(user, profile.name, values);
    toast('Publicação criada.');
  }

  async function handleSave(post, values) {
    await updatePost(post.id, values);
    toast('Publicação atualizada.');
  }

  async function handleDelete(post) {
    await deletePost(post.id);
    toast('Publicação excluída.');
  }

  return (
    <Screen>
      <View style={styles.intro}>
        <Text style={styles.heading}>Mural de sugestões</Text>
        <Text style={styles.subheading}>Compartilhe ideias e opiniões sobre projetos.</Text>
      </View>

      {user ? (
        <Card>
          <Text style={styles.cardTitle}>Nova publicação</Text>
          {profile === null ? (
            <Banner message="Não foi possível carregar seu perfil, por isso não dá para publicar agora. Atualize a página e tente novamente." />
          ) : null}
          <PostForm submitLabel="Publicar" onSubmit={handleCreate} resetOnSuccess disabled={!profile} />
        </Card>
      ) : (
        <Card>
          <Text style={styles.cardTitle}>Quer participar?</Text>
          <Text style={styles.cardText}>Entre ou crie uma conta para publicar suas sugestões no mural.</Text>
          <View style={styles.row}>
            <Button title="Criar conta" onPress={() => navigation.navigate('Cadastro')} />
            <Button title="Entrar" variant="secondary" onPress={() => navigation.navigate('Login')} />
          </View>
        </Card>
      )}

      {loadError ? (
        <View style={styles.errorBox}>
          <Banner message={loadError} />
          <Button title="Tentar novamente" variant="secondary" onPress={() => setAttempt((n) => n + 1)} />
        </View>
      ) : null}

      {posts === null ? (
        <Loading label="Carregando publicações…" />
      ) : posts.length === 0 && !loadError ? (
        <EmptyState
          title="Nenhuma publicação ainda"
          text={user ? 'Use o formulário acima para publicar a primeira.' : 'Crie uma conta para publicar a primeira.'}
        />
      ) : (
        <View style={styles.feed}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={Boolean(user) && post.authorId === user.uid}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: space.xs },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  subheading: { fontSize: 16, color: colors.muted },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardText: { fontSize: 15, color: colors.muted, lineHeight: 22 },
  row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  errorBox: { gap: space.md, alignItems: 'flex-start' },
  feed: { gap: space.lg },
});
