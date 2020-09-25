import { FIRESTORE_COLLECTIONS, USER_ROLES } from "../../utils/constants";
import { firestore, firebase } from '../../utils/firebase'
import { uuid } from '../../utils/uuid'
import { updateUserProfile } from '@mortond/bowhead'

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
export const sendSignInEmail = ({ email, data }) => {
    const urlStr = process.env.NODE_ENV === "development"
        ? `http://localhost:8888/invite`
        : `${process.env.REACT_APP_NETLIFY_URL}/invite`;

    const url = new URL(urlStr);

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


export const deleteWorkspace = async ({ uid, workspaceId }) => {
    const userWorkspacesRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USER_WORKSPACES)
        .doc(uid);

    const workspaceRef = firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId);

    const userWorkspacesDocument = await userWorkspacesRef.get()
    const workspaces = userWorkspacesDocument.data().workspaces
    const numberOfWorkspaces = Object.keys(workspaces).length

    const batch = firestore.batch();

    // delete workspace
    batch.delete(workspaceRef)

    // remove workspace from user data
    batch.set(
        userWorkspacesRef,
        {
            numberOfWorkspaces: numberOfWorkspaces - 1,
            workspaces: {
                [workspaceId]: firebase.firestore.FieldValue.delete()
            }
        },
        { merge: true }
    );

    return batch.commit()
}

export const deleteUserWorkspaces = async ({ uid }) => {

    const userWorkspacesRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USER_WORKSPACES)
        .doc(uid);

    const userWorkspacesDocument = await userWorkspacesRef.get()
    const userWorkspacesDocumentData = userWorkspacesDocument.data();
    const workspaces = userWorkspacesDocumentData?.workspaces;

    const batch = firestore.batch();

    // delete user workspaces
    batch.delete(userWorkspacesRef)


    // delete workspaces owner by the user
    workspaces && Object.keys(workspaces)
        .filter(workspaceId => workspaces[workspaceId].role === 'owner')
        .forEach(workspaceId => {
            const workspaceRef = firestore
                .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
                .doc(workspaceId);

            batch.delete(workspaceRef)
        })

    return batch.commit()
}

export const removeUserFromWorkspace = ({ uid, workspaceId }) => {
    return firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .set({
            members: {
                [uid]: firebase.firestore.FieldValue.delete()
            }
        }, { merge: true })
}

export const removeWorkspaceFromUser = ({ uid, workspaceId }) => {
    return firestore
        .collection(FIRESTORE_COLLECTIONS.USER_WORKSPACES)
        .doc(uid)
        .set({
            workspaces: {
                [workspaceId]: firebase.firestore.FieldValue.delete()
            }
        }, { merge: true })
}

export const createWorkspace = async ({ workspaceName, uid, email }) => {

    const workspaceRef = firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc();

    const userWorkspacesRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USER_WORKSPACES)
        .doc(uid);

    const userWorkspacesDocument = await userWorkspacesRef.get()
    const workspaces = userWorkspacesDocument.data()?.workspaces
    const numberOfWorkspaces = (workspaces && Object.keys(workspaces).length) || 0

    const batch = firestore.batch();

    // create new workspace
    batch.set(workspaceRef, {
        name: workspaceName,
        owner: uid,
        members: {
            [uid]: { role: USER_ROLES.OWNER, email }
        }
    });

    // add workspace to user data
    batch.set(userWorkspacesRef, {
        email,
        numberOfWorkspaces: numberOfWorkspaces + 1,
        workspaces: {
            [workspaceRef.id]: { role: USER_ROLES.OWNER, name: workspaceName }
        }
    },
        { merge: true }
    );

    const activeWorkspaceId = workspaceRef.id
    return batch.commit().then(() => { return { activeWorkspaceId } })
}

export const deleteProject = ({ projectId, workspaceId }) => {
    return firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .set({
            projects: {
                [projectId]: firebase.firestore.FieldValue.delete()
            }
        }, { merge: true })
}

export const createProject = ({ workspaceId, title, summary }) => {
    const projectId = uuid();
    return firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .set({
            projects: {
                [projectId]: {
                    id: projectId,
                    title,
                    summary,
                    createdAt: new Date()
                }
            }
        }, { merge: true })
}

export const updateMemberStatus = ({ workspaceId, email, status }) => {
    return firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .set({
            invites: {
                [email]: status
            }
        }, { merge: true });
}

export const verifyUserInviteUpdate = async ({ workspaceId, workspaceName, uid, email }) => {
    const workspaceRef = firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId);

    const userWorkspaceRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USER_WORKSPACES)
        .doc(uid);

    const batch = firestore.batch();

    // update the existing workspace
    batch.set(
        workspaceRef,
        {
            invites: {
                [email]: firebase.firestore.FieldValue.delete()
            },
            members: {
                [uid]: { role: USER_ROLES.MEMBER, email }
            }
        },
        { merge: true }
    );

    // update user workspace
    batch.set(
        userWorkspaceRef,
        {
            email,
            workspaces: {
                [workspaceRef.id]: {
                    role: USER_ROLES.MEMBER,
                    name: workspaceName
                }
            }
        },
        { merge: true }
    );

    await updateUserProfile({ email })

    return batch.commit()
}