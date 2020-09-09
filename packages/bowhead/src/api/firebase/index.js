import { getFirebase } from '../../utils/firebase'
import { pluginRegistry, PLUGIN_TYPES } from '../../registry/plugin-registry'

export const deleteCurrentUser = () => {
    return getFirebase()
        .auth()
        .currentUser.delete()
}

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
export const sendSignInEmail = ({ email, ref, data }) => {

    const app = pluginRegistry.getPluginsByType(PLUGIN_TYPES.BOWHEAD_CONFIGURATION)[0]?.config?.app

    const urlStr = process.env.NODE_ENV === "development"
        ? `http://localhost:8888/verify`
        : `${app.productionUrl}/verify`;

    const url = new URL(urlStr);

    if (ref) {
        url.searchParams.append("ref", ref);
    }
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