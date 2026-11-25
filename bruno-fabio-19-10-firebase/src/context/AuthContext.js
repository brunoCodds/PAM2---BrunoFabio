import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { isRegistering } from '../services/authService';
import { ensureUserProfile, subscribeProfile } from '../services/usersService';

const AuthContext = createContext(null);

// profile: undefined = carregando, null = não encontrado, objeto = carregado.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState(null);

  // Sessão: o Firebase restaura o usuário ao atualizar a página.
  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
      }),
    []
  );

  // Perfil do usuário logado, em tempo real.
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return undefined;
    }

    setProfile(undefined);
    return subscribeProfile(
      user.uid,
      (data) => {
        if (data) {
          setProfile(data);
        } else if (!isRegistering()) {
          // Conta antiga sem perfil: cria o documento; o listener recebe o resultado.
          ensureUserProfile(user).catch(() => setProfile((current) => current ?? null));
        }
      },
      () => setProfile(null)
    );
  }, [user]);

  const value = useMemo(
    () => ({ user, profile, loading: !authReady }),
    [user, profile, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
