import { initializeApp } from 'firebase/app'
import { getDatabase, Database } from 'firebase/database'
import { getAuth, Auth } from 'firebase/auth'

// Check if Firebase is configured
const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
)

let database: Database | null = null
let auth: Auth | null = null

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    }

    const app = initializeApp(firebaseConfig)
    database = getDatabase(app)
    auth = getAuth(app)
    console.log('Firebase initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
    console.warn('Firebase features will be disabled. App will use local state management.')
  }
} else {
  console.warn('Firebase not configured. Set environment variables to enable Firebase features.')
}

export { database, auth }
