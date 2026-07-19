import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Need to import the config. We use assert { type: "json" } for ESM, or just require it.
// Since it's vite + tsx, we can import it.
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// Cast to any to get around typing if it's missing the property, but our config has it.
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
