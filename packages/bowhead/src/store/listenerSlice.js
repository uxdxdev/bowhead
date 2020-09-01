import { createSlice } from '@reduxjs/toolkit'

const listenerSlice = createSlice({
  name: 'listeners',
  initialState: { collections: [] },
  reducers: {
    updateListeners: (state, action) => {
      return {
        ...state,
        collections: action.payload
      }
    },
  }
})

export const {
  updateListeners,
} = listenerSlice.actions

export default listenerSlice.reducer