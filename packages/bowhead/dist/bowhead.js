import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, CircularProgress, Typography, Paper, Button, Collapse, List, ListItem, ListItemIcon, ListItemText, Snackbar, Grid, Card, CardHeader, CardContent, AppBar, Toolbar, Hidden, IconButton, Link, Avatar, Menu as Menu$1, MenuItem, Drawer, SwipeableDrawer, Container, Breadcrumbs, TextField, CssBaseline } from '@material-ui/core';
import { useHistory, Redirect, Route, NavLink, Switch, Link as Link$1, BrowserRouter } from 'react-router-dom';
import { EmailOutlined, ExpandMore, ExpandLess, Star, AccountCircle, Menu, Timeline, ExitToApp, Dashboard as Dashboard$1 } from '@material-ui/icons';
import moment from 'moment';
import { connect, useSelector, useDispatch, Provider } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { useCookies } from 'react-cookie';
import { createSlice, getDefaultMiddleware, configureStore } from '@reduxjs/toolkit';
import { isLoaded, useFirestoreConnect, ReactReduxFirebaseProvider, actionTypes, firebaseReducer } from 'react-redux-firebase';
import { constants, reduxFirestore, createFirestoreInstance, firestoreReducer } from 'redux-firestore';
import { combineReducers } from 'redux';

var FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  STRIPE: 'stripe'
};
var STRIPE_SUBSCRIPTION_STATUS = {
  TRIALING: 'trialing',
  ACTIVE: 'active',
  CANCELLED: 'cancelled'
};

var ButtonLoadingSpinner = function ButtonLoadingSpinner() {
  return /*#__PURE__*/React.createElement(Box, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ml: 2
  }, /*#__PURE__*/React.createElement(CircularProgress, {
    size: 24
  }));
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var ButtonBox = function ButtonBox(_ref) {
  var children = _ref.children,
      rest = _objectWithoutPropertiesLoose(_ref, ["children"]);

  return /*#__PURE__*/React.createElement(Box, _extends({
    display: "flex",
    alignItems: "center",
    mt: 1
  }, rest), children);
};

var PageLoadingSpinner = function PageLoadingSpinner() {
  return /*#__PURE__*/React.createElement(Box, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh"
  }, /*#__PURE__*/React.createElement(CircularProgress, null));
};

var CheckEmail = function CheckEmail() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
    align: "center"
  }, /*#__PURE__*/React.createElement(EmailOutlined, {
    style: {
      fontSize: 100
    }
  })), /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h1",
    gutterBottom: true,
    align: "center"
  }, "Check your inbox."), /*#__PURE__*/React.createElement(Typography, {
    align: "center"
  }, "We just emailed a confirmation link to you."), /*#__PURE__*/React.createElement(Typography, {
    align: "center"
  }, "Clicking the link will sign you in."));
};

var Details = function Details(_ref) {
  var email = _ref.email,
      createdAt = _ref.createdAt,
      lastLoginAt = _ref.lastLoginAt;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
    component: "h2",
    variant: "h6"
  }, "Email"), /*#__PURE__*/React.createElement(Typography, null, email), /*#__PURE__*/React.createElement(Typography, {
    component: "h2",
    variant: "h6"
  }, "Cake Day"), /*#__PURE__*/React.createElement(Typography, null, moment(createdAt, "x").format("LL")), /*#__PURE__*/React.createElement(Typography, {
    component: "h2",
    variant: "h6"
  }, "Last Login"), /*#__PURE__*/React.createElement(Typography, null, moment(lastLoginAt, "x").format("LLLL")));
};

var mapStateToProps = function mapStateToProps(state) {
  var _state$firebase$auth = state.firebase.auth,
      email = _state$firebase$auth.email,
      createdAt = _state$firebase$auth.createdAt,
      lastLoginAt = _state$firebase$auth.lastLoginAt;
  return {
    email: email,
    createdAt: createdAt,
    lastLoginAt: lastLoginAt
  };
};

var Details$1 = connect(mapStateToProps)(Details);

var useStyles = makeStyles(function (theme) {
  return {
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    button: {
      marginRight: theme.spacing(1)
    },
    subscriptionStatus: {
      textTransform: 'capitalize'
    }
  };
});

var PLUGIN_TYPES = {
  ROUTE_UNAUTHENTICATED: 'plugin-type-route-unauthenticated',
  ROUTE_AUTHENTICATED: 'plugin-type-route-authenticated',
  LINK_POPOVER: 'plugin-type-link-popover',
  LINK_SIDEBAR: 'plugin-type-link-sidebar',
  LINK_LANDING_PAGE_NAV: 'plugin-type-link-landing-page',
  LINK_DASHBOARD_PAGE_NAV: 'plugin-type-link-dashboard',
  REDUCER: 'plugin-type-reducer',
  THEME: 'plugin-type-theme',
  LISTENER_FIRESTORE: 'plugin-type-listener-firestore',
  CONFIGURATION_BOWHEAD: 'plugin-type-configuration-bowhead',
  CUSTOM: 'plugin-type-custom'
};

var PluginRegistry = /*#__PURE__*/function () {
  function PluginRegistry() {
    this.plugins = {};
    this.listeners = [];
  }

  var _proto = PluginRegistry.prototype;

  _proto.getPluginsByType = function getPluginsByType(type) {
    return Object.values(this.plugins).filter(function (plugin) {
      return plugin.type === type;
    });
  };

  _proto.register = function register(name, plugin) {
    if (!name || !plugin) {
      console.error("All plugins must have a unique name and plugin configuration. Name: " + name, plugin);
      return;
    }

    if (!plugin.type || !Object.values(PLUGIN_TYPES).includes(plugin.type)) {
      console.error("Plugin configurations must be one of pluginRegistry.PLUGIN_TYPES. Name: " + name, plugin);
      return;
    }

    this.plugins[plugin.type + "-" + name] = plugin;

    if (this.listeners.length > 0) {
      var plugins = Object.values(this.plugins);
      this.listeners.forEach(function (listener) {
        return listener(plugins);
      });
    }
  };

  _proto.setChangeListener = function setChangeListener(listener) {
    this.listeners.push(listener);
  };

  _proto.removeChangeListener = function removeChangeListener(listener) {
    var index = this.listeners.indexOf(listener);

    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  };

  return PluginRegistry;
}();

var pluginRegistry = new PluginRegistry();

var getFirebase = function getFirebase() {
  var _pluginRegistry$getPl, _pluginRegistry$getPl2;

  var firebase = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.firebase;
  return firebase;
};

var getFirestore = function getFirestore() {
  var _pluginRegistry$getPl3, _pluginRegistry$getPl4;

  var firestore = (_pluginRegistry$getPl3 = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl4 = _pluginRegistry$getPl3.config) == null ? void 0 : _pluginRegistry$getPl4.firestore;
  return firestore;
};

var getToken = function getToken() {
  var firebase = getFirebase();
  return firebase.auth().currentUser.getIdToken();
};

var stripe = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

var getStripe = function getStripe() {
  return stripe;
};

