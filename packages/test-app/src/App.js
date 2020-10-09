import React, { useMemo } from "react";
import { Bowhead, PLUGIN_TYPES, pluginRegistry } from "@mortond/bowhead";
import { LandingPage, Terms, Invite, DashboardRoot } from './pages'
import { Projects, ProjectDetails, Workspaces, Settings } from './components'
import {
  List as ListIcon,
  AccountTree as AccountTreeIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";
import { createMuiTheme, } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core"
import { firebase, firestore } from "./utils/firebase"
import { stripe } from "./utils/stripe"

const App = () => {

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createMuiTheme({
        typography: {
          fontFamily: ["Inter", "-apple-system"].join(","),
          h1: {
            fontWeight: 700,
            fontSize: "64px",
          },
          subtitle1: {
            fontWeight: 500,
            fontSize: "32px",
          },
          h2: {
            fontWeight: 600,
            fontSize: "40px",
          },
          subtitle2: {
            fontWeight: 400,
            fontSize: "24px",
          },
          h3: {
            fontWeight: 600,
            fontSize: "32px",
          },
          h4: {
            fontWeight: 600,
            fontSize: "28px",
          },
          h5: {
            fontWeight: 600,
            fontSize: "24px",
          },
          h6: {
            fontWeight: 600,
            fontSize: "20px",
          },
          body1: {
            fontWeight: 400,
            fontSize: "14px",
          },
          body2: {
            fontWeight: 400,
            fontSize: "18px",
          },
        },
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: { main: "#00B0FF" },
          secondary: { main: "#F50057" },
        },
      }),
    [prefersDarkMode]
  );

  pluginRegistry.register('bowhead-theme', {
    type: PLUGIN_TYPES.THEME,
    name: 'theme',
    theme: theme
  })


  const routesAndMenuItems = [
    // unauthenticated routes are available outside the
    // dashboard routes
    {
      type: PLUGIN_TYPES.ROUTE_UNAUTHENTICATED,
      name: 'route-landing-page',
      path: '/',
      component: LandingPage,
    },
    {
      type: PLUGIN_TYPES.ROUTE_UNAUTHENTICATED,
      name: 'route-terms',
      path: '/terms',
      component: Terms,
    },
    {
      type: PLUGIN_TYPES.ROUTE_UNAUTHENTICATED,
      name: 'route-invite',
      path: '/invite',
      component: Invite,
    },
    // authenticated routes are available at /dashboard/*
    {
      type: PLUGIN_TYPES.ROUTE_AUTHENTICATED,
      name: 'route-dashboard-root',
      path: '/',
      component: DashboardRoot,
    },
    {
      type: PLUGIN_TYPES.ROUTE_AUTHENTICATED,
      name: 'route-projects',
      path: '/projects',
      component: Projects,
    },
    {
      type: PLUGIN_TYPES.ROUTE_AUTHENTICATED,
      name: 'route-project-details',
      path: '/projects/:id',
      component: ProjectDetails,
    },
    {
      type: PLUGIN_TYPES.ROUTE_AUTHENTICATED,
      name: 'route-workspaces',
      path: '/workspaces',
      component: Workspaces,
    },
    {
      type: PLUGIN_TYPES.ROUTE_AUTHENTICATED,
      name: 'route-settings',
      path: '/settings',
      component: Settings,
    },
    // menu items should be registered before the Bowhead
    // shell is rendered because when the Bowhead nav bar 
    // and sidebar are mounted the plugin registry is checked
    {
      type: PLUGIN_TYPES.LINK_SIDEBAR,
      name: 'menu-item-projects',
      menuIcon: ListIcon,
      text: "Projects",
      path: "/projects",
    },
    {
      type: PLUGIN_TYPES.LINK_POPOVER,
      name: 'menu-item-workspaces',
      path: "/workspaces",
      menuIcon: AccountTreeIcon,
      text: 'Workspaces'
    },
    {
      type: PLUGIN_TYPES.LINK_POPOVER,
      name: 'menu-item-settings',
      path: "/settings",
      menuIcon: SettingsIcon,
      text: 'Settings'
    },
    // add "Workspaces" menu item to sidebar when app is loaded
    // see src/hooks/use-init.js where this menu item is replaced
    // and child menu items are added for new workspaces
    {
      type: PLUGIN_TYPES.LINK_SIDEBAR,
      name: 'link-workspaces',
      menuIcon: AccountTreeIcon,
      text: "Workspaces",
      path: '/workspaces'
    },
    {
      type: PLUGIN_TYPES.LINK_LANDING_PAGE_NAV,
      name: 'navlink-features',
      labelText: 'Features',
      path: '#features'
    },
    {
      type: PLUGIN_TYPES.LINK_LANDING_PAGE_NAV,
      name: 'navlink-pricing',
      labelText: 'Pricing',
      path: '#pricing'
    }
  ]

  routesAndMenuItems.forEach(plugin => {
    pluginRegistry.register(plugin.name, plugin)
  })

  const bowheadConfig = {
    app: {
      name: "Bowhead",
      productionUrl: process.env.REACT_APP_BOWHEAD_PRODUCTION_URL
    },
    // These APIs are required for Bowhead to manage a users stripe subscription
    api: {
      deleteStripeCustomer: process.env.REACT_APP_BOWHEAD_API_DELETE_STRIPE_CUSTOMER,
      createStripeCustomerPortalSession: process.env.REACT_APP_BOWHEAD_API_CREATE_STRIPE_CUSTOMER_PORTAL_SESSION,
      createStripeCheckoutSession: process.env.REACT_APP_BOWHEAD_API_CREATE_STRIPE_CHECKOUT_SESSION
    },
    // Provide information for each Stripe subscription
    plans: [
      {
        title: "Basic",
        price: "10",
        priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_BASIC,
        description: [
          "1 Workspace",
          "1 Project/pw"
        ],
        buttonText: "Get started",
        // button variant uses MaterialUI variants 
        // https://material-ui.com/api/button/#props
        buttonVariant: "outlined",
      },
      {
        title: "Pro",
        subheader: "Most popular",
        price: "50",
        priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_PRO,
        description: [
          "5 Workspaces",
          "5 Projects/pw"
        ],
        buttonText: "Get started",
        buttonVariant: "contained",
      },
      {
        title: "Enterprise",
        price: "250",
        priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_ENTERPRISE,
        description: [
          "25 Workspaces",
          "25 Projects/pw"
        ],
        buttonText: "Get started",
        buttonVariant: "outlined",
      }
    ],
    // Provide initialised Firebase, Firestore, and Stripe instances
    firebase: firebase,
    firestore: firestore,
    stripe: stripe
  }

  pluginRegistry.register('configuration-bowhead', {
    type: PLUGIN_TYPES.CONFIGURATION_BOWHEAD,
    config: bowheadConfig
  })

  return (
    <Bowhead />
  );
};

export default App;
