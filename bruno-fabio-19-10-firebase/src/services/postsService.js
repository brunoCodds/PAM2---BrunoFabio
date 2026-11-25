import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const postsRef = collection(db, 'posts');
const FEED_LIMIT = 100;
const BATCH_SIZE = 400; // o Firestore aceita até 500 operações por lote

// 'estimate' evita createdAt nulo enquanto o servidor ainda não confirmou a gravação.
const toPost = (snapshot) => ({ id: snapshot.id, ...snapshot.data({ serverTimestamps: 'estimate' }) });

// Mural em tempo real, da publicação mais recente para a mais antiga.
export function subscribePosts(onData, onError) {
  const feed = query(postsRef, orderBy('createdAt', 'desc'), limit(FEED_LIMIT));
  return onSnapshot(feed, (snapshot) => onData(snapshot.docs.map(toPost)), onError);
}

export function createPost(user, authorName, { title, description }) {
  return addDoc(postsRef, {
    title,
    description,
    authorId: user.uid,
    authorName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updatePost(postId, { title, description }) {
  return updateDoc(doc(db, 'posts', postId), {
    title,
    description,
    updatedAt: serverTimestamp(),
  });
}

export function deletePost(postId) {
  return deleteDoc(doc(db, 'posts', postId));
}

// Atualiza o nome do autor em todas as publicações da pessoa que ainda mostram o nome antigo.
export async function syncAuthorName(uid, name) {
  const snapshot = await getDocs(query(postsRef, where('authorId', '==', uid)));
  const outdated = snapshot.docs.filter((item) => item.data().authorName !== name);

  for (let start = 0; start < outdated.length; start += BATCH_SIZE) {
    const batch = writeBatch(db);
    outdated.slice(start, start + BATCH_SIZE).forEach((item) => batch.update(item.ref, { authorName: name }));
    await batch.commit();
  }
}
