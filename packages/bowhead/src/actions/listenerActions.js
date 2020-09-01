import * as listenerSlice from '../store/listenerSlice'

export const updateFirestoreListeners = (collection) => {
  return (dispatch) => {
    dispatch(listenerSlice.updateListeners(collection));
  };
};
