import React from "react";
import { useWorkspaces } from "../../hooks";

const Dashboard = () => {

  // init
  useWorkspaces();

  return (<div>This the dashboard</div>);
};

export default Dashboard;
