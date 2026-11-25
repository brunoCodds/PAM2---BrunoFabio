import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Banner from '../components/Banner';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import TextField from '../components/TextField';
import { useToast } from '../components/Toast';
import { register } from '../services/authService';
import { colors, space } from '../theme';
import { authErrorMessage } from '../utils/errors';
import useForm from '../utils/useForm';
import { hasErrors, LIMITS, validateRegister } from '../utils/validation';

export default function CadastroScreen({ navigation }) {
  const toast = useToast();
  const { values, errors, setErrors, setField } = useForm({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit() {
    const data = { name: values.name.trim(), email: values.email.trim(), password: values.password };
    const found = validateRegister(data);
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await register(data);
      toast('Conta criada. Bem-vindo(a) ao FeedbackHub!');
      // Ao cadastrar, o usuário já fica logado e o app troca para o mural.
    } catch (error) {
      setFormError(authErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <Screen narrow>
      <Card>
        <View style={styles.titles}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Leva menos de um minuto.</Text>
        </View>

        <Banner message={formError} />

        <TextField
          label="Nome"
          value={values.name}
          onChangeText={(text) => setField('name', text)}
          error={errors.name}
          autoComplete="name"
          maxLength={LIMITS.nameMax}
          editable={!submitting}
        />
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
          hint={`Mínimo de ${LIMITS.passwordMin} caracteres.`}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          editable={!submitting}
          onSubmitEditing={handleSubmit}
        />

        <Button title="Criar conta" loading={submitting} onPress={handleSubmit} />
      </Card>

      <View style={styles.switch}>
        <Text style={styles.switchText}>Já tem conta?</Text>
        <Button title="Entrar" variant="ghost" small onPress={() => navigation.navigate('Login')} />
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
