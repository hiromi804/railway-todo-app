import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
// import {
//   useSelector as rawUseSelector,
//   TypedUseSelectorHook,
// } from 'react-redux'
import { useSelector } from 'react-redux/es/exports'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
})

// export type RootState = ReturnType<typeof store.getState>
// export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector
