import * as constants from "../../utils/constants";
import { firestore } from '../../utils/firebaseFrontend'

export const verifyUserSignInUpdate = ({ uid, email }) => {
    return firestore
        .collection(constants.FIRESTORE_COLLECTIONS.USERS)
        .doc(uid)
        .set({
            email,
        },
            { merge: true }
        );
}

export const deleteUserAccountAndData = async uid => {

    const userDataRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

    const userDataDoc = await userDataRef.get();
    const userData = userDataDoc.data();
    const batch = firestore.batch();

    if (userData) {
        const stripeCustomerId = userData.stripeCustomerId || null;

        if (stripeCustomerId) {
            // delete stripe customer data
            const stripeCustomerDataRef = firestore
                .collection(constants.FIRESTORE_COLLECTIONS.STRIPE)
                .doc(stripeCustomerId);
            batch.delete(stripeCustomerDataRef)
        }

        // user data
        batch.delete(userDataRef)
    }
    return batch.commit()
};