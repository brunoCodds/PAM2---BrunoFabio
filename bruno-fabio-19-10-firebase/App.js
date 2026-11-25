import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Loading from './src/components/Loading';
import Navbar from './src/components/Navbar';
import { ToastProvider } from './src/components/Toast';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

// URLs amigáveis no navegador: /, /entrar, /cadastro e /perfil.
const linking = {
  prefixes: [],
  config: {
    screens: { Home: '', Login: 'entrar', Cadastro: 'cadastro', Perfil: 'perfil' },
  },
};

const documentTitle = {
  formatter: (options) => (options?.title ? `${options.title} | FeedbackHub` : 'FeedbackHub'),
};

const screenOptions = {
  animation: 'none',
  header: ({ navigation, route }) => <Navbar navigation={navigation} current={route.name} />,
  contentStyle: { backgroundColor: colors.background },
};

function Routes() {
  const { user, loading } = useAuth();

  // Espera o Firebase restaurar a sessão para não piscar a tela de login.
  if (loading) return <Loading fullScreen label="Carregando…" />;

  return (
    <NavigationContainer linking={linking} documentTitle={documentTitle}>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mural' }} />
        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
        {/* Login e cadastro só existem para visitantes: ao entrar, saem da pilha sozinhos. */}
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar conta' }} />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StatusBar style="dark" />
        <Routes />
      </ToastProvider>
    </AuthProvider>
  );
}
