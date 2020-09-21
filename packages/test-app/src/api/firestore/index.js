import { FIRESTORE_COLLECTIONS, USER_ROLES } from "../../utils/constants";
import { firestore, firebase } from '../../utils/firebase'
import { uuid } from '../../utils/uuid'

export const deleteWorkspace = async ({ uid, workspaceId }) => {
    const userWorkspacesRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USER_WORKSPACES)
        .doc(uid);

    const workspaceRef = firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId);

    const batch = firestore.batch();

    // delete workspace
    batch.delete(workspaceRef)

    // remove workspace from user data
    batch.set(
        userWorkspacesRef,
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

export const createWorkspace = ({ workspaceName, uid, email }) => {
    const workspaceRef = firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc();

    const userWorkspacesRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USER_WORKSPACES)
        .doc(uid);

    const batch = firestore.batch();

    // create new workspace
    batch.set(workspaceRef, {
        name: workspaceName,
        owner: uid,
        members: {
            [uid]: { role: USER_ROLES.OWNER, email }
        }
    });

    batch.set(userWorkspacesRef, {
        email,
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

export const verifyUserInviteUpdate = ({ workspaceId, workspaceName, uid, email }) => {
    const workspaceRef = firestore
        .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId);

    const userRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(uid);

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

    // create user profile when being invited
    batch.set(
        userRef,
        {
            email,
        },
        { merge: true }
    );

    return batch.commit()
}


export const deleteUserAccountAndData = async uid => {

    const userDataRef = firestore
        .collection(FIRESTORE_COLLECTIONS.USERS)
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
                .collection(FIRESTORE_COLLECTIONS.STRIPE)
                .doc(stripeCustomerId);
            batch.delete(stripeCustomerDataRef)
        }

        if (workspaces) {
            // workspaces
            for (let key in workspaces) {
                const workspaceData = workspaces[key];
                const workspaceRole = workspaceData.role;
                const workspaceRef = firestore
                    .collection(FIRESTORE_COLLECTIONS.WORKSPACES)
                    .doc(key);

                // remove user from workspaces
                if (workspaceRole === USER_ROLES.MEMBER) {
                    batch.set(workspaceRef,
                        {
                            members: {
                                [uid]: firebase.firestore.FieldValue.delete()
                            }
                        },
                        { merge: true }
                    )
                }

                if (workspaceRole === USER_ROLES.OWNER) {
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