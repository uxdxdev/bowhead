import React from 'react'
import { CreateWorkspace, Pricing } from "../";
import { connect } from "react-redux";
import { STRIPE_SUBSCRIPTION_STATUS, USER_ROLES } from '../../../utils/constants';

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
            profile: { workspaces, customer },
        },
        firestore: {
            data
        },
        auth: { activeWorkspaceId },
    } = state;

    const role = workspaces && workspaces[activeWorkspaceId]?.role
    const isMember = role && role === USER_ROLES.MEMBER;
    const subscriptionStatus = data && data.stripe && data.stripe[customer]?.status
    const isSubscribed = (subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
        subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.ACTIVE)
    const hasAccessToWorkspace = isSubscribed || isMember

    return {
        isSubscribed,
        hasAccessToWorkspace
    };
};


export default connect(
    mapStateToProps
)(DashboardRoot);