import { pluginRegistry, PLUGIN_TYPES } from "../registry/plugin-registry"
import { FIRESTORE_COLLECTIONS } from "./constants";
import { getFirestore, getFirebase } from './firebase'

const getStripe = () => {
    const stripe = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.stripe
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