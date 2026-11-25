import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { db } from '../firebase/config';
import { syncAuthorName } from './postsService';

const userRef = (uid) => doc(db, 'users', uid);

export function createUserProfile(user, name) {
  return setDoc(userRef(user.uid), {
    uid: user.uid,
    name,
    email: user.email,
    bio: '',
    createdAt: serverTimestamp(),
  });
}

// Cria o perfil de uma conta que existe no Authentication mas ficou sem documento no Firestore.
export function ensureUserProfile(user) {
  const fallback = user.displayName || user.email.split('@')[0];
  return createUserProfile(user, fallback.length >= 2 ? fallback : 'Usuário');
}

// Devolve o perfil em tempo real; null quando o documento ainda não existe.
export function subscribeProfile(uid, onData, onError) {
  return onSnapshot(
    userRef(uid),
    (snapshot) => onData(snapshot.exists() ? snapshot.data({ serverTimestamps: 'estimate' }) : null),
    onError
  );
}

// Salva o perfil e propaga o novo nome para as publicações.
// Retorna { postsSynced: false } se o perfil foi salvo mas a atualização das publicações falhou.
export async function saveProfile(user, { name, bio }) {
  await updateDoc(userRef(user.uid), { name, bio });

  // Melhor esforço: o Firestore é a fonte oficial do nome.
  updateAuthProfile(user, { displayName: name }).catch(() => {});

  try {
    await syncAuthorName(user.uid, name);
    return { postsSynced: true };
  } catch {
    return { postsSynced: false };
  }
}
