import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);

async function test() {
  const ref = doc(db, 'settings', 'categories');
  const snap = await getDoc(ref);
  console.log('Exists?', snap.exists());
  if (snap.exists()) {
    console.log('Data:', snap.data());
  }
}
test().then(() => process.exit(0));
