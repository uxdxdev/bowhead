import React, { useState } from "react";
import { connect } from "react-redux";
import { Typography, Button, Paper } from "@material-ui/core";
import { useStyles } from './billing-styles'
import { ButtonBox } from "../button-box";
import { ButtonLoadingSpinner } from "../button-loading-spinner";
import { useHistory } from 'react-router-dom'
import { STRIPE_SUBSCRIPTION_STATUS } from "../../utils/constants";
import { createStripeCustomerPortalSession } from '../../api/stripe'
import { pluginRegistry, PLUGIN_TYPES } from '../../registry/plugin-registry'

const Billing = ({ stripeCustomerId, planTitle, status, isSubscribed }) => {
  const { paper, button, subscriptionStatus } = useStyles();
  const history = useHistory();

  const [isRedirectingToStripeCustomerPortal, setIsRedirectingToStripeCustomerPortal] = useState(false)

  // redirect the user to the Stripe customer portal
  const handleCreateSessionOpenPortal = async () => {
    setIsRedirectingToStripeCustomerPortal(true)

    const data = await createStripeCustomerPortalSession(stripeCustomerId)
      .catch(() => {
        setIsRedirectingToStripeCustomerPortal(false)
      })

    // redirect use to stripe portal
    const url = data.url || null
    if (url) {
      window.location.replace(url)
    } else {
      // something went wrong to let the user try again
      setIsRedirectingToStripeCustomerPortal(false)
    }
  }

  return (
    <Paper className={paper} variant="outlined">
      <Typography component="h2" variant="h6">
        Subscription
      </Typography>

      <Typography>{planTitle || 'Not subscribed to any plan yet.'}</Typography>

      {status && <>
        <Typography component="h2" variant="h6">
          Status
        </Typography>

        <Typography className={subscriptionStatus}>{status}</Typography>
      </>}

      < ButtonBox >
        {
          isSubscribed ?
            <>
              < Button color="primary" variant="contained" className={button}
                onClick={() => handleCreateSessionOpenPortal()}
                disabled={isRedirectingToStripeCustomerPortal}
              >
                Manage subscription
            </Button>
              {isRedirectingToStripeCustomerPortal && <ButtonLoadingSpinner />}
            </>
            :
            <Button color="primary" variant="contained" className={button}
              onClick={() => history.push('/dashboard')}
              disabled={isRedirectingToStripeCustomerPortal}
            >
              Subscribe now
          </Button>
        }
      </ButtonBox >
    </Paper >
  );
};

const mapStateToProps = (state) => {
  const {
    firebase: {
      profile: { stripeCustomerId },
    },
    firestore: {
      data: {
        stripe
      }
    }
  } = state;

  const stripeData = stripe && stripe[stripeCustomerId];
  const planId = stripeData?.planId
  const status = stripeData?.status
  const isSubscribed = stripeData?.status === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    stripeData?.status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE;

  const plans = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.plans

  let planTitle = plans.filter(plan => plan.priceId === planId)[0].title

  return {
    stripeCustomerId,
    planTitle,
    status,
    isSubscribed
  };
};

export default connect(mapStateToProps)(Billing);
