import React from "react";
import { NavLink } from "react-router-dom";

import hero from "../../images/landing_page_image_001.svg";

import problem1 from "../../images/problems/image_problem_001.svg";
import problem2 from "../../images/problems/image_problem_002.svg";
import problem3 from "../../images/problems/image_problem_003.svg";

import solution1 from "../../images/solutions/image_solution_001.svg";
import solution2 from "../../images/solutions/image_solution_002.svg";
import solution3 from "../../images/solutions/image_solution_003.svg";

import feature1 from "../../images/features/image_feature_001.svg";
import feature2 from "../../images/features/image_feature_002.svg";
import feature3 from "../../images/features/image_feature_003.svg";

import companyLogoAirBnb from "../../images/logos/airbnb.png";
import companyLogoCircleCi from "../../images/logos/circleci.png";
import companyLogoHubSpot from "../../images/logos/hubspot.png";
import companyLogoInvision from "../../images/logos/invision.png";
import companyLogoSpotify from "../../images/logos/spotify.png";
import companyLogotwilio from "../../images/logos/twilio.png";

import { Footer } from '../../components/footer'

import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import { Assessment, StarBorder } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  section: {
    '& .MuiCardContent-root > ul': {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
    margin: theme.spacing(10, 0, 10),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLeftBottom: {
    order: 1,
    [theme.breakpoints.down("sm")]: {
      order: 2,
      textAlign: "center",
    },
  },
  sectionRightTop: {
    order: 2,
    [theme.breakpoints.down("sm")]: {
      order: 1,
      textAlign: "center",
    },
  },
  sectionLeftTop: {
    order: 1,
    [theme.breakpoints.down("sm")]: {
      order: 1,
      textAlign: "center",
    },
  },
  sectionRightBottom: {
    order: 2,
    [theme.breakpoints.down("sm")]: {
      order: 2,
      textAlign: "center",
    },
  },
  image: { width: "100%", padding: theme.spacing(4) },
  imageCompanyLogo: {
    width: "100%",
    filter: "grayscale(100%)",
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
  feature: {
    padding: theme.spacing(2),
  },
  footer: {
    marginBottom: theme.spacing(2),
  },

  icon: {
    verticalAlign: "middle",
  },
  boxWidth50: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  // https://css-tricks.com/hash-tag-links-padding/
  anchor: {
    "&::before": {
      display: "block",
      content: "' '",
      marginTop: -(theme.mixins.toolbar.minHeight + theme.spacing(4)),
      height: theme.mixins.toolbar.minHeight + theme.spacing(4),
      visibility: "hidden",
      pointerEvents: "none",
    },
  },
}));


