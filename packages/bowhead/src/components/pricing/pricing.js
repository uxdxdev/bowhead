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

const Pricing = ({ uid, email }) => {
    const classes = useStyles();

    const [isRedirecting, setIsRedirecting] = useState(false)

    const app = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.app

    const dashboardUrl =
        process.env.NODE_ENV === "development"
            ? `http://localhost:8888/dashboard`
            : `${app.productionUrl}/dashboard`;

    const handleRedirectToStripe = async (priceId) => {
        setIsRedirecting(true)
        const data = await createStripeCheckoutSession({
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
            setIsRedirecting(false)
        }

    };

    const plans = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.plans

    return (
        <Grid
            container
            component="section"
            className={classes.section}
            alignItems="flex-end"
            spacing={6}
        >
            {
                // only use the first 3 entires in the plans array
                plans.slice(0, 3).map((tier, index) => (
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
                                        variant={index % 2 ? "contained" : "outlined"}
                                        color="primary"
                                        disabled={isRedirecting}
                                    >
                                        Get started
                                    </Button>
                                </div>
                                <ul>
                                    {tier.featureList.map((line) => (
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
        firebase: { auth: { uid, email } }
    } = state;

    return {
        uid,
        email
    };
};

export default connect(mapStateToProps)(Pricing);