import React, { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography
} from "@material-ui/core";
import { Star as StarBorder } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { stripe } from '../../utils/stripeFrontend'
import { createStripeCheckoutSession } from '../../api/stripe'
import { connect } from "react-redux";

const tiers = [
    {
        title: "Basic",
        price: "249",
        priceId: process.env.REACT_APP_SUBSCRIPTION_PLAN_BASIC,
        description: [
            "10 Projects",
            "Unlimited Users",
            "Live Support",
            "14 Day Free Trial",
        ],
        buttonText: "Get started",
        buttonVariant: "outlined",
    },
    {
        title: "Pro",
        subheader: "Most popular",
        price: "599",
        priceId: process.env.REACT_APP_SUBSCRIPTION_PLAN_PRO,
        description: [
            "25 Projects",
            "Unlimited Users",
            "Live Support",
            "14 Day Free Trial",
        ],
        buttonText: "Get started",
        buttonVariant: "contained",
    },
    {
        title: "Enterprise",
        price: "1399",
        priceId: process.env.REACT_APP_SUBSCRIPTION_PLAN_ENTERPRISE,
        description: [
            "125 Projects",
            "Unlimited Users",
            "Live Support",
            "14 Day Free Trial",
        ],
        buttonText: "Get started",
        buttonVariant: "outlined",
    },
];

const useStyles = makeStyles((theme) => ({
    "@global": {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: "none",
        },
    },
    section: {
        alignItems: "center",
        justifyContent: "center",
    },
    cardPricing: {
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        marginBottom: theme.spacing(2),
    }
}));

const Pricing = ({ uid, email, isSubscribed, stripeCustomerId }) => {
    const classes = useStyles();

    const [isRedirecting, setIsRedirecting] = useState(false)

    const successUrl =
        process.env.NODE_ENV === "development"
            ? `http://localhost:8888/dashboard`
            : `${process.env.REACT_APP_NETLIFY_URL}/dashboard`;

    const cancelUrl =
        process.env.NODE_ENV === "development"
            ? `http://localhost:8888/dashboard`
            : `${process.env.REACT_APP_NETLIFY_URL}/dashboard`;


    const handleRedirectToStripe = async (priceId) => {
        setIsRedirecting(true)
        const stripeInstance = await stripe;
        const data = await createStripeCheckoutSession({
            stripeCustomerId,
            priceId,
            successUrl,
            cancelUrl,
            email,
            uid
        }).catch(() => {
            setIsRedirecting(false)
        })

        if (data.id) {
            await stripeInstance.redirectToCheckout({
                sessionId: data.id
            }).catch(error => {
                console.log(error)
            });
        } else {
            setIsRedirecting(false)
        }

    };

    // only redirect to Stripe if isSubscribed is explicitly 'false'
    // if undefined do not redirect
    const redirectToStripe = isSubscribed === false;

    return (
        <Grid
            container
            component="section"
            className={classes.section}
            alignItems="flex-end"
            spacing={6}
        >
            {
                tiers.map((tier) => (
                    // Enterprise card is full width at sm breakpoint
                    <Grid
                        item
                        key={tier.title}
                        xs={12}
                        sm={tier.title === "Enterprise" ? 12 : 6}
                        md={4}
                    >
                        <Card>
                            <CardHeader
                                title={tier.title}
                                subheader={tier.subheader}
                                titleTypographyProps={{ align: "center" }}
                                subheaderTypographyProps={{ align: "center" }}
                                action={tier.title === "Pro" ? <StarBorder /> : null}
                            />
                            <CardContent>
                                <div className={classes.cardPricing}>
                                    <Typography component="h2" variant="h2">
                                        €{tier.price}
                                    </Typography>
                                    <Typography>/ month</Typography>
                                </div>
                                <div className={classes.cardPricing}>
                                    <Button
                                        {...(uid && redirectToStripe
                                            ? {
                                                onClick: () => handleRedirectToStripe(tier.priceId)
                                            } : {
                                                component: NavLink,
                                                to: "/signin"
                                            })}
                                        variant={tier.buttonVariant}
                                        color="primary"
                                        disabled={isRedirecting}
                                    >
                                        {tier.buttonText}
                                    </Button>
                                </div>
                                <ul>
                                    {tier.description.map((line) => (
                                        <Typography component="li" align="center" key={line}>
                                            {line}
                                        </Typography>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            }
        </Grid >)

}

const mapStateToProps = (state) => {
    const {
        firebase: { auth: { uid, email }, profile: { stripeCustomerId } },
    } = state;

    return {
        uid,
        email,
        stripeCustomerId,
    };
};

export default connect(mapStateToProps)(Pricing);