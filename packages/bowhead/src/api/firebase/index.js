import { pluginRegistry, PLUGIN_TYPES } from '../../registry/plugin-registry'
import { noProductionUrl } from '../../utils/error-messages'
import { FIRESTORE_COLLECTIONS } from "../../utils/constants";
import { getFirestore, getFirebase } from '../../utils/firebase'
import { getStipeCustomerId } from '../../utils/stripe'

export const signOut = () => {
    return getFirebase()
        .auth()
        .signOut()
}

/**
 * Sends sign in email and appends ref and data to URL.
 * 
 * @param {*} args.email users email address
 * @param {*} args.ref reference for email authentication
 * @param {*} args.data object with key/value pairs for URL params 
 */
export const sendSignInEmail = ({ email, data }) => {

    const app = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.app

    if (!app?.productionUrl) {
        console.error(noProductionUrl)
    }
    const urlStr = process.env.NODE_ENV === "development"
        ? `http://localhost:8888/verify`
        : `${app.productionUrl}/verify`;

    const url = new URL(urlStr);

    data && Object.keys(data).forEach(key => {
        url.searchParams.append(key, data[key]);
    });

    return getFirebase()
        .auth()
        .sendSignInLinkToEmail(email, {
            url: url.href,
            handleCodeInApp: true
        })
}

export const signInWithEmailLink = ({ email, location }) => {
    return getFirebase().auth().signInWithEmailLink(email, location)
}

export const isSignInWithEmailLink = ({ location }) => {
    return getFirebase().auth().isSignInWithEmailLink(location)
}


export const verifyUserSignInUpdate = ({ uid, email }) => {
    return getFirestore()
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(uid)
        .set({
            email,
        },
            { merge: true }
        );
}

export const updateUserProfile = async (data) => {

    const uid = getFirebase().auth().currentUser.uid
    return getFirestore()
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(uid)
        .set(data,
            { merge: true }
        );
}

export const deleteUserProfile = async () => {

    const uid = getFirebase().auth().currentUser.uid
    const userDataRef = getFirestore()
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

    const stripeCustomerId = await getStipeCustomerId()

    const batch = getFirestore().batch();

    if (stripeCustomerId) {
        // delete stripe customer data
        const stripeCustomerDataRef = getFirestore()
            .collection(FIRESTORE_COLLECTIONS.STRIPE)
            .doc(stripeCustomerId);
        batch.delete(stripeCustomerDataRef)
    }

    // user data
    batch.delete(userDataRef)
    return batch.commit()
};
