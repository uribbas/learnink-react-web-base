import firebase from 'firebase';
import { config } from '../configs/firebase.js'

firebase.initializeApp(config);

export default firebase;