var getStipeCustomerId = function getStipeCustomerId() {
  try {
    var uid = getFirebase().auth().currentUser.uid;
    var userDataRef = getFirestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(uid);
    return Promise.resolve(userDataRef.get()).then(function (userDataDoc) {
      var userData = userDataDoc.data();
      return userData.stripeCustomerId;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var deleteStripeCustomer = function deleteStripeCustomer() {
  try {
    var _pluginRegistry$getPl, _pluginRegistry$getPl2;

    var api = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.api;

    if (!api || !api.deleteStripeCustomer) {
      console.error("deleteStripeCustomer API does not exist in bowhead configuration. Plugin: " + PLUGIN_TYPES.CONFIGURATION_BOWHEAD);
    }

    return Promise.resolve(getToken()).then(function (token) {
      return Promise.resolve(getStipeCustomerId()).then(function (stripeCustomerId) {
        return fetch(api.deleteStripeCustomer + "?token=" + token, {
          method: 'POST',
          body: JSON.stringify({
            stripeCustomerId: stripeCustomerId
          })
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var createStripeCustomerPortalSession = function createStripeCustomerPortalSession() {
  try {
    var _pluginRegistry$getPl3, _pluginRegistry$getPl4;

    var api = (_pluginRegistry$getPl3 = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl4 = _pluginRegistry$getPl3.config) == null ? void 0 : _pluginRegistry$getPl4.api;

    if (!api || !api.createStripeCustomerPortalSession) {
      console.error("createStripeCustomerPortalSession API does not exist in bowhead configuration.Plugin: " + PLUGIN_TYPES.CONFIGURATION_BOWHEAD);
    }

    return Promise.resolve(getToken()).then(function (token) {
      return Promise.resolve(getStipeCustomerId()).then(function (stripeCustomerId) {
        return fetch(api.createStripeCustomerPortalSession + "?token=" + token, {
          method: 'POST',
          body: JSON.stringify({
            customer: stripeCustomerId
          })
        }).then(function (response) {
          return response.json();
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var createStripeCheckoutSession = function createStripeCheckoutSession(_ref) {
  var priceId = _ref.priceId,
      successUrl = _ref.successUrl,
      cancelUrl = _ref.cancelUrl,
      email = _ref.email,
      uid = _ref.uid;

  try {
    var _pluginRegistry$getPl5, _pluginRegistry$getPl6;

    var api = (_pluginRegistry$getPl5 = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl6 = _pluginRegistry$getPl5.config) == null ? void 0 : _pluginRegistry$getPl6.api;

    if (!api || !api.createStripeCheckoutSession) {
      console.error("createStripeCheckoutSession API does not exist in bowhead configuration.Plugin: " + PLUGIN_TYPES.CONFIGURATION_BOWHEAD);
      return Promise.resolve();
    }

    return Promise.resolve(getToken()).then(function (token) {
      return Promise.resolve(getStipeCustomerId()).then(function (stripeCustomerId) {
        return fetch(api.createStripeCheckoutSession + "?token=" + token, {
          method: 'POST',
          body: JSON.stringify(_extends({}, stripeCustomerId && {
            customer: stripeCustomerId
          }, {
            payment_method_types: ['card'],
            line_items: [{
              price: priceId,
              quantity: 1
            }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl
          }, !stripeCustomerId && {
            customer_email: email
          }, {
            client_reference_id: uid,
            subscription_data: {
              trial_period_days: '14'
            }
          }))
        }).then(function (response) {
          return response.json();
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var Billing = function Billing(_ref) {
  var planTitle = _ref.planTitle,
      status = _ref.status,
      isSubscribed = _ref.isSubscribed;

  var _useStyles = useStyles(),
      paper = _useStyles.paper,
      button = _useStyles.button,
      subscriptionStatus = _useStyles.subscriptionStatus;

  var history = useHistory();

  var _useState = useState(false),
      isRedirectingToStripeCustomerPortal = _useState[0],
      setIsRedirectingToStripeCustomerPortal = _useState[1]; // redirect the user to the Stripe customer portal


  var handleCreateSessionOpenPortal = function handleCreateSessionOpenPortal() {
    try {
      setIsRedirectingToStripeCustomerPortal(true);
      return Promise.resolve(createStripeCustomerPortalSession()["catch"](function () {
        setIsRedirectingToStripeCustomerPortal(false);
      })).then(function (data) {
        // redirect use to stripe portal
        var url = data.url || null;

        if (url) {
          window.location.replace(url);
        } else {
          // something went wrong to let the user try again
          setIsRedirectingToStripeCustomerPortal(false);
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return /*#__PURE__*/React.createElement(Paper, {
    className: paper,
    variant: "outlined"
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h2",
    variant: "h6"
  }, "Subscription"), /*#__PURE__*/React.createElement(Typography, null, planTitle || 'Not subscribed to any plan yet.'), status && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
    component: "h2",
    variant: "h6"
  }, "Status"), /*#__PURE__*/React.createElement(Typography, {
    className: subscriptionStatus
  }, status)), /*#__PURE__*/React.createElement(ButtonBox, null, isSubscribed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    variant: "contained",
    className: button,
    onClick: function onClick() {
      return handleCreateSessionOpenPortal();
    },
    disabled: isRedirectingToStripeCustomerPortal
  }, "Manage subscription"), isRedirectingToStripeCustomerPortal && /*#__PURE__*/React.createElement(ButtonLoadingSpinner, null)) : /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    variant: "contained",
    className: button,
    onClick: function onClick() {
      return history.push('/dashboard');
    },
    disabled: isRedirectingToStripeCustomerPortal
  }, "Subscribe now")));
};

var mapStateToProps$1 = function mapStateToProps(state) {
  var _pluginRegistry$getPl, _pluginRegistry$getPl2, _plans$filter$;

  var stripeCustomerId = state.firebase.profile.stripeCustomerId,
      stripe = state.firestore.data.stripe;
  var stripeData = stripe && stripe[stripeCustomerId];
  var planId = stripeData == null ? void 0 : stripeData.planId;
  var status = stripeData == null ? void 0 : stripeData.status;
  var isSubscribed = (stripeData == null ? void 0 : stripeData.status) === STRIPE_SUBSCRIPTION_STATUS.TRIALING || (stripeData == null ? void 0 : stripeData.status) === STRIPE_SUBSCRIPTION_STATUS.ACTIVE;
  var plans = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.plans;
  var planTitle = (_plans$filter$ = plans.filter(function (plan) {
    return plan.priceId === planId;
  })[0]) == null ? void 0 : _plans$filter$.title;
  return {
    planTitle: planTitle,
    status: status,
    isSubscribed: isSubscribed
  };
};

var Billing$1 = connect(mapStateToProps$1)(Billing);

var useStyles$1 = makeStyles(function (theme) {
  return {
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  };
});

var useAccount = function useAccount() {
  var state = useSelector(function (state) {
    return state;
  });
  var stripeCustomerId = state.firebase.profile.stripeCustomerId,
      requested = state.firestore.status.requested;
  var isRequestedStripeCustomer = requested[FIRESTORE_COLLECTIONS.STRIPE + "/" + stripeCustomerId];
  var isLoading = isRequestedStripeCustomer && !(isRequestedStripeCustomer === true);
  return {
    isLoading: isLoading
  };
};

var Account = function Account() {
  var _useStyles = useStyles$1(),
      paper = _useStyles.paper;

  var _useAccount = useAccount(),
      isLoading = _useAccount.isLoading;

  return isLoading ? /*#__PURE__*/React.createElement(PageLoadingSpinner, null) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Paper, {
    className: paper,
    variant: "outlined"
  }, /*#__PURE__*/React.createElement(Details$1, null)), /*#__PURE__*/React.createElement(Billing$1, null));
};

var AuthenticatedRoute = function AuthenticatedRoute(_ref) {
  var isAuthenticated = _ref.isAuthenticated,
      rest = _objectWithoutPropertiesLoose(_ref, ["isAuthenticated"]);

  if (!isAuthenticated) {
    return /*#__PURE__*/React.createElement(Redirect, {
      to: "/signin"
    });
  }

  return /*#__PURE__*/React.createElement(Route, rest);
};

var mapStateToProps$2 = function mapStateToProps(state) {
  var uid = state.firebase.auth.uid;
  var isAuthenticated = !!uid;
  return {
    isAuthenticated: isAuthenticated
  };
};

var AuthenticatedRoute$1 = connect(mapStateToProps$2)(AuthenticatedRoute);

var useStyles$2 = makeStyles(function (theme) {
  return {
    listItem: {
      color: theme.palette.text.primary
    },
    listItemIcon: {
      minWidth: theme.spacing(4)
    }
  };
});

var SidebarMenuItem = function SidebarMenuItem(props) {
  var text = props.text,
      path = props.path,
      menuIcon = props.menuIcon,
      _props$items = props.items,
      items = _props$items === void 0 ? [] : _props$items,
      onClick = props.onClick,
      handleDrawerToggle = props.handleDrawerToggle,
      setActiveMenuItem = props.setActiveMenuItem,
      activeMenuItem = props.activeMenuItem,
      isDefaultOpen = props.isDefaultOpen;
  var classes = useStyles$2();
  var isExpandable = items && items.length > 0;

  var _React$useState = React.useState(isDefaultOpen),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  function handleClick() {
    if (!isExpandable) {
      handleDrawerToggle();
      setActiveMenuItem(text);
      onClick && onClick();
    } else {
      setOpen(!open);
    }
  }

  var Icon = menuIcon && menuIcon;
  var MenuItemRoot = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ListItem, {
    key: path,
    button: true,
    component: path ? NavLink : null,
    to: !isExpandable && path ? "/dashboard" + path : '#',
    className: classes.listItem,
    style: {
      backgroundColor: activeMenuItem === text && "rgba(0, 0, 0, 0.04)"
    },
    underline: "none",
    onClick: handleClick
  }, /*#__PURE__*/React.createElement(ListItemIcon, {
    className: classes.listItemIcon
  }, Icon ? /*#__PURE__*/React.createElement(Icon, null) : null), /*#__PURE__*/React.createElement(ListItemText, null, text), isExpandable && !open && /*#__PURE__*/React.createElement(ExpandMore, null), isExpandable && open && /*#__PURE__*/React.createElement(ExpandLess, null)));
  var MenuItemChildren = isExpandable ? /*#__PURE__*/React.createElement(Collapse, {
    "in": open,
    timeout: "auto",
    unmountOnExit: true
  }, /*#__PURE__*/React.createElement(List, {
    component: "div",
    disablePadding: true
  }, items.map(function (item, index) {
    return /*#__PURE__*/React.createElement(SidebarMenuItem, _extends({}, item, {
      key: index,
      activeMenuItem: activeMenuItem,
      setActiveMenuItem: setActiveMenuItem,
      handleDrawerToggle: handleDrawerToggle
    }));
  }))) : null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, MenuItemRoot, MenuItemChildren);
};

var CookieNotification = function CookieNotification() {
  var _useCookies = useCookies(["cookie_consent"]),
      cookies = _useCookies[0],
      setCookie = _useCookies[1];

  var cookie_consent = cookies.cookie_consent;
  return /*#__PURE__*/React.createElement(Snackbar, {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center"
    },
    open: !cookie_consent,
    message: "We use cookies to give you the best experience on our website. If you continue to use this site we will assume that you are happy with it.",
    action: /*#__PURE__*/React.createElement(Button, {
      color: "primary",
      variant: "contained",
      size: "small",
      onClick: function onClick() {
        return setCookie("cookie_consent", true);
      }
    }, "Hide")
  });
};

var useStyles$3 = makeStyles(function (theme) {
  return {
    section: {
      alignItems: "center",
      justifyContent: "center",
      '& .MuiCardContent-root > ul': {
        margin: 0,
        padding: 0,
        listStyle: "none"
      }
    },
    cardPricing: {
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      marginBottom: theme.spacing(2)
    }
  };
});

var Pricing = function Pricing(_ref) {
  var _pluginRegistry$getPl, _pluginRegistry$getPl2, _pluginRegistry$getPl3, _pluginRegistry$getPl4;

  var uid = _ref.uid,
      email = _ref.email;
  var classes = useStyles$3();

  var _useState = useState(false),
      isRedirecting = _useState[0],
      setIsRedirecting = _useState[1];

  var app = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.app;
  var dashboardUrl = process.env.NODE_ENV === "development" ? "http://localhost:8888/dashboard" : app.productionUrl + "/dashboard";

  var handleRedirectToStripe = function handleRedirectToStripe(priceId) {
    try {
      setIsRedirecting(true);
      return Promise.resolve(createStripeCheckoutSession({
        priceId: priceId,
        successUrl: dashboardUrl,
        cancelUrl: dashboardUrl,
        email: email,
        uid: uid
      })["catch"](function () {
        setIsRedirecting(false);
      })).then(function (data) {
        var _temp = function () {
          if (data && data.id) {
            return Promise.resolve(getStripe()).then(function (stripe) {
              stripe.redirectToCheckout({
                sessionId: data.id
              })["catch"](function (error) {
                console.log(error);
              });
            });
          } else {
            setIsRedirecting(false);
          }
        }();

        if (_temp && _temp.then) return _temp.then(function () {});
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var plans = (_pluginRegistry$getPl3 = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl4 = _pluginRegistry$getPl3.config) == null ? void 0 : _pluginRegistry$getPl4.plans;
  return /*#__PURE__*/React.createElement(Grid, {
    container: true,
    component: "section",
    className: classes.section,
    alignItems: "flex-end",
    spacing: 6
  }, // only use the first 3 entires in the plans array
  plans.slice(0, 3).map(function (tier, index) {
    return (
      /*#__PURE__*/
      // Enterprise card is full width at sm breakpoint
      React.createElement(Grid, {
        item: true,
        key: tier.title,
        xs: 12,
        sm: tier.title === "Enterprise" ? 12 : 6,
        md: 4
      }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
        title: tier.title,
        subheader: tier.subheader,
        titleTypographyProps: {
          align: "center"
        },
        subheaderTypographyProps: {
          align: "center"
        },
        action: tier.title === "Pro" ? /*#__PURE__*/React.createElement(Star, null) : null
      }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
        className: classes.cardPricing
      }, /*#__PURE__*/React.createElement(Typography, {
        component: "h2",
        variant: "h2"
      }, "\u20AC", tier.price), /*#__PURE__*/React.createElement(Typography, null, "/ month")), /*#__PURE__*/React.createElement("div", {
        className: classes.cardPricing
      }, /*#__PURE__*/React.createElement(Button, {
        onClick: function onClick() {
          return handleRedirectToStripe(tier.priceId);
        },
        variant: index % 2 ? "contained" : "outlined",
        color: "primary",
        disabled: isRedirecting
      }, "Get started")), /*#__PURE__*/React.createElement("ul", null, tier.featureList.map(function (line) {
        return /*#__PURE__*/React.createElement(Typography, {
          component: "li",
          align: "center",
          key: line
        }, line);
      })))))
    );
  }));
};

var mapStateToProps$3 = function mapStateToProps(state) {
  var _state$firebase$auth = state.firebase.auth,
      uid = _state$firebase$auth.uid,
      email = _state$firebase$auth.email;
  return {
    uid: uid,
    email: email
  };
};

var Pricing$1 = connect(mapStateToProps$3)(Pricing);

var signOut = function signOut() {
  return getFirebase().auth().signOut();
};
/**
 * Sends sign in email and appends ref and data to URL.
 * 
 * @param {*} args.email users email address
 * @param {*} args.ref reference for email authentication
 * @param {*} args.data object with key/value pairs for URL params 
 */

var sendSignInEmail = function sendSignInEmail(_ref) {
  var _pluginRegistry$getPl, _pluginRegistry$getPl2;

  var email = _ref.email,
      data = _ref.data;
  var app = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.app;
  var urlStr = process.env.NODE_ENV === "development" ? "http://localhost:8888/verify" : app.productionUrl + "/verify";
  var url = new URL(urlStr);
  data && Object.keys(data).forEach(function (key) {
    url.searchParams.append(key, data[key]);
  });
  return getFirebase().auth().sendSignInLinkToEmail(email, {
    url: url.href,
    handleCodeInApp: true
  });
};
var signInWithEmailLink = function signInWithEmailLink(_ref2) {
  var email = _ref2.email,
      location = _ref2.location;
  return getFirebase().auth().signInWithEmailLink(email, location);
};
var isSignInWithEmailLink = function isSignInWithEmailLink(_ref3) {
  var location = _ref3.location;
  return getFirebase().auth().isSignInWithEmailLink(location);
};
var verifyUserSignInUpdate = function verifyUserSignInUpdate(_ref4) {
  var uid = _ref4.uid,
      email = _ref4.email;
  return getFirestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(uid).set({
    email: email
  }, {
    merge: true
  });
};
var updateUserProfile = function updateUserProfile(data) {
  try {
    var uid = getFirebase().auth().currentUser.uid;
    return Promise.resolve(getFirestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(uid).set(data, {
      merge: true
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var deleteUserProfile = function deleteUserProfile() {
  try {
    var uid = getFirebase().auth().currentUser.uid;
    var userDataRef = getFirestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(uid);
    return Promise.resolve(getStipeCustomerId()).then(function (stripeCustomerId) {
      var batch = getFirestore().batch();

      if (stripeCustomerId) {
        // delete stripe customer data
        var stripeCustomerDataRef = getFirestore().collection(FIRESTORE_COLLECTIONS.STRIPE).doc(stripeCustomerId);
        batch["delete"](stripeCustomerDataRef);
      } // user data


      batch["delete"](userDataRef);
      return batch.commit();
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var bowheadSlice = createSlice({
  name: 'bowhead',
  initialState: {},
  reducers: {
    sendEmailLink: function sendEmailLink(state) {
      return _extends({}, state, {
        isSendingEmailLink: true,
        isEmailLinkSent: false,
        sendEmailAuthError: null
      });
    },
    sendEmailLinkSuccess: function sendEmailLinkSuccess(state) {
      return _extends({}, state, {
        isSendingEmailLink: false,
        isEmailLinkSent: true,
        sendEmailAuthError: null
      });
    },
    sendEmailLinkError: function sendEmailLinkError(state, action) {
      return _extends({}, state, {
        isSendingEmailLink: false,
        isEmailLinkSent: false,
        sendEmailAuthError: action.error
      });
    },
    sendEmailLinkReset: function sendEmailLinkReset(state) {
      return _extends({}, state, {
        isSendingEmailLink: false,
        isEmailLinkSent: false,
        sendEmailAuthError: null
      });
    },
    signOut: function signOut(state) {
      return _extends({}, state, {
        isSigningOut: true,
        signOutError: null
      });
    },
    signOutSuccess: function signOutSuccess(state) {
      return _extends({}, state, {
        isSigningOut: false,
        signOutError: null
      });
    },
    signOutError: function signOutError(state, action) {
      return _extends({}, state, {
        isSigningOut: false,
        signOutError: action.error
      });
    },
    verifyUser: function verifyUser(state) {
      return _extends({}, state, {
        isVerifyingUser: true,
        isVerifyingUserError: null,
        isVerified: false
      });
    },
    verifyUserSuccess: function verifyUserSuccess(state) {
      return _extends({}, state, {
        isVerifyingUser: false,
        isVerifyingUserError: null,
        isVerified: true
      });
    },
    verifyUserError: function verifyUserError(state, action) {
      return _extends({}, state, {
        isVerifyingUser: false,
        isVerifyingUserError: action.error,
        isVerified: false
      });
    }
  }
});
var _bowheadSlice$actions = bowheadSlice.actions,
    sendEmailLink = _bowheadSlice$actions.sendEmailLink,
    sendEmailLinkSuccess = _bowheadSlice$actions.sendEmailLinkSuccess,
    sendEmailLinkError = _bowheadSlice$actions.sendEmailLinkError,
    signOut$1 = _bowheadSlice$actions.signOut,
    signOutSuccess = _bowheadSlice$actions.signOutSuccess,
    signOutError = _bowheadSlice$actions.signOutError,
    verifyUser = _bowheadSlice$actions.verifyUser,
    verifyUserSuccess = _bowheadSlice$actions.verifyUserSuccess,
    verifyUserError = _bowheadSlice$actions.verifyUserError;
var bowheadSlice$1 = bowheadSlice.reducer;

var signOut$2 = function signOut$2() {
  return function (dispatch) {
    try {
      dispatch(signOut$1());
      return Promise.resolve(signOut().then(function () {
        dispatch(signOutSuccess());
      })["catch"](function (error) {
        dispatch(signOutError(error));
      })).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
var sendSignInEmailLink = function sendSignInEmailLink(_ref) {
  var email = _ref.email,
      data = _ref.data;
  return function (dispatch) {
    try {
      dispatch(sendEmailLink());
      return Promise.resolve(sendSignInEmail({
        email: email,
        data: data
      }).then(function () {
        window.localStorage.setItem("emailForSignIn", email);
      }).then(function () {
        dispatch(sendEmailLinkSuccess());
      })["catch"](function (error) {
        dispatch(sendEmailLinkError(error));
      })).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
var verifyUser$1 = function verifyUser$1() {
  return function (dispatch) {
    try {
      dispatch(verifyUser());

      var _temp2 = function () {
        if (isSignInWithEmailLink({
          location: window.location.href
        })) {
          var email = window.localStorage.getItem("emailForSignIn");
          window.localStorage.removeItem("emailForSignIn");

          if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email = window.prompt("Please provide your email for confirmation");
          }

          return Promise.resolve(signInWithEmailLink({
            email: email,
            location: window.location.href
          }).then(function (result) {
            try {
              var uid = result.user.uid;
              return Promise.resolve(verifyUserSignInUpdate({
                uid: uid,
                email: email
              }).then(function () {
                dispatch(verifyUserSuccess());
              })["catch"](function (error) {
                dispatch(verifyUserError(error));
              })).then(function () {});
            } catch (e) {
              return Promise.reject(e);
            }
          })["catch"](function (error) {
            dispatch(verifyUserError(error));
          })).then(function () {});
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var useStyles$4 = makeStyles(function (theme) {
  var _icon;

  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    title: {
      color: theme.palette.text.primary,
      fontWeight: 400,
      fontSize: "18px"
    },
    navigation: {
      marginLeft: "auto"
    },
    listItemIcon: {
      minWidth: theme.spacing(4)
    },
    icon: (_icon = {
      verticalAlign: "text-top"
    }, _icon[theme.breakpoints.down("xs")] = {
      display: "none"
    }, _icon)
  };
});

var DashboardNavBar = function DashboardNavBar(_ref) {
  var _pluginRegistry$getPl, _pluginRegistry$getPl2;

  var signOut = _ref.signOut,
      handleDrawerToggle = _ref.handleDrawerToggle;
  var classes = useStyles$4(); // dropdown settings menu

  var _useState = useState(null),
      anchorEl = _useState[0],
      setAnchorEl = _useState[1];

  var isMenuOpen = Boolean(anchorEl);

  var handleMenuClose = function handleMenuClose() {
    setAnchorEl(null);
  };

  var handleMenuOpen = function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  };

  var menuItemPlugins = pluginRegistry.getPluginsByType(PLUGIN_TYPES.LINK_POPOVER);
  menuItemPlugins.unshift({
    path: "/account",
    menuIcon: AccountCircle,
    text: 'Account'
  });

  var menuItems = function menuItems(config) {
    return config && config.map(function (item, index) {
      if (!item) return null;
      var path = item == null ? void 0 : item.path;
      var onClick = item == null ? void 0 : item.onClick;
      var Icon = item == null ? void 0 : item.menuIcon;
      var text = item == null ? void 0 : item.text;
      return /*#__PURE__*/React.createElement(MenuItem, {
        key: index,
        component: NavLink,
        to: "/dashboard" + path,
        onClick: onClick,
        color: "textPrimary",
        underline: "none"
      }, /*#__PURE__*/React.createElement(ListItemIcon, {
        className: classes.listItemIcon
      }, Icon && /*#__PURE__*/React.createElement(Icon, null) || null), /*#__PURE__*/React.createElement(ListItemText, null, text));
    });
  };

  var app = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.app;
  var name = (app == null ? void 0 : app.name) || 'Default name';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CookieNotification, null), /*#__PURE__*/React.createElement(AppBar, {
    className: classes.appBar,
    color: "inherit"
  }, /*#__PURE__*/React.createElement(Toolbar, null, /*#__PURE__*/React.createElement(Hidden, {
    mdUp: true
  }, /*#__PURE__*/React.createElement(IconButton, {
    edge: "start",
    onClick: handleDrawerToggle
  }, /*#__PURE__*/React.createElement(Menu, null))), /*#__PURE__*/React.createElement(Link, {
    component: NavLink,
    to: "/dashboard",
    onClick: function onClick() {
      return window.scrollTo(0, 0);
    },
    className: classes.title,
    underline: "none"
  }, /*#__PURE__*/React.createElement(Timeline, {
    className: classes.icon
  }), " ", name), /*#__PURE__*/React.createElement("nav", {
    className: classes.navigation
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: classes.avatar,
    onClick: handleMenuOpen
  }), /*#__PURE__*/React.createElement(Menu$1, {
    anchorEl: anchorEl,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right"
    },
    id: "appbar-menu",
    keepMounted: true,
    transformOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    open: isMenuOpen,
    onClose: handleMenuClose,
    getContentAnchorEl: null,
    MenuListProps: {
      disablePadding: true
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "presentation",
    onClick: handleMenuClose,
    onKeyDown: handleMenuClose
  }, menuItems(menuItemPlugins), /*#__PURE__*/React.createElement(MenuItem, {
    component: NavLink,
    to: "/signin",
    onClick: signOut,
    color: "textPrimary",
    underline: "none"
  }, /*#__PURE__*/React.createElement(ListItemIcon, {
    className: classes.listItemIcon
  }, /*#__PURE__*/React.createElement(ExitToApp, null)), /*#__PURE__*/React.createElement(ListItemText, null, "Sign out"))))))));
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    signOut: function signOut() {
      return dispatch(signOut$2());
    }
  };
};

var DashboardNavBar$1 = connect(null, mapDispatchToProps)(DashboardNavBar);

var drawerWidth = 240;
var useStyles$5 = makeStyles(function (theme) {
  return {
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: theme.palette.background["default"],
      '& .MuiCollapse-entered': {
        overflow: 'auto'
      }
    }
  };
});

var DashboardNavSidebar = function DashboardNavSidebar(_ref) {
  var handleDrawerToggle = _ref.handleDrawerToggle,
      mobileOpen = _ref.mobileOpen;
  var classes = useStyles$5(); // currently selected menu item 

  var _useState = useState(''),
      activeMenuItem = _useState[0],
      setActiveMenuItem = _useState[1];

  var sidebarMenuItems = pluginRegistry.getPluginsByType(PLUGIN_TYPES.LINK_SIDEBAR);
  sidebarMenuItems.unshift({
    type: PLUGIN_TYPES.LINK_SIDEBAR,
    menuIcon: Dashboard$1,
    text: "Dashboard",
    path: "/"
  });

  var drawer = function drawer() {
    return sidebarMenuItems.map(function (menuItem, index) {
      return menuItem && /*#__PURE__*/React.createElement(SidebarMenuItem, _extends({
        key: index
      }, menuItem, {
        activeMenuItem: activeMenuItem,
        setActiveMenuItem: setActiveMenuItem,
        handleDrawerToggle: handleDrawerToggle
      }));
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hidden, {
    mdUp: true
  }, /*#__PURE__*/React.createElement(Drawer, {
    variant: "temporary",
    anchor: "left",
    open: mobileOpen,
    onClose: handleDrawerToggle,
    classes: {
      paper: classes.drawerPaper
    },
    ModalProps: {
      keepMounted: true // Better open performance on mobile.

    }
  }, drawer())), /*#__PURE__*/React.createElement(Hidden, {
    smDown: true
  }, /*#__PURE__*/React.createElement(Drawer, {
    classes: {
      paper: classes.drawerPaper
    },
    variant: "permanent",
    open: true
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.toolbar
  }), drawer())));
};

var useStyles$6 = makeStyles(function (theme) {
  var _toolbar, _icon;

  return {
    toolbar: (_toolbar = {}, _toolbar[theme.breakpoints.down("xs")] = {
      flexDirection: "row-reverse"
    }, _toolbar),
    title: {
      flexGrow: 1,
      fontWeight: 400,
      fontSize: "18px"
    },
    link: {
      color: theme.palette.text.primary,
      marginRight: theme.spacing(2)
    },
    icon: (_icon = {
      verticalAlign: "text-top"
    }, _icon[theme.breakpoints.down("xs")] = {
      display: "none"
    }, _icon)
  };
});

var NavBar = function NavBar(_ref) {
  var _pluginRegistry$getPl, _pluginRegistry$getPl2;

  var uid = _ref.uid,
      signOut = _ref.signOut;
  var classes = useStyles$6(); // side drawer on landing page

  var _useState = useState(false),
      drawerOpen = _useState[0],
      setDrawerOpen = _useState[1];

  var handleDrawerToggle = function handleDrawerToggle() {
    setDrawerOpen(!drawerOpen);
  };

  var app = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.app;
  var name = (app == null ? void 0 : app.name) || 'Default name';
  var linksConfig = pluginRegistry.getPluginsByType(PLUGIN_TYPES.LINK_LANDING_PAGE_NAV);

  var getLinks = function getLinks(config) {
    return config.map(function (link, index) {
      return /*#__PURE__*/React.createElement(Link, {
        key: index,
        href: "" + link.path,
        className: classes.link
      }, link.labelText);
    });
  };

  var landingPageLinks = linksConfig && linksConfig.length > 0 && getLinks(linksConfig);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CookieNotification, null), /*#__PURE__*/React.createElement(AppBar, {
    color: "inherit"
  }, /*#__PURE__*/React.createElement(Toolbar, {
    className: classes.toolbar
  }, /*#__PURE__*/React.createElement(Hidden, {
    smUp: true
  }, uid ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/dashboard",
    color: "primary",
    variant: "contained",
    size: "small"
  }, "Dashboard"), /*#__PURE__*/React.createElement(Link, {
    component: NavLink,
    to: "/signin",
    onClick: signOut,
    className: classes.link
  }, "Sign out")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/signin",
    color: "primary",
    variant: "contained",
    size: "small"
  }, "Get Started"), /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/signin",
    color: "primary",
    variant: "outlined",
    className: classes.link,
    size: "small"
  }, "Sign In"))), /*#__PURE__*/React.createElement(Link, {
    component: NavLink,
    to: "/",
    onClick: function onClick() {
      return window.scrollTo(0, 0);
    },
    className: classes.link + " " + classes.title,
    underline: "none"
  }, /*#__PURE__*/React.createElement(Timeline, {
    className: classes.icon
  }), " ", name), /*#__PURE__*/React.createElement(Hidden, {
    xsDown: true
  }, /*#__PURE__*/React.createElement("nav", null, uid ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
    component: NavLink,
    to: "/signin",
    onClick: signOut,
    className: classes.link
  }, "Sign out"), /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/dashboard",
    color: "primary",
    variant: "contained"
  }, "Dashboard")) : /*#__PURE__*/React.createElement(React.Fragment, null, landingPageLinks || null, /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/signin",
    color: "primary",
    variant: "outlined",
    className: classes.link
  }, "Sign In"), /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/signin",
    color: "primary",
    variant: "contained"
  }, "Get Started")))), /*#__PURE__*/React.createElement(Hidden, {
    smUp: true
  }, /*#__PURE__*/React.createElement(IconButton, {
    onClick: handleDrawerToggle,
    edge: "start"
  }, /*#__PURE__*/React.createElement(Menu, null))), /*#__PURE__*/React.createElement(SwipeableDrawer, {
    open: drawerOpen,
    onClose: handleDrawerToggle,
    onOpen: handleDrawerToggle,
    anchor: "left"
  }, /*#__PURE__*/React.createElement(List, {
    role: "presentation",
    onClick: handleDrawerToggle,
    onKeyDown: handleDrawerToggle,
    disablePadding: true
  }, uid ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/dashboard",
    color: "primary",
    variant: "contained",
    size: "small"
  }, "Dashboard")), /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(Link, {
    component: NavLink,
    to: "/signin",
    onClick: signOut,
    className: classes.link
  }, "Sign out"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(Link, {
    href: "#features",
    className: classes.link
  }, "Features")), /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(Link, {
    href: "#pricing",
    className: classes.link
  }, "Pricing")), /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/signin",
    color: "primary",
    variant: "outlined",
    className: classes.link
  }, "Sign In")), /*#__PURE__*/React.createElement(ListItem, null, /*#__PURE__*/React.createElement(Button, {
    component: NavLink,
    to: "/signin",
    color: "primary",
    variant: "contained"
  }, "Get Started"))))))));
};

var mapStateToProps$4 = function mapStateToProps(_ref2) {
  var uid = _ref2.firebase.auth.uid;
  return {
    uid: uid
  };
};

var mapDispatchToProps$1 = function mapDispatchToProps(dispatch) {
  return {
    signOut: function signOut() {
      return dispatch(signOut$2());
    }
  };
};

var NavBar$1 = connect(mapStateToProps$4, mapDispatchToProps$1)(NavBar);

var AuthIsLoaded = function AuthIsLoaded(_ref) {
  var children = _ref.children;
  var auth = useSelector(function (state) {
    var _state$firebase;

    return state == null ? void 0 : (_state$firebase = state.firebase) == null ? void 0 : _state$firebase.auth;
  });
  if (!isLoaded(auth)) return /*#__PURE__*/React.createElement(PageLoadingSpinner, null);
  return children;
};

var useDashboard = function useDashboard() {
  var _stripe$stripeCustome;

  var state = useSelector(function (state) {
    return state;
  });
  var _state$firestore = state.firestore,
      requesting = _state$firestore.status.requesting,
      stripe = _state$firestore.data.stripe,
      stripeCustomerId = state.firebase.profile.stripeCustomerId;
  var isLoading = requesting && (Object.keys(requesting).length === 0 || // if we haven't made a request yet
  Object.keys(requesting).filter(function (value) {
    return /^stripe/.test(value);
  }).filter(function (key) {
    return requesting[key] === true;
  }).length > 0); // if any 

  var _useState = useState([]),
      listeners = _useState[0],
      setListeners = _useState[1];

  var subscriptionStatus = stripe && ((_stripe$stripeCustome = stripe[stripeCustomerId]) == null ? void 0 : _stripe$stripeCustome.status);
  var isSubscribed = subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.TRIALING || subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.ACTIVE;
  useEffect(function () {
    var listener = function listener(plugins) {
      var pluginListeners = plugins.filter(function (plugin) {
        return plugin.type === PLUGIN_TYPES.LISTENER_FIRESTORE;
      });
      setListeners(pluginListeners);
    };

    pluginRegistry.setChangeListener(listener);
    return function () {
      pluginRegistry.removeChangeListener(listener);
    };
  }, []);
  useFirestoreConnect([].concat(listeners, [{
    collection: FIRESTORE_COLLECTIONS.STRIPE,
    doc: stripeCustomerId
  }]));
  return {
    isLoading: isLoading,
    isSubscribed: isSubscribed
  };
};

var drawerWidth$1 = 240;
var useStyles$7 = makeStyles(function (theme) {
  var _sidebar;

  return {
    sidebar: (_sidebar = {
      flex: 1
    }, _sidebar[theme.breakpoints.up("md")] = {
      flexShrink: 0,
      width: "calc(100% - " + drawerWidth$1 + "px)",
      marginLeft: drawerWidth$1,
      maxWidth: "100%"
    }, _sidebar),
    toolbar: theme.mixins.toolbar,
    breadcrumbs: {
      margin: theme.spacing(2, 0, 2, 0)
    }
  };
});

var LinkRouter = function LinkRouter(props) {
  return /*#__PURE__*/React.createElement(Link, _extends({}, props, {
    component: Link$1
  }));
};

var createLinkText = function createLinkText(to) {
  var capitalize = function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  var paths = to == null ? void 0 : to.split("/").filter(function (x) {
    return x;
  });
  var end = paths[paths.length - 1];
  return capitalize(end);
};

var Dashboard = function Dashboard(props) {
  var match = props.match,
      children = props.children;

  var _useDashboard = useDashboard(),
      isLoading = _useDashboard.isLoading,
      isSubscribed = _useDashboard.isSubscribed;

  var classes = useStyles$7(); // sidebar

  var _useState = useState(false),
      mobileOpen = _useState[0],
      setMobileOpen = _useState[1];

  var handleDrawerToggle = function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(PageLoadingSpinner, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DashboardNavBar$1, {
    handleDrawerToggle: handleDrawerToggle
  }), isSubscribed && /*#__PURE__*/React.createElement(DashboardNavSidebar, {
    handleDrawerToggle: handleDrawerToggle,
    mobileOpen: mobileOpen
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.toolbar
  }), /*#__PURE__*/React.createElement(Container, _extends({
    component: "main" // only add sidebar styling if user is subscribed

  }, isSubscribed && {
    className: classes.sidebar
  }), /*#__PURE__*/React.createElement(Route, null, function (_ref) {
    var location = _ref.location;
    var pathnames = location.pathname.split("/").filter(function (x) {
      return x;
    });
    return /*#__PURE__*/React.createElement(Breadcrumbs, {
      "aria-label": "breadcrumb",
      className: classes.breadcrumbs
    }, pathnames.map(function (value, index) {
      var last = index === pathnames.length - 1;
      var to = "/" + pathnames.slice(0, index + 1).join("/");
      var linkText = createLinkText(to);
      return last ? /*#__PURE__*/React.createElement(Typography, {
        color: "textPrimary",
        key: to
      }, linkText) : /*#__PURE__*/React.createElement(LinkRouter, {
        color: "inherit",
        to: to,
        key: to
      }, linkText);
    }));
  }), /*#__PURE__*/React.createElement(Switch, null, !isSubscribed && /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: match.path + "/",
    component: Pricing$1
  }), children, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: match.path + "/account",
    component: Account
  }), /*#__PURE__*/React.createElement(Route, {
    component: function component() {
      return /*#__PURE__*/React.createElement("div", null, "No page found");
    }
  }))));
};

