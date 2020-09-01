import * as constants from "../../utils/constants";
import { firestore as db } from '@mortond/bowhead'

export const deleteProject = ({ projectId, workspaceId }) => {
    return db
        .collection(constants.FIRESTORE_COLLECTIONS.WORKSPACES)
        .doc(workspaceId)
        .collection(constants.FIRESTORE_COLLECTIONS.PROJECTS)
        .doc(projectId)
        .delete()
}

export const createProject = ({ workspaceId, title, summary }) => {
    return db
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
