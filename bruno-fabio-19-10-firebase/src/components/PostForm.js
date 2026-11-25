import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '../theme';
import { dataErrorMessage } from '../utils/errors';
import useForm from '../utils/useForm';
import { hasErrors, LIMITS, validatePost } from '../utils/validation';
import Banner from './Banner';
import Button from './Button';
import TextField from './TextField';

// Formulário usado para publicar e para editar. `onSubmit` recebe { title, description } já validados.
export default function PostForm({
  initialValues = { title: '', description: '' },
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
  disabled = false,
}) {
  const { values, setValues, errors, setErrors, setField } = useForm(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit() {
    const cleaned = { title: values.title.trim(), description: values.description.trim() };
    const found = validatePost(cleaned);
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await onSubmit(cleaned);
      if (resetOnSuccess) setValues(initialValues);
    } catch (error) {
      setFormError(dataErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.form}>
      <Banner message={formError} />
      <TextField
        label="Título"
        value={values.title}
        onChangeText={(text) => setField('title', text)}
        error={errors.title}
        maxLength={LIMITS.titleMax}
        placeholder="Resuma sua sugestão ou opinião"
        editable={!submitting}
      />
      <TextField
        label="Descrição"
        value={values.description}
        onChangeText={(text) => setField('description', text)}
        error={errors.description}
        hint={`${values.description.length}/${LIMITS.descriptionMax}`}
        maxLength={LIMITS.descriptionMax}
        placeholder="Explique com detalhes"
        multiline
        editable={!submitting}
      />
      <View style={styles.actions}>
        {onCancel ? <Button title="Cancelar" variant="secondary" disabled={submitting} onPress={onCancel} /> : null}
        <Button title={submitLabel} loading={submitting} disabled={disabled} onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: space.lg },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: space.sm, flexWrap: 'wrap' },
});
