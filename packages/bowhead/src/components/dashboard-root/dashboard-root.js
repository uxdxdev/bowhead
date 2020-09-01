import React from 'react'
import { CreateWorkspace } from "../create-workspace";
import { Pricing } from "../pricing";
import { connect } from "react-redux";
import * as constants from "../../utils/constants"

const DashboardRoot = (props) => {

    const { isSubscribed, hasAccessToWorkspace } = props;

    if (!isSubscribed || !hasAccessToWorkspace) {
        return <Pricing isSubscribed={isSubscribed} />
    }

    return (
        isSubscribed ? <CreateWorkspace /> : null
    )
}

const mapStateToProps = (state) => {
    const {
        firebase: {
            profile: { workspaces, stripeCustomerId },
        },
        firestore: {
            data
        },
        workspace: { activeWorkspaceId },
    } = state;

    const role = workspaces && workspaces[activeWorkspaceId]?.role
    const isMember = role && role === constants.USER_ROLES.MEMBER;
    const subscriptionStatus = data && data.stripe && data.stripe[stripeCustomerId]?.status
    const isSubscribed = (subscriptionStatus === constants.STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
        subscriptionStatus === constants.STRIPE_SUBSCRIPTION_STATUS.ACTIVE)
    const hasAccessToWorkspace = isSubscribed || isMember

    return {
        isSubscribed,
        hasAccessToWorkspace
    };
};


export default connect(
    mapStateToProps
)(DashboardRoot);