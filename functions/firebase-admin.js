// var admin = require("firebase-admin");
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore';
import {getStorage} from 'firebase-admin/storage';
// import {getSt}
// import serviceAccount from "./doc-q-5cfe1-firebase-adminsdk-cfewg-6d46cefd11.json" assert { type: 'json' };
// const serviceAccount = import("./doc-q-5cfe1-firebase-adminsdk-cfewg-6d46cefd11.json").then(module => module.default);
import serviceAccount from "./serviceAccount.js";



// let admin;
// if (!admin.apps.length) {
//     try {
let admin = initializeApp({
    credential: cert(serviceAccount)
});
//     } catch (error) {
//         console.error('Error initializing Firebase Admin:', error);
//     }
// }

const storage = getStorage(admin)
const auth = getAuth(admin);
const db = getFirestore(admin);
db.settings({ ignoreUndefinedProperties: true });

const userRef = db.collection("users");
// const patientsRef = db.collection("patients");

export { auth, db, userRef,storage }