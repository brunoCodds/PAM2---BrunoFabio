const toDate = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === 'function') return timestamp.toDate();
  return timestamp instanceof Date ? timestamp : null;
};

export function formatDate(timestamp) {
  const date = toDate(timestamp);
  if (!date) return '';
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(timestamp) {
  const date = toDate(timestamp);
  if (!date) return '';
  const day = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${time}`;
}

// Considera "editada" quando a última atualização é pelo menos 1 segundo depois da criação.
export function wasEdited(post) {
  const created = toDate(post.createdAt);
  const updated = toDate(post.updatedAt);
  return Boolean(created && updated && updated - created > 1000);
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}
