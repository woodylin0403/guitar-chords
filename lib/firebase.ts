import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCNuWjx_zziakKfAjq3XNSnToF9IYNFYI",
  authDomain: "guitarchordforworship.firebaseapp.com",
  projectId: "guitarchordforworship",
  storageBucket: "guitarchordforworship.firebasestorage.app",
  messagingSenderId: "60518324656",
  appId: "1:60518324656:web:b7f6f9ce2147b6ea129e75"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出資料庫實體，讓其他頁面可以使用
export const db = getFirestore(app);