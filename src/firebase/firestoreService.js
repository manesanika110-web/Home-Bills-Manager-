import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

const COLLECTION_NAME = 'bills';
const SETTINGS_COLLECTION = 'user_settings';

// Helper to normalize bill object retrieved from Firestore
const normalizeBill = (docId, data) => {
  return {
    id: docId,
    name: data.name || '',
    category: data.category || 'Other',
    amount: Number(data.amount) || 0,
    dueDate: data.dueDate || '',
    paymentDate: data.paymentDate || '',
    status: data.status || 'Pending',
    paymentMethod: data.paymentMethod || '',
    notes: data.notes || '',
    userId: data.userId || '',
    createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt) : new Date().toISOString()
  };
};

/**
 * Subscribe to real-time bills for a specific user from Firestore
 */
export const subscribeUserBills = (userId, onData, onError) => {
  if (!isFirebaseConfigured || !db) {
    const error = new Error('Firebase Firestore is not configured. Please configure your .env credentials.');
    if (onError) onError(error);
    return () => {};
  }

  if (!userId) {
    onData([]);
    return () => {};
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bills = [];
        snapshot.forEach((docSnap) => {
          bills.push(normalizeBill(docSnap.id, docSnap.data()));
        });
        onData(bills);
      },
      (error) => {
        console.error('Firestore bills subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Error setting up Firestore listener:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Add a new bill directly to Firestore
 */
export const createBill = async (billData, userId) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured. Please add your credentials in .env to save bills.');
  }

  if (!userId) {
    throw new Error('User authentication required to save bill to Firestore.');
  }

  const numericAmount = Math.max(0, parseFloat(billData.amount) || 0);

  const payload = {
    name: (billData.name || '').trim(),
    category: (billData.category || 'Other').trim(),
    amount: numericAmount,
    dueDate: billData.dueDate || '',
    paymentDate: billData.status === 'Paid' ? (billData.paymentDate || new Date().toISOString().split('T')[0]) : '',
    status: billData.status === 'Paid' ? 'Paid' : 'Pending',
    paymentMethod: billData.paymentMethod || '',
    notes: (billData.notes || '').trim(),
    userId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return docRef.id;
};

/**
 * Update an existing bill in Firestore
 */
export const updateBillRecord = async (billId, billData, userId) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured. Please add your credentials in .env to update bills.');
  }

  if (!userId) {
    throw new Error('User authentication required to update bill in Firestore.');
  }

  const numericAmount = Math.max(0, parseFloat(billData.amount) || 0);

  const payload = {
    name: (billData.name || '').trim(),
    category: (billData.category || 'Other').trim(),
    amount: numericAmount,
    dueDate: billData.dueDate || '',
    paymentDate: billData.status === 'Paid' ? (billData.paymentDate || new Date().toISOString().split('T')[0]) : '',
    status: billData.status === 'Paid' ? 'Paid' : 'Pending',
    paymentMethod: billData.paymentMethod || '',
    notes: (billData.notes || '').trim(),
    updatedAt: serverTimestamp()
  };

  const billRef = doc(db, COLLECTION_NAME, billId);
  await updateDoc(billRef, payload);
};

/**
 * Delete a bill from Firestore
 */
export const deleteBillRecord = async (billId, userId) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured. Please add your credentials in .env to delete bills.');
  }

  if (!userId) {
    throw new Error('User authentication required to delete bill from Firestore.');
  }

  const billRef = doc(db, COLLECTION_NAME, billId);
  await deleteDoc(billRef);
};

/**
 * Subscribe to user settings / custom categories in Firestore
 */
export const subscribeUserSettings = (userId, onData, onError) => {
  if (!isFirebaseConfigured || !db || !userId) {
    return () => {};
  }

  try {
    const userDocRef = doc(db, SETTINGS_COLLECTION, userId);
    return onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const monthlyBudgets = {
            ...(data.preferences?.monthlyBudgets || {}),
            ...(data.monthlyBudgets || {})
          };
          onData({
            ...data,
            customCategories: Array.isArray(data.customCategories) ? data.customCategories : [],
            monthlyBudgets
          });
        } else {
          onData({ customCategories: [], monthlyBudgets: {} });
        }
      },
      (error) => {
        console.error('Firestore user settings error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error('Error setting up settings listener:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Save user custom categories in Firestore
 */
export const saveUserCustomCategories = async (userId, customCategories) => {
  if (!isFirebaseConfigured || !db || !userId) return;
  const userDocRef = doc(db, SETTINGS_COLLECTION, userId);
  await setDoc(userDocRef, { customCategories, updatedAt: serverTimestamp() }, { merge: true });
};

/**
 * Save user monthly budget in Firestore
 */
export const saveUserMonthlyBudget = async (userId, monthKey, amount) => {
  if (!isFirebaseConfigured || !db || !userId) return;
  const userDocRef = doc(db, SETTINGS_COLLECTION, userId);
  const numericAmount = Math.max(0, parseFloat(amount) || 0);

  await setDoc(
    userDocRef,
    {
      userId,
      monthlyBudgets: {
        [monthKey]: numericAmount
      },
      preferences: {
        monthlyBudgets: {
          [monthKey]: numericAmount
        }
      },
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
};
