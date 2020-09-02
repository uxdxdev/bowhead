import { firebase } from '@mortond/bowhead'

export const deleteCurrentUser = () => {
    return firebase
        .auth()
        .currentUser.delete()
}

export const signOut = () => {
    return firebase
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
    const urlStr = process.env.NODE_ENV === "development"
        ? `http://localhost:8888/verify`
        : `${process.env.REACT_APP_NETLIFY_URL}/verify`;

    const url = new URL(urlStr);

    if (ref) {
        url.searchParams.append("ref", ref);
    }
    data && Object.keys(data).forEach(key => {
        url.searchParams.append(key, data[key]);
    });

    return firebase
        .auth()
        .sendSignInLinkToEmail(email, {
            url: url.href,
            handleCodeInApp: true
        })
}

export const signInWithEmailLink = ({ email, location }) => {
    return firebase.auth().signInWithEmailLink(email, location)
}

export const isSignInWithEmailLink = ({ location }) => {
    return firebase.auth().isSignInWithEmailLink(location)
}