var useSignIn = function useSignIn() {
  var state = useSelector(function (state) {
    return state;
  });
  var dispatch = useDispatch();
  var bowhead = state.bowhead,
      uid = state.firebase.auth.uid;
  var sendEmailAuthError = bowhead.sendEmailAuthError,
      isSendingEmailLink = bowhead.isSendingEmailLink,
      isEmailLinkSent = bowhead.isEmailLinkSent;

  var handleSendSignInEmailLink = function handleSendSignInEmailLink(_ref) {
    var email = _ref.email;
    dispatch(sendSignInEmailLink({
      email: email
    }));
  };

  return {
    sendEmailAuthError: sendEmailAuthError,
    handleSendSignInEmailLink: handleSendSignInEmailLink,
    isSendingEmailLink: isSendingEmailLink,
    isEmailLinkSent: isEmailLinkSent,
    uid: uid
  };
};

var useStyles$8 = makeStyles(function (theme) {
  return {
    section: {
      margin: theme.spacing(10, 0, 10),
      justifyContent: "center"
    }
  };
});

var SignIn = function SignIn() {
  var _useSignIn = useSignIn(),
      sendEmailAuthError = _useSignIn.sendEmailAuthError,
      handleSendSignInEmailLink = _useSignIn.handleSendSignInEmailLink,
      isSendingEmailLink = _useSignIn.isSendingEmailLink,
      isEmailLinkSent = _useSignIn.isEmailLinkSent,
      uid = _useSignIn.uid;

  var _useState = useState({}),
      formInput = _useState[0],
      setFormInput = _useState[1];

  var _useStyles = useStyles$8(),
      section = _useStyles.section;

  if (uid) return /*#__PURE__*/React.createElement(Redirect, {
    to: "/dashboard"
  });

  var handleChange = function handleChange(id, value) {
    setFormInput(function (currentState) {
      var _Object$assign;

      return Object.assign(currentState, (_Object$assign = {}, _Object$assign[id] = value, _Object$assign));
    });
  };

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    var email = formInput == null ? void 0 : formInput.email;

    if (!isSendingEmailLink && email) {
      handleSendSignInEmailLink({
        email: email
      });
    }
  };

  return /*#__PURE__*/React.createElement(Container, {
    component: "main"
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    component: "section",
    className: section
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 6
  }, isEmailLinkSent ? /*#__PURE__*/React.createElement(CheckEmail, null) : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    autoComplete: "on"
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h1",
    gutterBottom: true
  }, "Sign In"), /*#__PURE__*/React.createElement(Typography, null, "Enter the email associated with your account. Clicking the link we send to your inbox will sign you in."), /*#__PURE__*/React.createElement(TextField, {
    id: "email",
    label: "Email",
    required: true,
    type: "email",
    autoComplete: "email",
    onChange: function onChange(_ref) {
      var _ref$target = _ref.target,
          id = _ref$target.id,
          value = _ref$target.value;
      return handleChange(id, value);
    },
    fullWidth: true,
    inputProps: {
      maxLength: "50"
    },
    variant: "outlined",
    margin: "dense"
  }), /*#__PURE__*/React.createElement(ButtonBox, {
    mb: 2
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    color: "primary",
    variant: "contained",
    disabled: isSendingEmailLink
  }, "Sign In"), isSendingEmailLink && /*#__PURE__*/React.createElement(ButtonLoadingSpinner, null)), sendEmailAuthError ? /*#__PURE__*/React.createElement(Typography, {
    color: "error"
  }, "There was error signing you in. Please try again.") : null))));
};

