// index.ts
// import app from './core/app';
// import dotenv from 'dotenv';
// dotenv.config();
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

import app from './core/app';
import dotenv from 'dotenv';
import * as functions from 'firebase-functions';
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const PORT = process.env.PORT || 5000;
// ✅ Check if running as standalone or Firebase Function
dotenv.config();
console.log('Current Directory:', process.cwd());

if (process.env.STANDALONE === 'true') {
	// Standalone Express server (e.g., for production or local testing)
	app.listen(PORT, () => {
		console.log(`🚀 Server is running on http://localhost:${PORT}`);
	});
} else {
	dotenv.config();
	// Firebase Cloud Function export (for Firebase Emulator / deployment)
	exports.api = functions.https.onRequest(app);
}