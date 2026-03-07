import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // 新增會員套件

const firebaseConfig = {
  apiKey: "AIzaSyCCNuWjx_zziakKfAjq3XNSnToF9IYNFYI",
  authDomain: "guitarchordforworship.firebaseapp.com",
  projectId: "guitarchordforworship",
  storageBucket: "guitarchordforworship.firebasestorage.app",
  messagingSenderId: "60518324656",
  appId: "1:60518324656:web:b7f6f9ce2147b6ea129e75"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 初始化身分驗證服務
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();