var Verify = function Verify(_ref) {
  var verifyUser = _ref.verifyUser,
      isLoading = _ref.isLoading;
  useEffect(function () {
    verifyUser();
  }, [verifyUser]);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Redirect, {
      to: "/dashboard"
    });
  }

  return /*#__PURE__*/React.createElement(PageLoadingSpinner, null);
};

var mapStateToProps$5 = function mapStateToProps(state) {
  var uid = state.firebase.auth.uid,
      _state$bowhead = state.bowhead,
      isVerifyingUser = _state$bowhead.isVerifyingUser,
      isVerified = _state$bowhead.isVerified;
  var isLoading = uid && !isVerifyingUser && isVerified;
  return {
    isLoading: isLoading
  };
};

var mapDispatchToProps$2 = function mapDispatchToProps(dispatch) {
  return {
    verifyUser: function verifyUser() {
      return dispatch(verifyUser$1());
    }
  };
};

var Verify$1 = connect(mapStateToProps$5, mapDispatchToProps$2)(Verify);

var LandingPage = function LandingPage(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NavBar$1, null), children);
};

var getStore = function getStore(firebase) {
  // see: https://redux-toolkit.js.org/usage/usage-guide#use-with-react-redux-firebase
  var middleware = [].concat(getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [].concat(Object.keys(constants.actionTypes).map(function (type) {
        return constants.actionsPrefix + "/" + type;
      }), Object.keys(actionTypes).map(function (type) {
        return "@@reactReduxFirebase/" + type;
      }), ['bowhead/deleteUserError']),
      ignoredPaths: ['firebase', 'firestore']
    }
  }));

  var getReducers = function getReducers(plugins) {
    var reducers = {};
    plugins.forEach(function (plugin) {
      reducers[plugin.name] = plugin.reducer;
    }); // bowhead redux slices

    reducers.bowhead = bowheadSlice$1;
    reducers.firestore = firestoreReducer;
    reducers.firebase = firebaseReducer;
    return reducers;
  };

  var reducerPlugins = pluginRegistry.getPluginsByType(PLUGIN_TYPES.REDUCER);
  var reducers = getReducers(reducerPlugins); // see: https://github.com/reduxjs/redux-toolkit

  var store = configureStore({
    reducer: combineReducers(reducers),
    middleware: middleware,
    enhancers: [// enhancements to connect redux to Firebase
    // pass in the firebase config details
    reduxFirestore(firebase, {
      logListenerError: false
    })]
  });
  pluginRegistry.setChangeListener(function (plugins) {
    var reducers = getReducers(plugins.filter(function (plugin) {
      return plugin.type === PLUGIN_TYPES.REDUCER;
    }));
    store.replaceReducer(combineReducers(reducers));
  });
  return store;
};

