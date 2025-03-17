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
// ✅ Connect to Firestore Emulator when running locally
if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'development') {
  console.log('🔥 Connected to Firestore Emulator');
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}
export { admin, db };