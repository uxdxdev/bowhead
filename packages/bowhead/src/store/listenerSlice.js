import { createSlice } from '@reduxjs/toolkit'
import { reducerRegistry } from '../registry/reducer-registry'

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

reducerRegistry.register('listeners', listenerSlice.reducer)

export const {
  updateListeners,
} = listenerSlice.actions

export default listenerSlice.reducer