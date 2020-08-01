import firebase from 'firebase';
import { config } from '../configs/firebase.js'

firebase.initializeApp(config);

export default firebase;

export const auth = firebase.auth();

export const db = firebase.firestore();

export const storage = firebase.storage();
