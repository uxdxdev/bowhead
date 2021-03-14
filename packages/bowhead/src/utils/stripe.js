import { FIRESTORE_COLLECTIONS } from "./constants";
import { getFirestore, getFirebase } from './firebase'
import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const getStripe = () => {
    return stripe
}

const getStipeCustomerId = async () => {
    const uid = getFirebase().auth().currentUser.uid

    const userDataRef = getFirestore()
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

    const userDataDoc = await userDataRef.get();
    const userData = userDataDoc.data();
    return userData.stripeCustomerId
}

export { getStripe, getStipeCustomerId };