// Única responsabilidade deste arquivo: inicializar o Firebase.
// Os valores vêm do arquivo .env (veja .env.example).
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    'Configuração do Firebase ausente. Copie .env.example para .env e preencha os valores.'
  );
}

const app = initializeApp(firebaseConfig);

// No navegador, o Auth guarda a sessão em IndexedDB por padrão,
// então o usuário continua logado ao atualizar a página.
export const auth = getAuth(app);
export const db = getFirestore(app);
