import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

//CONFIGURACION DE FIREBASE, ESTA SE OBTIENE DESDE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCiu_odFrofM0vRzfIwCoRyebaeQaqOVNU",
  authDomain: "crwn-clothing-axel-db.firebaseapp.com",
  projectId: "crwn-clothing-axel-db",
  storageBucket: "crwn-clothing-axel-db.appspot.com",
  messagingSenderId: "1095663758276",
  appId: "1:1095663758276:web:939b0fc4681dcf4aa6d291",
};
initializeApp(firebaseConfig);

//ES EL PROVEEDOR, EN ESTE CASO DE GOOGLE
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

//OBTIENE LA AUTENTICACION
export const auth = getAuth();

//INICIA SESION SON GOOGLE POPUP
export const signInWithGooglePopup = () => 
signInWithPopup(auth, googleProvider);

//INICIA SESION CON GOOGLE REDIRECT
export const signInWithGoogleRedirect = () => 
signInWithRedirect(auth, googleProvider);

//OBTIENE LA BDD
export const db = getFirestore();

//CREACION DE UN REGISTRO EN FIRESTORE, 
//CON 3 ARGUMENTOS(BDD,'NOMBRE DEL DOCUMENTO',ID DE AUTENTICACION)
export const createUserDocumentFromAuth = async (
  userAuth, 
  additionalInformation = {}
  ) => {
  if(!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);
  console.log(userSnapshot);
  console.log(userSnapshot.exists());

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      });
    } catch (error) {
      console.log("Error creating the user", error.message);
    }
  }
  return userDocRef;
};

//REGISTRAR CON EMAIL Y PASSOWRD

export const createAuthUserWithEmailAndPassword = async (email, password) =>{
  if(!email || !password) return;

  return await createUserWithEmailAndPassword(auth,email,password);
}

//INICIA SESION CON EMAIL Y PASSOWRD

export const sigInAuthUserWithEmailAndPassword = async (email, password) =>{
  if(!email || !password) return;

  return await signInWithEmailAndPassword(auth,email,password);
}

//CERRAR SESION 
export const signOutUser = async () =>  await signOut(auth);
//Oyente Observable
export const onAuthStateChangedListener = (callback) => 
onAuthStateChanged(auth, callback);