const tiers = [
  {
    title: "Basic",
    price: "10",
    description: [
      "1 Workspace",
      "1 Project/per workspace"
    ],
    buttonText: "Get started",
    buttonVariant: "outlined",
  },
  {
    title: "Pro",
    subheader: "Most popular",
    price: "50",
    description: [
      "5 Workspaces",
      "5 Projects/per workspace"
    ],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
  {
    title: "Enterprise",
    price: "250",
    description: [
      "25 Workspaces",
      "25 Projects/per workspace"
    ],
    buttonText: "Get started",
    buttonVariant: "outlined",
  },
];

const LandingPage = () => {
  const classes = useStyles();

  return (
    <>
      {/* main */}
      <Container component="main">
        {/* hero */}
        <Grid container component="section" className={classes.section}>
          <Grid item md className={classes.sectionLeftBottom}>
            <Typography component="h1" variant="h1" gutterBottom>
              Get notified when a topic is being discussed online
            </Typography>
            <Typography component="div" variant="subtitle1" gutterBottom>
              Always be ahead of the trend
            </Typography>
            <Button
              component={NavLink}
              to="/signin"
              variant="contained"
              color="primary"
            >
              Get Started
            </Button>
          </Grid>
          <Grid item md className={classes.sectionRightTop}>
            <img src={hero} className={classes.image} alt="Hero" />
          </Grid>
        </Grid>

        {/* credibility */}
        <Grid component="section" className={classes.section}>
          <Typography component="h2" variant="h2" align="center" gutterBottom>
            Many of the worlds leading companies trust Bowhead
          </Typography>
        </Grid>
        <Grid
          container
          component="section"
          className={classes.section}
          spacing={6}
        >
          <Grid item xs={6} md={2}>
            <img
              src={companyLogoAirBnb}
              className={classes.imageCompanyLogo}
              alt="Company logo"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <img
              src={companyLogoCircleCi}
              className={classes.imageCompanyLogo}
              alt="Company logo"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <img
              src={companyLogoHubSpot}
              className={classes.imageCompanyLogo}
              alt="Company logo"
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <img
              src={companyLogoInvision}
              className={classes.imageCompanyLogo}
              alt="Company logo"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <img
              src={companyLogoSpotify}
              className={classes.imageCompanyLogo}
              alt="Company logo"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <img
              src={companyLogotwilio}
              className={classes.imageCompanyLogo}
              alt="Company logo"
            />
          </Grid>
        </Grid>

        {/* problems */}
        <Grid
          container
          component="section"
          className={classes.section}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Typography component="h2" variant="h2" align="center" gutterBottom>
            What problem does your product fix?
          </Typography>
          <Grid item xs={12} sm={6}>
            <Typography component="p" variant="subtitle2" align="center">
              Describe the problem in brief. Use emotionally charged language
              that your customers use when describing their problems!
            </Typography>
          </Grid>
        </Grid>

        <Grid container component="section" className={classes.section}>
          <Grid item md className={classes.sectionLeftTop}>
            <img src={problem1} className={classes.image} alt="problem one" />
          </Grid>
          <Grid item md className={classes.sectionRightBottom}>
            <Typography component="h2" variant="h2" gutterBottom>
              Give Context. What is the cause of this problem?
            </Typography>
            <Typography component="p" variant="subtitle2">
              Talk about the things that cause this problem. This shows the user
              that you actually understand the problem and empathize with them
              about their situation.
            </Typography>
          </Grid>
        </Grid>

        <Grid container component="section" className={classes.section}>
          <Grid item md className={classes.sectionLeftBottom}>
            <Box className={classes.howItWorks}>
              <Typography component="h2" variant="h2" gutterBottom>
                Why can’t they fix it themselves? What solutions have they
                tried?
              </Typography>
              <Typography component="p" variant="subtitle2">
                Talk about the other solutions that the users might have tried
                and why none of them worked perfectly for them. This reinforces
                their pain and their need to find a solution.
              </Typography>
            </Box>
          </Grid>
          <Grid item md className={classes.sectionRightTop}>
            <img src={problem2} className={classes.image} alt="problem two" />
          </Grid>
        </Grid>

        <Grid container component="section" className={classes.section}>
          <Grid item md className={classes.sectionLeftTop}>
            <img src={problem3} className={classes.image} alt="problem one" />
          </Grid>
          <Grid item md className={classes.sectionRightBottom}>
            <Typography component="h2" variant="h2" gutterBottom>
              Problem
            </Typography>
            <Typography component="p" variant="subtitle2">
              Talk about the things that cause this problem. This shows the user
              that you actually understand the problem and empathize with them
              about their situation.
            </Typography>
          </Grid>
        </Grid>

        {/* solutions */}
        <Grid
          container
          component="section"
          className={classes.section}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Typography component="h2" variant="h2" align="center" gutterBottom>
            How does your product fix the problem?
          </Typography>
          <Grid item xs={12} sm={6}>
            <Typography component="p" variant="subtitle2" align="center">
              Explain the solution in brief. What does your product do and how
              does it help the user reach its goals.
            </Typography>
          </Grid>
        </Grid>

        <Grid container component="section" className={classes.section}>
          <Grid item md className={classes.sectionLeftTop}>
            <img src={solution1} className={classes.image} alt="problem one" />
          </Grid>
          <Grid item md className={classes.sectionRightBottom}>
            <Typography component="h2" variant="h2" gutterBottom>
              Explain the main solution or benefit that your product offers.
            </Typography>
            <Typography component="p" variant="subtitle2">
              Explain your primary feature that solves your user’s problems.
              Talk about what it can do for the user and how exactly will it
              benefit them.
            </Typography>
          </Grid>
        </Grid>

        <Grid container component="section" className={classes.section}>
          <Grid item md className={classes.sectionLeftBottom}>
            <Box className={classes.howItWorks}>
              <Typography component="h2" variant="h2" gutterBottom>
                Explain the secondary solution that also benefits the user
              </Typography>
              <Typography component="p" variant="subtitle2">
                Your product likely has mutiple benefits and use cases. Talk
                about the secondary benefit that it offers and how it will help
                the user solve their problems.
              </Typography>
            </Box>
          </Grid>
          <Grid item md className={classes.sectionRightTop}>
            <img src={solution2} className={classes.image} alt="problem two" />
          </Grid>
        </Grid>

        <Grid container component="section" className={classes.section}>
          <Grid item md className={classes.sectionLeftTop}>
            <img src={solution3} className={classes.image} alt="problem one" />
          </Grid>
          <Grid item md className={classes.sectionRightBottom}>
            <Typography component="h2" variant="h2" gutterBottom>
              Your product likely has mutiple benefits and use cases. Talk about
              the secondary benefit that it offers and how it will help the user
              solve their problems.
            </Typography>
            <Typography component="p" variant="subtitle2">
              This is the part where you differentiate yourself from the
              competition. Once you’ve convinved the user that this is the way
              to solve their problem, we have to hone in on why our product is
              the best among the other alternatives.
            </Typography>
          </Grid>
        </Grid>

        {/* testimonials */}

        {/* features */}
        <Grid component="section" className={classes.section}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            gutterBottom
            id="features"
            className={classes.anchor}
          >
            Highlight the best features of the app
          </Typography>
        </Grid>

        <Grid
          container
          component="section"
          className={classes.section}
          spacing={6}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.feature}>
              <img src={feature1} className={classes.image} alt="Hero" />
              <Typography component="h2" variant="h2" gutterBottom>
                <Assessment fontSize="large" className={classes.icon} /> Feature
              </Typography>
              <Typography>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi
                sunt nam eveniet voluptas hic magnam autem itaque, aspernatur
                sed ut assumenda harum perspiciatis ipsum reiciendis quis
                officia porro. Maxime, a?
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.feature}>
              <img src={feature2} className={classes.image} alt="Hero" />
              <Typography component="h2" variant="h2" gutterBottom>
                <Assessment fontSize="large" className={classes.icon} /> Feature
              </Typography>
              <Typography>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                quia aspernatur non fugit consequuntur quidem modi eveniet
                veniam quaerat, excepturi facilis eos deserunt rerum, eligendi
                reiciendis velit inventore dolore. Quos!
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.feature}>
              <img src={feature3} className={classes.image} alt="Hero" />
              <Typography component="h2" variant="h2" gutterBottom>
                <Assessment fontSize="large" className={classes.icon} /> Feature
              </Typography>
              <Typography>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                quia aspernatur non fugit consequuntur quidem modi eveniet
                veniam quaerat, excepturi facilis eos deserunt rerum, eligendi
                reiciendis velit inventore dolore. Quos!
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* pricing */}
        <Grid component="section" className={classes.section}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            gutterBottom
            id="pricing"
            className={classes.anchor}
          >
            Pricing to suit your needs
          </Typography>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} sm={6}>
              <Typography component="p" variant="subtitle2" align="center">
                Get started with a 14 day free trial.
              </Typography>
              <Typography component="p" variant="subtitle2" align="center">
                When you need more projects you can easily upgrade to a plan
                that suits your needs.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

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
                        component={NavLink}
                        to="/dashboard"
                        variant={tier.buttonVariant}
                        color="primary"
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
        </Grid >

        {/* FAQ */}
        <Grid component="section" className={classes.section}>
          <Typography component="h2" variant="h2" align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
        </Grid>
        <Grid
          container
          component="section"
          className={classes.section}
          spacing={6}
        >
          <Grid item xs={12} sm={6} md={6}>
            <Typography component="h3" variant="h3" gutterBottom>
              Question from users
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum,
              pariatur. Doloremque, earum cupiditate. Architecto quasi
              doloremque nostrum enim nesciunt illo quaerat accusantium sit
              provident, omnis nam facilis, ab laudantium consectetur.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography component="h3" variant="h3" gutterBottom>
              Question from users
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum,
              pariatur. Doloremque, earum cupiditate. Architecto quasi
              doloremque nostrum enim nesciunt illo quaerat accusantium sit
              provident, omnis nam facilis, ab laudantium consectetur.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography component="h3" variant="h3" gutterBottom>
              Question from users
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum,
              pariatur. Doloremque, earum cupiditate. Architecto quasi
              doloremque nostrum enim nesciunt illo quaerat accusantium sit
              provident, omnis nam facilis, ab laudantium consectetur.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography component="h3" variant="h3" gutterBottom>
              Question from users
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum,
              pariatur. Doloremque, earum cupiditate. Architecto quasi
              doloremque nostrum enim nesciunt illo quaerat accusantium sit
              provident, omnis nam facilis, ab laudantium consectetur.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography component="h3" variant="h3" gutterBottom>
              Question from users
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum,
              pariatur. Doloremque, earum cupiditate. Architecto quasi
              doloremque nostrum enim nesciunt illo quaerat accusantium sit
              provident, omnis nam facilis, ab laudantium consectetur.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography component="h3" variant="h3" gutterBottom>
              Question from users
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum,
              pariatur. Doloremque, earum cupiditate. Architecto quasi
              doloremque nostrum enim nesciunt illo quaerat accusantium sit
              provident, omnis nam facilis, ab laudantium consectetur.
            </Typography>
          </Grid>
        </Grid>

        {/* CTA */}
        <Grid
          container
          component="section"
          className={classes.section}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Typography component="h2" variant="h1" align="center" gutterBottom>
            Try free for 14 days
          </Typography>
          <Button
            component={NavLink}
            to="/signin"
            size="large"
            color="primary"
            variant="contained"
          >
            Get Started
          </Button>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default LandingPage;
