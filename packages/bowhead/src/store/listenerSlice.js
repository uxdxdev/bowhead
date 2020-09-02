import { createSlice } from '@reduxjs/toolkit'
import { pluginRegistry } from '../registry/plugin-registry'
import { PLUGIN_TYPES } from '../utils/pluginTypes'

const listenerSlice = createSlice({
  name: 'listeners',
  initialState: { collections: [] },
  reducers: {
    updateListeners: (state, action) => {
      return {
        ...state,
        collections: action.payload || []
      }
    },
  }
})

pluginRegistry.register('listener-reducer', {
  type: PLUGIN_TYPES.REDUCER,
  name: 'listeners',
  reducer: listenerSlice.reducer
})

export const {
  updateListeners,
} = listenerSlice.actions

export default listenerSlice.reducer