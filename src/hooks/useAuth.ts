import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore if needed
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...firebaseUser, ...userDoc.data() });
        } else {
          // New user (from Google or just created)
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            photoURL: firebaseUser.photoURL,
            role: 'Builder',
            createdAt: new Date().toISOString(),
            xp: 0,
            level: 1
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return { user: result.user };
    } catch (error: any) {
      console.error("Login failed:", error);
      return { error: error.message };
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      // Data will be synced in useEffect, but we can preset the name
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: email,
        displayName: name,
        role: 'Builder',
        createdAt: new Date().toISOString(),
        xp: 0,
        level: 1
      });
      return { user: result.user };
    } catch (error: any) {
      console.error("Registration failed:", error);
      return { error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return { user: result.user };
    } catch (error: any) {
      console.error("Google Login failed:", error);
      return { error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const gainXP = async (amount: number) => {
    if (!user || !user.uid) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      const currentXP = (data.xp || 0) + amount;
      const currentLevel = Math.floor(currentXP / 1000) + 1; // Example formula
      
      await setDoc(userRef, { 
        xp: currentXP, 
        level: currentLevel 
      }, { merge: true });
      
      setUser((prev: any) => ({ ...prev, xp: currentXP, level: currentLevel }));
    }
  };

  return { 
    user, 
    loading, 
    login,
    register,
    loginWithGoogle, 
    logout, 
    gainXP 
  };
}
