// ─────────────────────────────────────────────────────────────────────────────
// config/firebase.config.js — Firebase Admin SDK Initialization
// The Admin SDK runs SERVER-SIDE only and can bypass security rules.
// It is used to verify auth tokens and perform privileged Firestore operations.
// ─────────────────────────────────────────────────────────────────────────────

import admin from 'firebase-admin';

// build the service account object from individual env variables
// (safer than uploading the JSON file — especially for Render deployment)
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // Render stores newlines as \n literals — replace them back to real newlines
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
};

// prevent duplicate admin app initialization in hot-reload environments
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // use service account auth
  });
  console.log('✅ Firebase Admin SDK initialized');
}

// db → Firestore instance (server-side, used in controllers)
export const db = admin.firestore();

// adminAuth → Firebase Auth (used in auth middleware to verify ID tokens)
export const adminAuth = admin.auth();

export default admin;
