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

import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
  get,
  child,
  push,
} from "firebase/database";

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

//=========== R E A L === T I M E === D A T A B A S E =======

const RTdatabase = getDatabase(app);
const callsRefString = "testCalls";

// temporary Stuff

// export const duplicateDB = async () => {
//   const callsRef = ref(RTdatabase, "calls/");

//   const data = await get(callsRef).then((snapshot) => {
//     return snapshot.val();
//   });

//   for (const prop in data) {
//     const newPostKey = push(child(ref(RTdatabase), "newCallsStructure/")).key;
//     await set(ref(RTdatabase, "newCallsStructure/" + newPostKey), {
//       ...data[prop],
//       key: newPostKey,
//     });
//   }

//   // try {
//   //   await set(ref(RTdatabase, "newCallsStructure/"), data);
//   // } catch (error) {
//   //   console.log(error);
//   // }
// };
// --------------------

export const getCallToSeeIfItAlreadyExists = async (id) => {
  const callsRef = ref(RTdatabase, callsRefString + "/");

  const doesIdReturnsAValue = await get(callsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        for (const prop in data) {
          const callId = data[prop].id;

          if (callId === id) {
            return true;
          }
        }
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return doesIdReturnsAValue;
};

export const writeNewCall = async (call) => {
  const idIsBeeingUsed = await getCallToSeeIfItAlreadyExists(call.id);
  if (idIsBeeingUsed) return "já existe um chamado com esse id";

  try {
    const newPostKey = push(child(ref(RTdatabase), callsRefString)).key;
    await set(ref(RTdatabase, callsRefString + "/" + newPostKey), {
      ...call,
      key: newPostKey,
    });
    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const removeExistingCall = async (call) => {
  try {
    await remove(ref(RTdatabase, callsRefString + "/" + call.key));
  } catch (error) {
    console.log(error);
  }
};

export const editExistingCall = async (call, oldId) => {
  if (call.id !== oldId) {
    const idExists = await getCallToSeeIfItAlreadyExists(call.id);
    if (idExists) return "Já existe um chamado com esse ID";
  }
  try {
    update(ref(RTdatabase, callsRefString + "/" + call.key), call);
    console.log("success");
    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const writeNewTramite = async (callKey, tramiteInfo) => {
  try {
    await set(
      ref(
        RTdatabase,
        callsRefString + "/" + callKey + "/tramites/" + tramiteInfo.id
      ),
      tramiteInfo
    );
    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const editExistingTramite = async (callKey, tramiteInfo) => {
  try {
    await update(
      ref(
        RTdatabase,
        callsRefString + "/" + callKey + "/tramites/" + tramiteInfo.id
      ),
      tramiteInfo
    );
    console.log("success");
    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

const callsRef = ref(RTdatabase, callsRefString + "/");

export const callsListener = (callback) => {
  return onValue(callsRef, (callsSnapshot) => {
    const data = callsSnapshot.val();
    callback(data);
  });
};

export const proceduresListener = (callback, callKey) => {
  const callRef = ref(RTdatabase, "/" + callsRefString + "/" + callKey);
  return onValue(callRef, (callSnapshot) => {
    const data = callSnapshot.val();
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

// // FIRESTORE DATABASE
const db = getFirestore();

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
