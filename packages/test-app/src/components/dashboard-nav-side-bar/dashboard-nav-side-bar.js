import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Hidden, Drawer, Divider } from "@material-ui/core";
import {
  List as ListIcon,
  Dashboard as DashboardIcon,
  AccountTree as AccountTreeIcon,
  DoubleArrow as DoubleArrowIcon,
} from "@material-ui/icons";
import { SidebarMenuItem } from "../";
import { setActiveWorkspace } from "../../actions/workspaceActions";
import { useHistory } from 'react-router-dom'

// sidebar
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    borderRight: "none",
    '& .MuiCollapse-entered': {
      overflow: 'auto'
    },
  }
}));

const DashboardNavSidebar = ({
  workspaces,
  setActiveWorkspace,
  activeWorkspaceId,
  handleDrawerToggle,
  mobileOpen,
}) => {
  const classes = useStyles();
  const history = useHistory();

  // currently selected menu item 
  const [activeMenuItem, setActiveMenuItem] = useState('initialState')

  // workspaces
  const workspacesArray = workspaces && Object.keys(workspaces);
  const workspaceExists = workspacesArray?.length > 0;
  const workspacesCollection = workspacesArray?.filter((workspaceId) => workspaces[workspaceId]?.name && workspaceId)
    .map((workspaceId) => {
      const workspaceName = workspaces[workspaceId]?.name;
      return {
        Icon: activeWorkspaceId === workspaceId && DoubleArrowIcon,
        text: workspaceName,
        onClick: () => {
          setActiveWorkspace(workspaceId);
          handleDrawerToggle();
          history.push('/dashboard/project')
        },
        style: {
          backgroundColor:
            activeWorkspaceId === workspaceId && "rgba(0, 0, 0, 0.04)",
        },
      };
    });

  // sidebar menu items
  const plugins = [
    {
      Icon: DashboardIcon,
      text: "Dashboard",
      link: "/dashboard",
      onClick: () => {
        handleDrawerToggle();
        setActiveMenuItem('dashboard')
      },
      style: {
        backgroundColor:
          activeMenuItem === 'dashboard' && "rgba(0, 0, 0, 0.04)",
      }
    },
    workspaceExists && {
      Icon: ListIcon,
      text: "Projects",
      link: "/dashboard/project",
      onClick: () => {
        handleDrawerToggle();
        setActiveMenuItem('projects')
      },
      style: {
        backgroundColor:
          activeMenuItem === 'projects' && "rgba(0, 0, 0, 0.04)",
      }
    },
    {
      Component: Divider,
    },
    {
      Icon: AccountTreeIcon,
      text: "Workspaces",
      items: workspacesCollection,
      isDefaultOpen: true
    }
  ];

  const drawer = () => {
    return plugins.map(
      (menuItem, index) =>
        menuItem && <SidebarMenuItem key={index} {...menuItem} />
    );
  };

  return (
    <>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer()}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          <div className={classes.toolbar} />
          {drawer()}
        </Drawer>
      </Hidden>
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    firebase: {
      profile: { workspaces },
    },
    auth: { activeWorkspaceId },
  } = state;

  return {
    workspaces,
    activeWorkspaceId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveWorkspace: (workspaceId) =>
      dispatch(setActiveWorkspace(workspaceId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardNavSidebar);
