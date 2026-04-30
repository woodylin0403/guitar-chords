import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; 
import { getDatabase } from 'firebase/database'; // 🌟 1. 新增 Realtime Database 套件

const firebaseConfig = {
  apiKey: "AIzaSyCCNuWjx_zziakKfAjq3XNSnToF9IYNFYI",
  authDomain: "guitarchordforworship.firebaseapp.com",
  // 🌟 2. 新增 databaseURL (Realtime Database 必須要有這個)
  databaseURL: "https://guitarchordforworship-default-rtdb.firebaseio.com", 
  projectId: "guitarchordforworship",
  storageBucket: "guitarchordforworship.firebasestorage.app",
  messagingSenderId: "60518324656",
  appId: "1:60518324656:web:b7f6f9ce2147b6ea129e75"
};

// 確保 Firebase 只會初始化一次 (避免 Next.js 重新整理時報錯)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app); // 你原本的 Firestore
export const rtdb = getDatabase(app); // 🌟 3. 我們這次要用的 Realtime Database (取名 rtdb 避免衝突)

// 初始化身分驗證服務
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();