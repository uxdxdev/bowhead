import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { STRIPE_SUBSCRIPTION_STATUS } from '@mortond/bowhead'
import { FIRESTORE_COLLECTIONS } from '../utils/constants'
import { setActiveWorkspace } from '../actions/workspaceActions'
import {
    DoubleArrow as DoubleArrowIcon,
    AccountTree as AccountTreeIcon,
} from "@material-ui/icons";
import { PLUGIN_TYPES, pluginRegistry } from "@mortond/bowhead";

const useInit = () => {

    const state = useSelector((state) => state);
    const dispatch = useDispatch()

    const {
        firebase: {
            auth: { uid },
            profile: { stripeCustomerId }
        },
        firestore: {
            data: { userWorkspaces, stripe }
        },
        project: { isCreatingProject },
        workspace: { isCreatingWorkspace }
    } = state;

    const workspaces = userWorkspaces && userWorkspaces[uid]?.workspaces
    const activeWorkspaceId = state.workspace?.activeWorkspaceId
    const role = workspaces && workspaces[activeWorkspaceId]?.role
    const isWorkspaceOwner = role === 'owner'
    const subscriptionStatus = stripe && stripe[stripeCustomerId]?.status
    const isSubscribed = subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
        subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.ACTIVE

    useEffect(() => {
        const firstWorkspace = workspaces && Object.keys(workspaces)[0];
        !activeWorkspaceId && firstWorkspace && dispatch(setActiveWorkspace(firstWorkspace))
    }, [activeWorkspaceId, dispatch, workspaces])


    // register new workspace listeners when new workspaces are created
    useEffect(() => {
        workspaces && Object.keys(workspaces).forEach((workspaceId) => {
            pluginRegistry.register(`firestore-listener-${FIRESTORE_COLLECTIONS.WORKSPACES}-${workspaceId}`, {
                type: PLUGIN_TYPES.LISTENER_FIRESTORE,
                collection: FIRESTORE_COLLECTIONS.WORKSPACES,
                doc: workspaceId,
            })
        })
    }, [workspaces, isCreatingProject, isCreatingWorkspace]);

    // register userWorkspaces listener
    useEffect(() => {
        pluginRegistry.register(`firestore-listener-${FIRESTORE_COLLECTIONS.USER_WORKSPACES}`, {
            type: PLUGIN_TYPES.LISTENER_FIRESTORE,
            collection: FIRESTORE_COLLECTIONS.USER_WORKSPACES,
            doc: uid
        })
    }, [uid]);


    useEffect(() => {
        const workspacesArray = workspaces && Object.keys(workspaces);
        const workspacesCollection = workspacesArray?.filter((workspaceId) => workspaces[workspaceId]?.name && workspaceId)
            .map((workspaceId) => {
                const workspaceName = workspaces[workspaceId]?.name;
                return {
                    menuIcon: activeWorkspaceId === workspaceId && DoubleArrowIcon,
                    text: workspaceName,
                    path: '/projects',
                    onClick: () => {
                        dispatch(setActiveWorkspace(workspaceId))
                    },
                };
            });

        pluginRegistry.register('link-workspaces', {
            type: PLUGIN_TYPES.LINK_SIDEBAR,
            menuIcon: AccountTreeIcon,
            text: "Workspaces",
            items: workspacesCollection,
            path: '/workspaces'
        })
    }, [workspaces, activeWorkspaceId, dispatch, isSubscribed])

    return {
        isWorkspaceOwner,
        isSubscribed
    }
}

export default useInit