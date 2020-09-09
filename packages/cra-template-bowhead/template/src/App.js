import React, { useMemo } from "react";
import { Bowhead, PLUGIN_TYPES, pluginRegistry } from "@mortond/bowhead";
import { LandingPage, Terms, Invite, DashboardRoot } from './pages'
import { Projects, ProjectDetails, Settings } from './components'
import {
  List as ListIcon,
  Settings as SettingsIcon,
  AccountTree as AccountTreeIcon
} from "@material-ui/icons";
import { createMuiTheme } from "@material-ui/core/styles";

const App = () => {

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: "dark",
        },
      }),
    []
  );

  const plugins = [
    {
      type: PLUGIN_TYPES.THEME,
      name: 'theme',
      theme: theme
    },
    // unauthenticated routes are available outside the
    // dashboard routes
    {
      type: PLUGIN_TYPES.UNAUTHENTICATED_ROUTE,
      name: 'route-landing-page',
      path: '/',
      component: LandingPage,
    },
    {
      type: PLUGIN_TYPES.UNAUTHENTICATED_ROUTE,
      name: 'route-terms',
      path: '/terms',
      component: Terms,
    },
    {
      type: PLUGIN_TYPES.UNAUTHENTICATED_ROUTE,
      name: 'route-invite',
      path: '/invite',
      component: Invite,
    },
    // authenticated routes are available at /dashboard/*
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      name: 'route-dashboard-root',
      path: '/',
      component: DashboardRoot,
    },
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      name: 'route-projects',
      path: '/projects',
      component: Projects,
    },
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      name: 'route-project-details',
      path: '/projects/:id',
      component: ProjectDetails,
    },
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      name: 'route-settings',
      path: '/settings',
      component: Settings,
    },
    // menu items should be registered before the Bowhead
    // shell is rendered because when the Bowhead nav bar 
    // and sidebar are mounted the plugin registry is checked
    {
      type: PLUGIN_TYPES.MENU_ITEM_SIDEBAR,
      name: 'menu-item-projects',
      menuIcon: ListIcon,
      text: "Projects",
      path: "/projects",
    },
    {
      type: PLUGIN_TYPES.MENU_ITEM_POPOVER,
      name: 'menu-item-settings',
      path: "/settings",
      menuIcon: SettingsIcon,
      text: 'Settings'
    },
    // add "Workspaces" menu item to sidebar when app is loaded
    // see src/hooks/use-init.js where this menu item is replaced
    // and child menu items are added for new workspaces
    {
      type: PLUGIN_TYPES.MENU_ITEM_SIDEBAR,
      name: 'menu-item-workspaces',
      menuIcon: AccountTreeIcon,
      text: "Workspaces",
      path: '/projects'
    }
  ]


  plugins.forEach(plugin => {
    pluginRegistry.register(plugin.name, plugin)
  })

  const bowheadConfig = {
    api: {
      deleteStripeCustomer: process.env.REACT_APP_BOWHEAD_API_DELETE_STRIPE_CUSTOMER,
      createStripeCustomerPortalSession: process.env.REACT_APP_BOWHEAD_API_CREATE_STRIPE_CUSTOMER_PORTAL_SESSION,
      createStripeCheckoutSession: process.env.REACT_APP_BOWHEAD_API_CREATE_STRIPE_CHECKOUT_SESSION
    }
  }

  pluginRegistry.register('bowhead-configuration', {
    type: PLUGIN_TYPES.BOWHEAD_API_CONFIGURATION,
    config: bowheadConfig
  })

  return (
    <Bowhead />
  );
};

export default App;
