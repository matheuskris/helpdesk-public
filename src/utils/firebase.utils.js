import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  writeBatch,
  query,
} from "firebase/firestore/lite";

import { getDatabase, ref, set, onValue } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAYqv1f7R5WaUzGMf_BzBvyKMrVsX7hGKI",
  authDomain: "helpdesk-6d98c.firebaseapp.com",
  projectId: "helpdesk-6d98c",
  storageBucket: "helpdesk-6d98c.appspot.com",
  messagingSenderId: "703993776912",
  appId: "1:703993776912:web:425bb51d4b589abd2d7395",
  measurementId: "G-SFZM2BE8EL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

//=========== R E A L === T I M E === D A T A B A S E =======

const RTdatabase = getDatabase(app);

export const writeNewCall = async (call) => {
  try {
    await set(ref(RTdatabase, "calls/" + call.id), call);
  } catch (error) {
    console.log(error);
  }
};

export const editExistingCall = async (call) => {
  try {
    await set(ref(RTdatabase, "calls/" + call.id), call);
  } catch (error) {
    console.log(error);
  }
};

const callsRef = ref(RTdatabase, "calls/");

export const callsListener = (callback) => {
  return onValue(callsRef, (callsSnapshot) => {
    const data = callsSnapshot.val();
    callback(data);
  });
};

// USER AUTH STUFF
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

// // OLD DATABASE
// export const addObjectToCollection = async (collectionKey, objectToAdd) => {
//   const collectionRef = collection(db, collectionKey);
//   const batch = writeBatch(db);

//   const docRef = doc(collectionRef, objectToAdd.title.toLowerCase());
//   batch.set(docRef, objectToAdd);

//   try {
//     await batch.commit();
//     console.log("done");
//   } catch (error) {
//     console.log("theres a error", error);
//   }
// };

// // collectionkey dos chamados é "calls"
// export const getObjectsOfCollection = async (collectionKey) => {
//   const collectionRef = collection(db, collectionKey);
//   const q = query(collectionRef);

//   const querySnapshot = await getDocs(q);
//   const data = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());

//   return data;
// };

// export const createUserDocumentFromAuth = async (userAuth, addicionalInfo) => {
//     if (!userAuth) return;

//     const userDocRef = doc(db, "users", userAuth.uid);

//     const userSnapshot = await getDoc(userDocRef);

//     if (!userSnapshot.exists()) {
//       const { displayName, email } = userAuth;
//       const createdAt = new Date();

//       try {
//         await setDoc(userDocRef, {
//           displayName,
//           email,
//           createdAt,
//           ...addicionalInfo,
//         });
//       } catch (error) {
//         console.log("error creating the user", error);
//       }
//     }

//     return userSnapshot;
//   };
