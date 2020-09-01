import * as constants from "../../utils/constants";
import { firestore, firebase } from '../../utils/firebaseFrontend'

export const deleteWorkspaceAndProjects = async ({ uid, workspaceId }) => {
    const userRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

    const workspaceRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId);

    const batch = firestore.batch();
    // delete projects
    const projectsRef = await firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .collection(constants.FIRESTORE_COLLECTIONS.PROJECTS)
        .get();

    projectsRef.docs.forEach((project) => {
        batch.delete(project.ref)
    });

    // delete workspace
    batch.delete(workspaceRef)

    // remove workspace from user data
    batch.set(
        userRef,
        {
            workspaces: {
                [workspaceId]: firebase.firestore.FieldValue.delete()
            }
        },
        { merge: true }
    );

    return batch.commit()
}

export const removeUserFromWorkspace = ({ uid, workspaceId }) => {
    return firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .set({
            members: {
                [uid]: firebase.firestore.FieldValue.delete()
            }
        }, { merge: true })
}

export const removeWorkspaceFromUser = ({ uid, workspaceId }) => {
    return firestore
        .collection(constants.FIRESTORE_COLLECTIONS.USERS)
        .doc(uid)
        .set({
            workspaces: {
                [workspaceId]: firebase.firestore.FieldValue.delete()
            }
        }, { merge: true })
}

export const createWorkspace = ({ workspaceName, uid, email }) => {
    const workspaceRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc();

    const userRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

    const batch = firestore.batch();

    // create new workspace
    batch.set(workspaceRef, {
        name: workspaceName,
        members: {
            [uid]: { role: constants.USER_ROLES.OWNER, email }
        }
    });

    // update user profile
    batch.set(userRef, {
        email,
        workspaces: {
            [workspaceRef.id]: { role: constants.USER_ROLES.OWNER, name: workspaceName }
        }
    },
        { merge: true }
    );

    const activeWorkspaceId = workspaceRef.id
    return batch.commit().then(() => { return { activeWorkspaceId } })
}

export const deleteProject = ({ projectId, workspaceId }) => {
    return firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .collection(constants.FIRESTORE_COLLECTIONS.PROJECTS)
        .doc(projectId)
        .delete()
}

export const createProject = ({ workspaceId, title, summary }) => {
    return firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .collection(constants.FIRESTORE_COLLECTIONS.PROJECTS)
        .doc()
        .set({
            title,
            summary,
            createdAt: new Date()
        })
}

export const updateMemberStatus = ({ workspaceId, email, status }) => {
    return firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .set({
            invites: {
                [email]: status
            }
        }, { merge: true });
}

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

export const verifyUserInviteUpdate = ({ workspaceId, workspaceName, uid, email }) => {
    const workspaceRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId);

    const userRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.USERS)
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
                [uid]: { role: constants.USER_ROLES.MEMBER, email }
            }
        },
        { merge: true }
    );

    // update user profile
    batch.set(
        userRef,
        {
            email,
            workspaces: {
                [workspaceRef.id]: {
                    role: constants.USER_ROLES.MEMBER,
                    name: workspaceName
                }
            }
        },
        { merge: true }
    );

    return batch.commit()
}


export const deleteUserAccountAndData = async uid => {

    const userDataRef = firestore
        .collection(constants.FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

    const userDataDoc = await userDataRef.get();
    const userData = userDataDoc.data();
    const batch = firestore.batch();

    if (userData) {
        const workspaces = userData.workspaces || null;
        const stripeCustomerId = userData.stripeCustomerId || null;

        if (stripeCustomerId) {
            // delete stripe customer data
            const stripeCustomerDataRef = firestore
                .collection(constants.FIRESTORE_COLLECTIONS.STRIPE)
                .doc(stripeCustomerId);
            batch.delete(stripeCustomerDataRef)
        }

        if (workspaces) {
            // workspaces
            for (let key in workspaces) {
                const workspaceData = workspaces[key];
                const workspaceRole = workspaceData.role;
                const workspaceRef = firestore
                    .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
                    .doc(key);

                // remove user from workspaces
                if (workspaceRole === constants.USER_ROLES.MEMBER) {
                    batch.set(workspaceRef,
                        {
                            members: {
                                [uid]: firebase.firestore.FieldValue.delete()
                            }
                        },
                        { merge: true }
                    )
                }

                if (workspaceRole === constants.USER_ROLES.OWNER) {
                    // delete projects
                    const projectsRef = await firestore
                        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
                        .doc(key)
                        .collection(constants.FIRESTORE_COLLECTIONS.PROJECTS)
                        .get();
                    projectsRef.docs.forEach((project) => {
                        batch.delete(project.ref)
                    });

                    // delete workspace
                    batch.delete(workspaceRef)
                }
            }
        }

        // user data
        batch.delete(userDataRef)
    }
    return batch.commit()
};