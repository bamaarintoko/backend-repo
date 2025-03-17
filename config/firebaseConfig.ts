// config/firebaseConfig.ts
import admin from 'firebase-admin';
import * as path from 'path';

// Load service account key
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore(); // Initialize Firestore

export { admin, db };