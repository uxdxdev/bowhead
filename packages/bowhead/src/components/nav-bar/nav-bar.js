import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { signOut } from "../../actions/authActions";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  Toolbar,
  IconButton,
  ListItem,
  SwipeableDrawer,
  Link,
  Hidden,
  List,
} from "@material-ui/core";
import { Menu as MenuIcon, Timeline as TimelineIcon } from "@material-ui/icons";
import { CookieNotification } from "../cookie-notification";
import { pluginRegistry, PLUGIN_TYPES } from "../../registry/plugin-registry";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "row-reverse",
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: 400,
    fontSize: "18px",
  },
  link: {
    color: theme.palette.text.primary,
    marginRight: theme.spacing(2),
  },
  icon: {
    verticalAlign: "text-top",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));


const NavBar = ({ uid, signOut }) => {
  const classes = useStyles();

  // side drawer on landing page
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const app = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.app
  const name = app?.name || 'Default name';

  const linksConfig = pluginRegistry.getPluginsByType(PLUGIN_TYPES.LINK_LANDING_PAGE_NAV)

  const getLinks = (config) => {
    return config.map((link, index) => (
      <Link
        key={index}
        href={`${link.path}`} className={classes.link}>
        {link.labelText}
      </Link>
    ))
  }

  const landingPageLinks = linksConfig && linksConfig.length > 0 && getLinks(linksConfig);

  return (
    <>
      <CookieNotification />
      <AppBar color="inherit">
        <Toolbar className={classes.toolbar}>
          <Hidden smUp>
            {uid ? (
              <>
                <Button
                  component={NavLink}
                  to="/dashboard"
                  color="primary"
                  variant="contained"
                  size="small"
                >
                  Dashboard
                </Button>
                <Link
                  component={NavLink}
                  to="/signin"
                  onClick={signOut}
                  className={classes.link}
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Button
                  component={NavLink}
                  to="/signin"
                  color="primary"
                  variant="contained"
                  size="small"
                >
                  Get Started
                  </Button>

                <Button
                  component={NavLink}
                  to="/signin"
                  color="primary"
                  variant="outlined"
                  className={classes.link}
                  size="small"
                >
                  Sign In
                </Button>
              </>
            )}
          </Hidden>

          <Link
            component={NavLink}
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className={`${classes.link} ${classes.title}`}
            underline="none"
          >
            <TimelineIcon className={classes.icon} /> {name}
          </Link>


          <Hidden xsDown>
            <nav>
              {uid ? (
                <>
                  <Link
                    component={NavLink}
                    to="/signin"
                    onClick={signOut}
                    className={classes.link}
                  >
                    Sign out
                  </Link>
                  <Button
                    component={NavLink}
                    to="/dashboard"
                    color="primary"
                    variant="contained"
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  {landingPageLinks || null}
                  <Button
                    component={NavLink}
                    to="/signin"
                    color="primary"
                    variant="outlined"
                    className={classes.link}
                  >
                    Sign In
                    </Button>
                  <Button
                    component={NavLink}
                    to="/signin"
                    color="primary"
                    variant="contained"
                  >
                    Get Started
                    </Button>
                </>
              )}
            </nav>
          </Hidden>

          <Hidden smUp>
            <IconButton onClick={handleDrawerToggle} edge="start">
              <MenuIcon />
            </IconButton>
          </Hidden>

          <SwipeableDrawer
            open={drawerOpen}
            onClose={handleDrawerToggle}
            onOpen={handleDrawerToggle}
            anchor="left"
          >
            <List
              role="presentation"
              onClick={handleDrawerToggle}
              onKeyDown={handleDrawerToggle}
              disablePadding
            >
              {uid ? (
                <>
                  <ListItem>
                    <Button
                      component={NavLink}
                      to="/dashboard"
                      color="primary"
                      variant="contained"
                      size="small"
                    >
                      Dashboard
                      </Button>
                  </ListItem>
                  <ListItem>
                    <Link
                      component={NavLink}
                      to="/signin"
                      onClick={signOut}
                      className={classes.link}
                    >
                      Sign out
                      </Link>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem>
                    <Link href="#features" className={classes.link}>
                      Features
                      </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="#pricing" className={classes.link}>
                      Pricing
                      </Link>
                  </ListItem>
                  <ListItem>
                    <Button
                      component={NavLink}
                      to="/signin"
                      color="primary"
                      variant="outlined"
                      className={classes.link}
                    >
                      Sign In
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      component={NavLink}
                      to="/signin"
                      color="primary"
                      variant="contained"
                    >
                      Get Started
                    </Button>
                  </ListItem>
                </>
              )}
            </List>
          </SwipeableDrawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

const mapStateToProps = ({ firebase: { auth: { uid } } }) => {
  return {
    uid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
