import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { colors, focusRing, space } from '../theme';
import { authErrorMessage } from '../utils/errors';
import Button from './Button';
import { useToast } from './Toast';

function NavLink({ label, active, onPress }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ focused }) => [styles.link, active && styles.linkActive, focused && styles.focused]}
    >
      <Text style={[styles.linkText, active && styles.linkTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function Navbar({ navigation, current }) {
  const { user } = useAuth();
  const toast = useToast();
  const [leaving, setLeaving] = useState(false);

  async function handleLogout() {
    setLeaving(true);
    try {
      await logout();
      toast('Você saiu da conta.');
    } catch (error) {
      toast(authErrorMessage(error), 'error');
    } finally {
      setLeaving(false);
    }
  }

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="FeedbackHub, ir para o mural"
          onPress={() => navigation.navigate('Home')}
          style={({ focused }) => [styles.brand, focused && styles.focused]}
        >
          <Text style={styles.brandText}>FeedbackHub</Text>
        </Pressable>

        <View style={styles.links}>
          {user ? (
            <>
              <NavLink label="Mural" active={current === 'Home'} onPress={() => navigation.navigate('Home')} />
              <NavLink label="Perfil" active={current === 'Perfil'} onPress={() => navigation.navigate('Perfil')} />
              <Button title="Sair" variant="secondary" small loading={leaving} onPress={handleLogout} />
            </>
          ) : (
            <>
              <NavLink label="Entrar" active={current === 'Login'} onPress={() => navigation.navigate('Login')} />
              <Button title="Criar conta" small onPress={() => navigation.navigate('Cadastro')} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    paddingHorizontal: space.lg,
  },
  inner: {
    width: '100%',
    maxWidth: 720,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  brand: { paddingVertical: space.sm, borderRadius: 6 },
  brandText: { fontSize: 19, fontWeight: '800', color: colors.primary, letterSpacing: -0.3 },
  links: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  link: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  linkActive: { borderBottomColor: colors.primary },
  linkText: { fontSize: 15, fontWeight: '500', color: colors.muted },
  linkTextActive: { color: colors.text, fontWeight: '600' },
  focused: { boxShadow: focusRing },
});
