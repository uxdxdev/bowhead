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
import { makeStyles } from "@material-ui/core/styles";
import { getStripe } from '../../utils/stripe'
import { createStripeCheckoutSession } from '../../api/stripe'
import { connect } from "react-redux";
import { pluginRegistry, PLUGIN_TYPES } from '../../registry/plugin-registry'



const useStyles = makeStyles((theme) => ({
    section: {
        alignItems: "center",
        justifyContent: "center",
        '& .MuiCardContent-root > ul': {
            margin: 0,
            padding: 0,
            listStyle: "none",
        }
    },
    cardPricing: {
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        marginBottom: theme.spacing(2),
    }
}));

const Pricing = ({ uid, email, stripeCustomerId }) => {
    const classes = useStyles();

    const [isRedirecting, setIsRedirecting] = useState(false)

    const app = pluginRegistry.getPluginsByType(PLUGIN_TYPES.BOWHEAD_CONFIGURATION)[0]?.config?.app

    const dashboardUrl =
        process.env.NODE_ENV === "development"
            ? `http://localhost:8888/dashboard`
            : `${app.productionUrl}/dashboard`;

    const handleRedirectToStripe = async (priceId) => {
        setIsRedirecting(true)
        const data = await createStripeCheckoutSession({
            stripeCustomerId,
            priceId,
            successUrl: dashboardUrl,
            cancelUrl: dashboardUrl,
            email,
            uid
        }).catch(() => {
            setIsRedirecting(false)
        })


        if (data && data.id) {
            const stripe = await getStripe();
            stripe.redirectToCheckout({
                sessionId: data.id
            }).catch(error => {
                console.log(error)
            });
        } else {
            console.warn('Error calling createStripeCheckoutSession(). Check the Bowhead configuration for this API endpoint. e.g. PLUGIN_TYPES.BOWHEAD_CONFIGURATION')
            setIsRedirecting(false)
        }

    };

    const plans = pluginRegistry.getPluginsByType(PLUGIN_TYPES.BOWHEAD_CONFIGURATION)[0]?.config?.plans

    if (!plans?.basic || !plans?.pro || !plans?.enterprise) return 'Please provide a configuration for Stripe subscription plans'

    const tiers = [
        plans.basic,
        plans.pro,
        plans.enterprise
    ];

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
                                        onClick={() => handleRedirectToStripe(tier.priceId)}
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