var StoreProvider = function StoreProvider(_ref) {
  var _pluginRegistry$getPl, _pluginRegistry$getPl2;

  var children = _ref.children;
  var firebase = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : (_pluginRegistry$getPl2 = _pluginRegistry$getPl.config) == null ? void 0 : _pluginRegistry$getPl2.firebase;
  var store = getStore(firebase); // see: https://github.com/prescottprue/react-redux-firebase

  var reactReduxFirebaseConfig = {
    firebase: firebase,
    // authentication data
    createFirestoreInstance: createFirestoreInstance,
    // firestore data
    config: {
      userProfile: FIRESTORE_COLLECTIONS.USERS,
      useFirestoreForProfile: true
    },
    dispatch: store.dispatch
  };
  return /*#__PURE__*/React.createElement(Provider, {
    store: store
  }, /*#__PURE__*/React.createElement(ReactReduxFirebaseProvider, reactReduxFirebaseConfig, children));
};

var noProductionUrl = "\nProduction URL is not provided in Bowhead configuration. When this app is deployed, users who are signing in will not be correctly verified. Please provide the URL of the deployed application. \n\nSee: https://github.com/daithimorton/bowhead\n\nExample:\n\nconst bowheadConfig = {\n    app: {\n      name: \"Bowhead\",\n      productionUrl: https://your-awesome-app.com\n    },\n    ...\n}\n";
var noApiConfiguration = "\nPlease provide a configuration defining the required API endpoints. \n\nSee: https://github.com/daithimorton/bowhead\n    \nExample: \n\nconst bowheadConfig = {\n  api: {\n    deleteStripeCustomer: '/deleteStripeCustomer',\n    createStripeCustomerPortalSession: '/createStripeCustomerPortalSession',\n    createStripeCheckoutSession: '/createStripeCheckoutSession'\n  },\n  ...\n}\n";
var noFirebaseInstance = "\nPlease provide an initialised Firebase instance\n\nSee: https://github.com/daithimorton/bowhead\n    \nExample: \n\nconst bowheadConfig = {\n  firebase: firebase,\n  ...\n}\n";
var noFirestoreInstance = "\nPlease provide an initialised Firestore instance\n\nSee: https://github.com/daithimorton/bowhead\n    \nExample: \n\nconst bowheadConfig = {\n  firestore: firestore,\n  ...\n}\n";
var noStripeConfiguration = "\nPlease provide a configuration defining the required Stripe subscription data. \n\nSee: https://github.com/daithimorton/bowhead\n    \nExample: \n\nconst bowheadConfig = {\n  plans: [\n    {\n      title: \"Basic\",\n      price: \"10\",\n      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_BASIC,\n      description: [\n        \"1 Workspace\",\n        \"1 Project/pw\"\n      ],\n      buttonText: \"Get started\",\n      // button variant uses MaterialUI variants \n      // https://material-ui.com/api/button/#props\n      buttonVariant: \"outlined\",\n    },\n    {\n      title: \"Pro\",\n      subheader: \"Most popular\",\n      price: \"50\",\n      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_PRO,\n      description: [\n        \"5 Workspaces\",\n        \"5 Projects/pw\"\n      ],\n      buttonText: \"Get started\",\n      buttonVariant: \"contained\",\n    },\n    {\n      title: \"Enterprise\",\n      price: \"250\",\n      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_ENTERPRISE,\n      description: [\n        \"25 Workspaces\",\n        \"25 Projects/pw\"\n      ],\n      buttonText: \"Get started\",\n      buttonVariant: \"outlined\",\n    }\n  ]\n  ...\n}\n";

