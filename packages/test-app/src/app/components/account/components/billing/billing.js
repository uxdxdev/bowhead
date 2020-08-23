import React, { useState } from "react";
import { connect } from "react-redux";
import { Typography, Button, Paper } from "@material-ui/core";
import { useStyles } from './billing-styles'
import { ButtonBox, ButtonLoadingSpinner } from "../../../";
import { useHistory } from 'react-router-dom'
import { getToken } from '../../../../../utils/frontend/firebaseFrontend'
import { STRIPE_SUBSCRIPTION_STATUS } from "../../../../../utils/constants";

const Billing = ({ stripeCustomerId, plan, status, isSubscribed }) => {
  const { paper, button, subscriptionStatus } = useStyles();
  const history = useHistory();

  const [isRedirectingToStripeCustomerPortal, setIsRedirectingToStripeCustomerPortal] = useState(false)

  // redirect the user to the Stripe customer portal
  const handleCreateSessionOpenPortal = async () => {
    setIsRedirectingToStripeCustomerPortal(true)

    const token = await getToken();
    const data = await fetch(`/.netlify/functions/create-stripe-customer-portal-session?token=${token}`, {
      method: 'POST',
      body: JSON.stringify({ customer: stripeCustomerId })
    }).then(result => result.json()).catch(() => {
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
        Subsciption
      </Typography>

      <Typography>{plan || 'Not subscribed to any plan yet.'}</Typography>

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

  let plan = '';
  switch (planId) {
    case process.env.REACT_APP_SUBSCRIPTION_PLAN_BASIC: {
      plan = 'Basic';
      break;
    }
    case process.env.REACT_APP_SUBSCRIPTION_PLAN_PRO: {
      plan = 'Pro';
      break;
    }
    case process.env.REACT_APP_SUBSCRIPTION_PLAN_ENTERPRISE: {
      plan = 'Enterprise';
      break;
    }
    default:
      break;
  }

  return {
    stripeCustomerId,
    plan,
    status,
    isSubscribed
  };
};

export default connect(mapStateToProps)(Billing);
