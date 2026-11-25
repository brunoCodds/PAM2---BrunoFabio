import { useCallback, useState } from 'react';

// Estado de formulário: valores, erros por campo e limpeza do erro ao digitar.
export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  }, []);

  return { values, setValues, errors, setErrors, setField };
}
