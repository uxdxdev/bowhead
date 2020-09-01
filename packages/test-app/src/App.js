import React from "react";
import { Bowhead } from "@mortond/bowhead";
import { LandingPage, Terms } from './pages'
import { Projects, ProjectDetails } from './components'
import projectSlice from "./store/projectSlice";

const App = () => {

  const bowheadConfig = {
    landingPage: LandingPage,
    unauthRoutesConfig: [
      {
        path: '/terms',
        component: Terms,
      }
    ],
    dashboardRoutesConfig: [
      {
        path: '/project',
        component: Projects,
      },
      {
        path: '/project/:id',
        component: ProjectDetails,
      }
    ],
    reducers: { project: projectSlice }
  }

  return (
    <Bowhead
      config={bowheadConfig}
    />
  );
};

export default App;
