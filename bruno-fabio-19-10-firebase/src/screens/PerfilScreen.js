import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import Banner from '../components/Banner';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { saveProfile } from '../services/usersService';
import { colors, space } from '../theme';
import { dataErrorMessage } from '../utils/errors';
import { formatDate } from '../utils/format';
import useForm from '../utils/useForm';
import { hasErrors, LIMITS, validateProfile } from '../utils/validation';

function ProfileView({ profile, onEdit }) {
  return (
    <Card>
      <View style={styles.identity}>
        <Avatar name={profile.name} size={64} />
        <View style={styles.identityText}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.muted}>{profile.email}</Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Membro desde</Text>
        <Text style={styles.blockValue}>{formatDate(profile.createdAt)}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Biografia</Text>
        {profile.bio ? (
          <Text style={styles.blockValue}>{profile.bio}</Text>
        ) : (
          <Text style={styles.muted}>Você ainda não escreveu uma biografia.</Text>
        )}
      </View>

      <View style={styles.actions}>
        <Button title="Editar perfil" onPress={onEdit} />
      </View>
    </Card>
  );
}

function ProfileForm({ user, profile, onDone }) {
  const toast = useToast();
  const { values, errors, setErrors, setField } = useForm({ name: profile.name, bio: profile.bio ?? '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit() {
    const cleaned = { name: values.name.trim(), bio: values.bio.trim() };
    const found = validateProfile(cleaned);
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const { postsSynced } = await saveProfile(user, cleaned);
      if (postsSynced) {
        toast('Perfil atualizado.');
      } else {
        toast('Perfil salvo, mas o nome não foi atualizado nas publicações. Salve de novo para tentar outra vez.', 'error');
      }
      onDone();
    } catch (error) {
      setFormError(dataErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <Text style={styles.formTitle}>Editar perfil</Text>
      <Banner message={formError} />

      <TextField
        label="Nome de exibição"
        value={values.name}
        onChangeText={(text) => setField('name', text)}
        error={errors.name}
        maxLength={LIMITS.nameMax}
        autoComplete="name"
        editable={!submitting}
      />
      <TextField
        label="Biografia"
        value={values.bio}
        onChangeText={(text) => setField('bio', text)}
        error={errors.bio}
        hint={`${values.bio.length}/${LIMITS.bioMax}`}
        maxLength={LIMITS.bioMax}
        placeholder="Conte um pouco sobre você"
        multiline
        editable={!submitting}
      />
      <Text style={styles.muted}>O e-mail da conta não pode ser alterado aqui.</Text>

      <View style={styles.actions}>
        <Button title="Cancelar" variant="secondary" disabled={submitting} onPress={onDone} />
        <Button title="Salvar alterações" loading={submitting} onPress={handleSubmit} />
      </View>
    </Card>
  );
}

export default function PerfilScreen({ navigation }) {
  const { user, profile } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!user) {
    return (
      <Screen narrow>
        <EmptyState title="Entre para ver seu perfil" text="O perfil fica disponível depois que você entra na sua conta.">
          <Button title="Entrar" onPress={() => navigation.navigate('Login')} />
        </EmptyState>
      </Screen>
    );
  }

  let content;
  if (profile === undefined) {
    content = <Loading label="Carregando perfil…" />;
  } else if (!profile) {
    content = <Banner message="Não foi possível carregar seu perfil. Atualize a página e tente novamente." />;
  } else if (editing) {
    content = <ProfileForm user={user} profile={profile} onDone={() => setEditing(false)} />;
  } else {
    content = <ProfileView profile={profile} onEdit={() => setEditing(true)} />;
  }

  return (
    <Screen narrow>
      <Text style={styles.heading}>Meu perfil</Text>
      {content}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  identityText: { flex: 1, gap: 2 },
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  muted: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  block: { gap: space.xs, paddingTop: space.lg, borderTopWidth: 1, borderTopColor: colors.border },
  blockLabel: { fontSize: 14, fontWeight: '600', color: colors.muted },
  blockValue: { fontSize: 16, color: colors.text, lineHeight: 24 },
  formTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: space.sm, flexWrap: 'wrap' },
});
