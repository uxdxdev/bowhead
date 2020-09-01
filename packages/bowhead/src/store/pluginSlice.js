import { createSlice } from '@reduxjs/toolkit'

const pluginSlice = createSlice({
  name: 'plugins',
  initialState: { plugins: [] },
  reducers: {
    registerPlugins: (state, action) => {
      return {
        ...state,
        plugins: action.payload
      }
    },
  }
})

export const {
  registerPlugins,
} = pluginSlice.actions

export default pluginSlice.reducer