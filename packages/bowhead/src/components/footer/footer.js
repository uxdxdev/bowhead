import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Link, Typography, Container, Grid, Box } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  footer: {
    margin: theme.spacing(2, 0, 2, 0)
  },
  link: {
    color: theme.palette.text.primary,
    margin: theme.spacing(0, 1, 0, 1)
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Container component="footer">
      <Grid
        container
        component="section"
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <Box className={classes.footer}>
            <Typography align="center">
              <Link component={NavLink} to="/terms" className={classes.link}>
                Privacy & Terms
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
