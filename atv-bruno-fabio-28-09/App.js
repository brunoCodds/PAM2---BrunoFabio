import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultadosScreen from './src/screens/ResultadosScreen';
import BairroScreen from './src/screens/BairroScreen';
import CompararScreen from './src/screens/CompararScreen';
import { AppProvider } from './src/context/AppContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Resultados" component={ResultadosScreen} options={{ headerShown: true, title: 'Seus bairros' }} />
        <Stack.Screen name="Bairro" component={BairroScreen} options={{ headerShown: true, title: 'Análise do bairro' }} />
        <Stack.Screen name="Comparar" component={CompararScreen} options={{ headerShown: true, title: 'Comparação' }} />
      </Stack.Navigator>
    </NavigationContainer>
    </AppProvider>
  );
}