var getRoutes = function getRoutes(_ref) {
  var routes = _ref.routes,
      isAuthRoute = _ref.isAuthRoute;
  return routes && routes.map(function (route, index) {
    var path = route == null ? void 0 : route.path;
    var component = route == null ? void 0 : route.component;
    var isValid = path && component;

    if (!isValid) {
      console.warn('Please provide path and component in routes configuration.');
      return null;
    }

    var isLandingPage = path === '/' && !isAuthRoute;
    var updatedPath = isAuthRoute ? "/dashboard" + path : path;
    var Component = route == null ? void 0 : route.component;
    return /*#__PURE__*/React.createElement(Route, {
      key: index,
      exact: true,
      path: updatedPath,
      component: isLandingPage ? function () {
        return /*#__PURE__*/React.createElement(LandingPage, {
          key: index
        }, /*#__PURE__*/React.createElement(Component, null));
      } : component
    });
  });
};

var Bowhead = function Bowhead() {
  var _pluginRegistry$getPl, _bowheadConfiguration;

  // VERIFY CONFIGURATION
  var bowheadConfiguration = (_pluginRegistry$getPl = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]) == null ? void 0 : _pluginRegistry$getPl.config;

  var ConfigurationWalkthrough = function ConfigurationWalkthrough() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Bowhead configuration walkthrough"), /*#__PURE__*/React.createElement("p", null, "Before you can start using Bowhead you must provide some required configuration information."), !(bowheadConfiguration == null ? void 0 : bowheadConfiguration.api) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Stipe API endpoint configuration"), /*#__PURE__*/React.createElement("p", null, "Bowhead uses the Stripe API to manage user subscription payments. In order for this feature to work you must deploy the following API endpoints and tell Bowhead where these can be accessed"), /*#__PURE__*/React.createElement("pre", null, noApiConfiguration)), !(bowheadConfiguration == null ? void 0 : bowheadConfiguration.plans) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Stipe subscription plans"), /*#__PURE__*/React.createElement("p", null, "Bowhead uses the Stripe API to manage user subscription payments. You must create subscription plans in the Stripe console and provide the details for each plan to Bowhead."), /*#__PURE__*/React.createElement("pre", null, noStripeConfiguration)), !(bowheadConfiguration == null ? void 0 : bowheadConfiguration.firebase) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Firebase instance"), /*#__PURE__*/React.createElement("p", null, "Bowhead uses the Google Firebase platform to provide user authentication features. You must create a new project in the Firebase console, initialise an instance of Firebase in this project, and pass this instance to Bowhead."), /*#__PURE__*/React.createElement("pre", null, noFirebaseInstance)), !(bowheadConfiguration == null ? void 0 : bowheadConfiguration.firestore) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Firebase instance"), /*#__PURE__*/React.createElement("p", null, "Bowhead uses the Google Firestore database to provide user profile management features. You must create a new project in the Firebase console, initialise an instance of Firestore in this project, and pass this instance to Bowhead."), /*#__PURE__*/React.createElement("pre", null, noFirestoreInstance)), !(bowheadConfiguration == null ? void 0 : bowheadConfiguration.app) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Application name and production URL"), /*#__PURE__*/React.createElement("p", null, "Bowhead provides a user verification feature when signing in. In order for this verification step to work you must provide the deployed production URL of this project to Bowhead. You must also set your project name."), /*#__PURE__*/React.createElement("pre", null, noProductionUrl)));
  };

  var isConfigurationComplete = true;

  if (!(bowheadConfiguration == null ? void 0 : bowheadConfiguration.api)) {
    console.error(noApiConfiguration);
    isConfigurationComplete = false;
  }

  if (!(bowheadConfiguration == null ? void 0 : bowheadConfiguration.plans)) {
    console.error(noStripeConfiguration);
    isConfigurationComplete = false;
  }

  var firebaseInstance = bowheadConfiguration == null ? void 0 : bowheadConfiguration.firebase;

  if (!firebaseInstance) {
    console.error(noFirebaseInstance);
    isConfigurationComplete = false;
  }

  var firestoreInstance = bowheadConfiguration == null ? void 0 : bowheadConfiguration.firestore;

  if (!firestoreInstance) {
    console.error(noFirestoreInstance);
    isConfigurationComplete = false;
  }

  if (!(bowheadConfiguration == null ? void 0 : (_bowheadConfiguration = bowheadConfiguration.app) == null ? void 0 : _bowheadConfiguration.productionUrl)) {
    console.error(noProductionUrl);
    isConfigurationComplete = false;
  } // CUSTOM ROUTES CONFIGURATION


  var unAuthenticatedRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.ROUTE_UNAUTHENTICATED);
  var authenticatedRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.ROUTE_AUTHENTICATED);
  var themes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.THEME);
  var theme = themes.length > 0 && themes[0].theme;

  var DefaultLandingPage = function DefaultLandingPage() {
    return /*#__PURE__*/React.createElement("div", null, "Default landing page");
  };

  var defaultUnAuthRoutes = [{
    path: '/',
    component: DefaultLandingPage
  }]; // set default routes

  if (unAuthenticatedRoutes.length <= 0) unAuthenticatedRoutes = defaultUnAuthRoutes;

  var DashboardWrapper = function DashboardWrapper(props) {
    return /*#__PURE__*/React.createElement(Dashboard, props, getRoutes({
      routes: authenticatedRoutes,
      isAuthRoute: true
    }));
  };

  var defaultTheme = createMuiTheme();
  return /*#__PURE__*/React.createElement(React.Fragment, null, bowheadConfiguration && isConfigurationComplete ? /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme || defaultTheme
  }, /*#__PURE__*/React.createElement(StoreProvider, null, /*#__PURE__*/React.createElement(AuthIsLoaded, null, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(BrowserRouter, null, /*#__PURE__*/React.createElement(Switch, null, getRoutes({
    routes: unAuthenticatedRoutes
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/signin",
    component: SignIn
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/verify",
    component: Verify$1
  }), /*#__PURE__*/React.createElement(AuthenticatedRoute$1, {
    path: "/dashboard",
    component: DashboardWrapper
  }), /*#__PURE__*/React.createElement(Route, {
    component: function component() {
      return /*#__PURE__*/React.createElement("div", null, "No page found");
    }
  })))))) : /*#__PURE__*/React.createElement(ConfigurationWalkthrough, null));
};

export { Bowhead, PLUGIN_TYPES, STRIPE_SUBSCRIPTION_STATUS, deleteStripeCustomer, deleteUserProfile, pluginRegistry, updateUserProfile };
//# sourceMappingURL=bowhead.js.map
