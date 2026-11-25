import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space } from '../theme';
import { dataErrorMessage } from '../utils/errors';
import { formatDateTime, wasEdited } from '../utils/format';
import Avatar from './Avatar';
import Banner from './Banner';
import Button from './Button';
import Card from './Card';
import PostForm from './PostForm';

// mode: 'view' | 'edit' | 'confirmDelete'
export default function PostCard({ post, isOwner, onSave, onDelete }) {
  const [mode, setMode] = useState('view');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function handleSave(values) {
    await onSave(post, values);
    setMode('view');
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError('');
    try {
      await onDelete(post);
    } catch (error) {
      setDeleteError(dataErrorMessage(error));
      setDeleting(false);
    }
  }

  if (mode === 'edit') {
    return (
      <Card>
        <Text style={styles.editing}>Editando publicação</Text>
        <PostForm
          initialValues={{ title: post.title, description: post.description }}
          submitLabel="Salvar alterações"
          onSubmit={handleSave}
          onCancel={() => setMode('view')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.header}>
        <Avatar name={post.authorName} />
        <View style={styles.author}>
          <Text style={styles.authorName} numberOfLines={1}>
            {post.authorName}
          </Text>
          <Text style={styles.date}>{formatDateTime(post.createdAt)}</Text>
          {wasEdited(post) ? <Text style={styles.date}>Editado em {formatDateTime(post.updatedAt)}</Text> : null}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>

      {isOwner && mode === 'view' ? (
        <View style={styles.actions}>
          <Button title="Editar" variant="ghost" small onPress={() => setMode('edit')} />
          <Button title="Excluir" variant="dangerGhost" small onPress={() => setMode('confirmDelete')} />
        </View>
      ) : null}

      {mode === 'confirmDelete' ? (
        <View style={styles.confirm}>
          <Banner message={deleteError} />
          <Text style={styles.confirmText}>Excluir esta publicação? Essa ação não pode ser desfeita.</Text>
          <View style={styles.actions}>
            <Button title="Cancelar" variant="secondary" small disabled={deleting} onPress={() => setMode('view')} />
            <Button title="Excluir publicação" variant="danger" small loading={deleting} onPress={handleDelete} />
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  author: { flex: 1, gap: 2 },
  authorName: { fontSize: 15, fontWeight: '600', color: colors.text },
  date: { fontSize: 13, color: colors.muted },
  body: { gap: space.sm },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, lineHeight: 26 },
  description: { fontSize: 16, color: colors.text, lineHeight: 24 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: space.sm, flexWrap: 'wrap' },
  confirm: { gap: space.md, paddingTop: space.md, borderTopWidth: 1, borderTopColor: colors.border },
  confirmText: { fontSize: 14, color: colors.text },
  editing: { fontSize: 16, fontWeight: '700', color: colors.text },
});
