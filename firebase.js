import { initializeApp } from 'firebase/app';
import auth from 'firebase/auth';
import firestore from 'firebase/firestore';
import storage from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBKpO2jg8Ungf-LYd_qIoZJpgVF5fjljc4",
  authDomain: "whatsapptalel.firebaseapp.com",
  projectId: "whatsapptalel",
  storageBucket: "whatsapptalel.firebasestorage.app",
  messagingSenderId: "1005395331658",
  appId: "1:1005395331658:web:d3c8f49642b5c50ef274b3"
};

const app = initializeApp(firebaseConfig);

export { auth, firestore, storage };
export default app;