import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token
      state.role = action.payload.role

      // Persist to localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('role', action.payload.role)
    },

    logout: (state) => {
      state.token = null
      state.role = null

      // Only remove auth items (safer than clear)
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
