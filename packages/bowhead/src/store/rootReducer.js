import authSlice from "./authSlice";
import userSlice from "./userSlice";
import workspaceSlice from "./workspaceSlice";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const getRootReducer = ({ reducers }) => {
  const rootReducers = {
    auth: authSlice,
    user: userSlice,
    workspace: workspaceSlice,
    firestore: firestoreReducer,
    firebase: firebaseReducer
  }

  const combinedReducers = { ...rootReducers, ...reducers }

  return combineReducers(combinedReducers)
};

export { getRootReducer };
