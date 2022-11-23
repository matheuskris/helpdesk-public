import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

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
  apiKey: "AIzaSyA8qF1dVd5CMZUezcGzC3o4CZdNW6VbKqU",
  authDomain: "helpdeskmatheus-403de.firebaseapp.com",
  projectId: "helpdeskmatheus-403de",
  storageBucket: "helpdeskmatheus-403de.appspot.com",
  messagingSenderId: "9535806706",
  appId: "1:9535806706:web:6a699b4119402642f4846b",
  measurementId: "G-LDMWYZ17T2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();

//=========== R E A L === T I M E === D A T A B A S E =======

const RTdatabase = getDatabase(app);
const callsRefString = "newCallsStructure";

export const getCallToSeeIfItAlreadyExists = async (id) => {
  const callsRef = ref(RTdatabase, "/users/" + userUid + "/calls/");

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

export const writeNewCall = async (userUid, call) => {
  const idIsBeeingUsed = await getCallToSeeIfItAlreadyExists(call.id);
  if (idIsBeeingUsed) return "já existe um chamado com esse id";

  try {
    const newPostKey = push(
      child(ref(RTdatabase), "/users/" + userUid + "/calls/")
    ).key;
    await set(ref(RTdatabase, "/users/" + userUid + "/calls/" + newPostKey), {
      ...call,
      key: newPostKey,
    });
    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const removeExistingCall = async (userUid, call) => {
  try {
    await remove(ref(RTdatabase, "/users/" + userUid + "/calls/" + call.key));
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
    update(ref(RTdatabase, "/users/" + userUid + "/calls/" + call.key), call);
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
        "/users/" +
          userUid +
          "/calls/" +
          callKey +
          "/tramites/" +
          tramiteInfo.id
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
        "/users/" +
          userUid +
          "/calls/" +
          callKey +
          "/tramites/" +
          tramiteInfo.id
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

export const callsListener = (userUid) => {
  const userCallsRef = ref(RTdatabase, "/users/" + userUid + "/calls/");

  return onValue(userCallsRef, (callsSnapshot) => {
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

export const authListener = (callback) => {
  onAuthStateChanged(auth, (user) => callback(user));
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
