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
  ListItemIcon,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Timeline as TimelineIcon,
  AccountCircle as AccountIcon
} from "@material-ui/icons";
import { CookieNotification } from "../cookie-notification";
import { pluginRegistry, PLUGIN_TYPES } from "../../registry/plugin-registry";
import { noAppName } from '../../utils/error-messages'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    color: theme.palette.text.primary,
    fontWeight: 400,
    fontSize: "18px",
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

const DashboardNavBar = ({ signOut, handleDrawerToggle }) => {
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

  const menuItemPlugins = pluginRegistry.getPluginsByType(PLUGIN_TYPES.LINK_POPOVER)

  menuItemPlugins.unshift({
    path: "/account",
    menuIcon: AccountIcon,
    text: 'Account'
  })

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

  const app = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.app
  const name = app?.name || 'Default name';

  if (!app?.name) {
    console.error(noAppName)
  }

  return (
    <>
      <CookieNotification />
      <AppBar
        className={classes.appBar}
        color="inherit"
      >
        <Toolbar>
          <Hidden mdUp>
            {/* burger menu for sidebar */}
            <IconButton edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Hidden>

          <Link
            component={NavLink}
            to="/dashboard"
            onClick={() => window.scrollTo(0, 0)}
            className={classes.title}
            underline="none"
          >
            <TimelineIcon className={classes.icon} /> {name}
          </Link>

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
                {menuItems(menuItemPlugins)}
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
