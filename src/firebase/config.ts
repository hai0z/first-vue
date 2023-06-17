// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyBSypbBzE8QGqUr0M5sa2Tn9OxuJbmBvbk',
  authDomain: 'insta-web-78572.firebaseapp.com',
  projectId: 'insta-web-78572',
  storageBucket: 'insta-web-78572.appspot.com',
  messagingSenderId: '599249445653',
  appId: '1:599249445653:web:46d7cf1c7a03795dadff1c',
  measurementId: 'G-3WNNRNEJ3Y'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const auth = getAuth(app)
const db = getFirestore(app)

const analytics = getAnalytics(app)

export { storage, db, auth }
