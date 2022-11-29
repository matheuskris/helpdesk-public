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
import { castImmutable } from "immer";

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

//=========== R E A L === T I M E === D A T A B A S E =======

const RTdatabase = getDatabase(app);

// const DataBaseObject = {
//   users: {
//     user123: {
//       projects: {
//         projeto123: {
//           calls: {
//             call123: {
//               tramites: {},
//             },
//           },
//         },
//       },
//       name: "matheus",
//       key: "user123",
//     },
//   },
//   projects: {
//     projeto123: {
//       name: "Empresa x",
//       users: {
//         user123: "",
//       },
//       calls: {},
//       monthHourStock: {
//         november: "160",
//       },
//       key: projeto123,
//       createdBy: "user123",
//       createdAt: 3782193729100000,
//     },
//   },
// };

export const createNewProject = async (userUid, project) => {
  try {
    const newProjectKey = push(child(ref(RTdatabase), "projects")).key;
    const updates = {};

    updates["/projects/" + newProjectKey] = { ...project, key: newProjectKey };
    updates["/users/" + userUid + "/projects/" + newProjectKey] = {
      ...project,
      key: newProjectKey,
    };

    await update(ref(RTdatabase), updates);
  } catch (err) {
    console.log(err);
  }
};

export const projectsListener = async (userUid, callback) => {
  const userProjectsRef = ref(RTdatabase, "users/" + userUid + "/projects");
  console.log("listener");

  onValue(userProjectsRef, (callsSnapshot) => {
    const data = callsSnapshot.val();

    callback(data);
  });
};

export const getCallToSeeIfItAlreadyExists = async (projectUid, id) => {
  const callsRef = ref(RTdatabase, "/projects/" + projectUid + "/calls/");

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

export const writeNewCall = async (projectUid, userUid, call) => {
  const idIsBeeingUsed = await getCallToSeeIfItAlreadyExists(
    projectUid,
    call.id
  );
  if (idIsBeeingUsed) return "já existe um chamado com esse id";

  try {
    const newPostKey = push(
      child(ref(RTdatabase), "/projects/" + projectUid + "/calls/")
    ).key;

    const updates = {};

    updates["/projects/" + projectUid + "/calls/" + newPostKey] = {
      ...call,
      key: newPostKey,
    };

    updates[
      "/users/" + userUid + "/projects/" + projectUid + "/calls/" + newPostKey
    ] = { ...call, key: newPostKey };

    await update(ref(RTdatabase), updates);

    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const removeExistingCall = async (projectUid, userUid, call) => {
  try {
    const updates = {};
    updates["/projects/" + projectUid + "/calls/" + call.key] = null;
    updates[
      "/users/" + userUid + "/projects/" + projectUid + "/calls/" + call.key
    ] = null;

    await update(ref(RTdatabase), updates);
  } catch (error) {
    console.log(error);
  }
};

export const editExistingCall = async (projectUid, userUid, call, oldId) => {
  if (call.id !== oldId) {
    const idExists = await getCallToSeeIfItAlreadyExists(projectUid, call.id);
    if (idExists) return "Já existe um chamado com esse ID";
  }
  try {
    const updates = {};
    updates["/projects/" + projectUid + "/calls/" + call.key] = call;
    updates[
      "/users/" + userUid + "/projects/" + projectUid + "/calls/" + call.key
    ] = call;

    await update(ref(RTdatabase), updates);
    console.log("success");
    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const writeNewTramite = async (
  projectUid,
  userUid,
  callKey,
  tramiteInfo
) => {
  try {
    const updates = {};
    updates[
      "/projects/" +
        projectUid +
        "/calls/" +
        callKey +
        "/tramites/" +
        tramiteInfo.id
    ] = tramiteInfo;
    updates[
      "/users/" +
        userUid +
        "/projects/" +
        projectUid +
        "/calls/" +
        callKey +
        "/tramites/" +
        tramiteInfo.id
    ] = tramiteInfo;

    await update(ref(RTdatabase), updates);

    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const editExistingTramite = async (
  projectUid,
  userUid,
  callKey,
  tramiteInfo
) => {
  try {
    const updates = {};
    updates[
      "/projects/" +
        projectUid +
        "/calls/" +
        callKey +
        "/tramites/" +
        tramiteInfo.id
    ] = tramiteInfo;
    updates[
      "/users/" +
        userUid +
        "/projects/" +
        projectUid +
        "/calls/" +
        callKey +
        "/tramites/" +
        tramiteInfo.id
    ] = tramiteInfo;

    await update(ref(RTdatabase), updates);

    console.log("success");
    return "success";
  } catch (error) {
    console.log(error);
    return error.code;
  }
};

export const callsListener = async (projectUid, callback) => {
  const callsRef = ref(RTdatabase, "/projects/" + projectUid + "/calls/");
  console.log("callListener");

  // try {
  //   const data = await get(callsRef).then((snapshot) => snapshot.val());
  //   console.log(data);
  // } catch (err) {
  //   console.log(err);
  // }

  //   projects/-NHlpVPr2epwpiUvIQZt/calls

  onValue(callsRef, (callsSnapshot) => {
    const data = callsSnapshot.val();
    callback(data);
  });
};

export const proceduresListener = async (callback, projectUid, callKey) => {
  const callRef = ref(
    RTdatabase,
    "/projects/" + projectUid + "/calls/" + callKey
  );

  return onValue(callRef, (callSnapshot) => {
    const data = callSnapshot.val();
    callback(data);
  });
};

// USER AUTH STUFF
const auth = getAuth();

export const createAuthUserWithEmailAndPassword = async (
  email,
  password,
  userName
) => {
  if (!email || !password) return;
  const user = await createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      return userCredential.user;
    }
  );
  console.log(user);
  const { uid } = user;
  try {
    await set(ref(RTdatabase, "/users/" + uid), { name: userName, key: uid });
  } catch (err) {
    console.log(err);
  }
  return user;
};

export const signInAuthWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const authListener = (callback) => {
  onAuthStateChanged(auth, (user) => callback(user));
};

export const getUserName = async (userUid) => {
  const name = get(ref(RTdatabase, "users/" + userUid + "/name")).then(
    (snapshot) => snapshot.val()
  );
  return name;
};

export const sendInviteToToProject = async (project, userName, email) => {
  try {
    await set(ref(RTdatabase, "/users/" + uid + "/invites/" + project.uid), {
      name: userName,
      key: uid,
    });

    return "success";
  } catch (err) {
    console.log(err);
  }
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
