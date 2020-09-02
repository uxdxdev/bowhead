import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as constants from '../utils/constants'
import { updateFirestoreListeners } from '@mortond/bowhead'
import { setActiveWorkspace } from '../actions/workspaceActions'

import {
    DoubleArrow as DoubleArrowIcon,
    AccountTree as AccountTreeIcon,
} from "@material-ui/icons";
import { PLUGIN_TYPES, pluginRegistry } from "@mortond/bowhead";

const useWorkspaces = () => {

    const state = useSelector((state) => state);
    const dispatch = useDispatch()

    const {
        firebase: {
            auth: { uid }
        },
        firestore: {
            data: { userWorkspaces }
        }
    } = state;

    const workspaces = userWorkspaces && userWorkspaces[uid]?.workspaces

    const activeWorkspaceId = state.workspace?.activeWorkspaceId
    const role = workspaces && workspaces[activeWorkspaceId]?.role
    const isWorkspaceOwner = role === 'owner'

    useEffect(() => {
        const collections = []
        workspaces && Object.keys(workspaces).forEach((workspaceId) => {
            collections.push({
                collection: constants.FIRESTORE_COLLECTIONS.WORKSPACES,
                doc: workspaceId,
                orderBy: ["createdAt", "desc"],
                subcollections: [{ collection: constants.FIRESTORE_COLLECTIONS.PROJECTS }],
                storeAs: `${workspaceId}::projects`,
            })
        })

        collections.push({
            collection: constants.FIRESTORE_COLLECTIONS.USER_WORKSPACES,
            doc: uid
        })

        dispatch(updateFirestoreListeners(collections))
    }, [workspaces, dispatch, uid]);

    useEffect(() => {
        const firstWorkspace = workspaces && Object.keys(workspaces)[0];
        !activeWorkspaceId && firstWorkspace && dispatch(setActiveWorkspace(firstWorkspace))
    }, [activeWorkspaceId, dispatch, workspaces])

    useEffect(() => {
        const workspacesArray = workspaces && Object.keys(workspaces);
        const workspacesCollection = workspacesArray?.filter((workspaceId) => workspaces[workspaceId]?.name && workspaceId)
            .map((workspaceId) => {
                const workspaceName = workspaces[workspaceId]?.name;
                return {
                    menuIcon: activeWorkspaceId === workspaceId && DoubleArrowIcon,
                    text: workspaceName,
                    path: '/dashboard/project',
                    onClick: () => {
                        dispatch(setActiveWorkspace(workspaceId))
                    },
                };
            });

        pluginRegistry.register('workspaces-menu-item', {
            type: PLUGIN_TYPES.MENU_ITEM.SIDEBAR,
            menuIcon: AccountTreeIcon,
            text: "Workspaces",
            items: workspacesCollection,
        })
    }, [workspaces, activeWorkspaceId, dispatch])

    return {
        isWorkspaceOwner
    }
}

export default useWorkspaces