import { FIRESTORE_COLLECTIONS } from "../../utils/constants";
import { getFirestore } from '../../utils/firebase'

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

export const deleteUserAccountAndData = async uid => {

    const userDataRef = getFirestore()
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

    const userDataDoc = await userDataRef.get();
    const userData = userDataDoc.data();
    const batch = getFirestore().batch();

    if (userData) {
        const stripeCustomerId = userData.stripeCustomerId || null;

        if (stripeCustomerId) {
            // delete stripe customer data
            const stripeCustomerDataRef = getFirestore()
                .collection(FIRESTORE_COLLECTIONS.STRIPE)
                .doc(stripeCustomerId);
            batch.delete(stripeCustomerDataRef)
        }

        // user data
        batch.delete(userDataRef)
    }
    return batch.commit()
};