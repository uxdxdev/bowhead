import * as pluginSlice from '../store/pluginSlice'

export const registerPlugins = (collection) => {
  return (dispatch) => {
    dispatch(pluginSlice.registerPlugins(collection));
  };
};
