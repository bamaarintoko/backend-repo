const functions = require('firebase-functions');
const app = require('../lib/core/app').default; // No ".js" needed in CommonJS

// exports.api = functions.region('us-central1').https.onRequest(app);
exports.api = functions.https.onRequest(app);