import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile } from './usersService';

// Enquanto o cadastro roda, o AuthContext não tenta criar o perfil por conta própria.
let registering = false;
export const isRegistering = () => registering;

export async function register({ name, email, password }) {
  registering = true;
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await updateProfile(user, { displayName: name });
      await createUserProfile(user, name);
    } catch (error) {
      // Desfaz a conta para a pessoa poder tentar de novo sem ficar com cadastro pela metade.
      await deleteUser(user).catch(() => {});
      throw error;
    }
    return user;
  } finally {
    registering = false;
  }
}

export async function login({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export const logout = () => signOut(auth);
