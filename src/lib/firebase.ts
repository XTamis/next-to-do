import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from "@/environment";

const firebaseConfig = environment.firebase;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };