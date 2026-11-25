import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Banner from '../components/Banner';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import { useToast } from '../components/Toast';
import { login } from '../services/authService';
import { colors, space } from '../theme';
import { authErrorMessage } from '../utils/errors';
import useForm from '../utils/useForm';
import { hasErrors, validateLogin } from '../utils/validation';

export default function LoginScreen({ navigation }) {
  const toast = useToast();
  const { values, errors, setErrors, setField } = useForm({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit() {
    const credentials = { email: values.email.trim(), password: values.password };
    const found = validateLogin(credentials);
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await login(credentials);
      toast('Login realizado.');
      // Ao entrar, o app troca automaticamente para o mural.
    } catch (error) {
      setFormError(authErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <Screen narrow>
      <Card>
        <View style={styles.titles}>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta para publicar no mural.</Text>
        </View>

        <Banner message={formError} />

        <TextField
          label="E-mail"
          value={values.email}
          onChangeText={(text) => setField('email', text)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          editable={!submitting}
        />
        <TextField
          label="Senha"
          value={values.password}
          onChangeText={(text) => setField('password', text)}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          editable={!submitting}
          onSubmitEditing={handleSubmit}
        />

        <Button title="Entrar" loading={submitting} onPress={handleSubmit} />
      </Card>

      <View style={styles.switch}>
        <Text style={styles.switchText}>Ainda não tem conta?</Text>
        <Button title="Criar conta" variant="ghost" small onPress={() => navigation.navigate('Cadastro')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titles: { gap: space.xs },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  subtitle: { fontSize: 15, color: colors.muted },
  switch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xs },
  switchText: { fontSize: 15, color: colors.muted },
});
