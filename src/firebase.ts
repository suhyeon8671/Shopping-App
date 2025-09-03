
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, query, where, documentId, DocumentReference, orderBy } from 'firebase/firestore';
import { Product, Order, OrderItem } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Product));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const productDoc = doc(db, 'products', id);
  const productSnap = await getDoc(productDoc);
  return productSnap.exists() ? { ...productSnap.data(), id: productSnap.id } as unknown as Product : null;
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  const docRef = await addDoc(ordersCollection, order);
  return { ...order, id: docRef.id } as Order;
};

export const getOrders = async (userId: string): Promise<Order[]> => {
    const ordersQuery = query(collection(db, 'orders'), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        items: data.items, // The items are already in the correct format
        totalPrice: data.totalPrice,
        createdAt: data.createdAt
      } as Order;
    });
  };

export { auth, db };
