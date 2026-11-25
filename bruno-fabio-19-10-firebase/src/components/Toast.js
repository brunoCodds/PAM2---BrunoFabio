import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../theme';

const ToastContext = createContext(() => {});

const DURATION_MS = 3500;

// Aviso rápido no topo da tela para confirmar ações (ou mostrar falhas).
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const show = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), DURATION_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      <View style={styles.root}>
        {children}
        {toast ? (
          <View pointerEvents="none" style={styles.overlay}>
            <View
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              style={[styles.toast, toast.type === 'error' ? styles.error : styles.success]}
            >
              <Text style={styles.text}>{toast.message}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { position: 'absolute', top: 72, left: 0, right: 0, alignItems: 'center', paddingHorizontal: space.lg },
  toast: { paddingVertical: space.md, paddingHorizontal: space.lg, borderRadius: radius.md, maxWidth: 480 },
  success: { backgroundColor: colors.primary },
  error: { backgroundColor: colors.danger },
  text: { color: colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
