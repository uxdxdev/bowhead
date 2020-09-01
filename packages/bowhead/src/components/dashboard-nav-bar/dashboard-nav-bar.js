import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { signOut } from "../../actions/authActions";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Link,
  Avatar,
  MenuItem,
  Menu,
  IconButton,
  ListItemText,
  Hidden,
  Typography,
  ListItemIcon,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Timeline as TimelineIcon,
} from "@material-ui/icons";
import { CookieNotification } from "../cookie-notification";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: theme.mixins.toolbar,
  listItem: {
    color: theme.palette.text.primary,
  },
  navigation: {
    marginLeft: "auto",
  },
  listItemIcon: {
    minWidth: theme.spacing(4),
  },
  icon: {
    verticalAlign: "text-top",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

const DashboardNavBar = ({ signOut, handleDrawerToggle, popoverMenuItems }) => {
  const classes = useStyles();

  // dropdown settings menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const menuItemConfig = [
    {
      path: "/account",
      menuIcon: SettingsIcon,
      text: 'Account'
    },
    ...popoverMenuItems
  ]

  const menuItems = (config) => {

    return config && config.map((item, index) => {
      if (!item) return null;

      const path = item?.path;
      const onClick = item?.onClick;
      const Icon = item?.menuIcon;
      const text = item?.text;
      return (
        <MenuItem
          key={index}
          component={NavLink}
          to={`/dashboard${path}`}
          onClick={onClick}
          color="textPrimary"
          underline="none"
        >
          <ListItemIcon className={classes.listItemIcon}>
            {Icon && <Icon /> || null}
          </ListItemIcon>
          <ListItemText>{text}</ListItemText>
        </MenuItem>
      )
    })
  }



  return (
    <>
      <CookieNotification />
      <AppBar
        position="fixed"
        elevation={0}
        className={classes.appBar}
        variant="outlined"
        color="inherit"
      >
        <Toolbar>
          <Hidden mdUp>
            {/* burger menu for sidebar */}
            <IconButton edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Hidden>

          <Typography
            component="span"
            variant="h6"
            color="textPrimary"
            className={classes.toolbarTitle}
          >
            {/* logo link. when clicked scroll to top of the window && if authenticated navigate to /dashboard else / */}
            <Link
              component={NavLink}
              to="/dashboard"
              // allow users to jump to the top of the page
              onClick={() => window.scrollTo(0, 0)}
              className={classes.listItem}
              underline="none"
            >
              <TimelineIcon className={classes.icon} /> Bowhead
            </Link>
          </Typography>

          <nav className={classes.navigation}>
            {/* popover triggered when avatar image clicked */}
            <Avatar className={classes.avatar} onClick={handleMenuOpen} />

            {/* popover position https://material-ui.com/components/popover/#anchor-playground */}
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              id="appbar-menu"
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={isMenuOpen}
              onClose={handleMenuClose}
              getContentAnchorEl={null}
              MenuListProps={{ disablePadding: true }}
            >
              <div
                role="presentation"
                onClick={handleMenuClose}
                onKeyDown={handleMenuClose}
              >
                {menuItems(menuItemConfig)}
                <MenuItem
                  component={NavLink}
                  to="/signin"
                  onClick={signOut}
                  color="textPrimary"
                  underline="none"
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText>Sign out</ListItemText>
                </MenuItem>
              </div>
            </Menu>
          </nav>
        </Toolbar>
      </AppBar>


    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(null, mapDispatchToProps)(DashboardNavBar);
