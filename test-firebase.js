import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testFirebase() {
  try {
    const docRef = doc(db, 'test', 'connetion');
    await setDoc(docRef, { test: true });
    console.log('Firebase WRITE success!');
    const snap = await getDoc(docRef);
    console.log('Firebase READ success! Data:', snap.data());
  } catch (err) {
    console.error('Firebase test failed:', err);
  }
}
testFirebase();
