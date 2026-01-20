import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../axios'

// -------------------- THUNKS --------------------

// User: get own tasks
export const fetchMyTasks = createAsyncThunk(
  'tasks/fetchMyTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/tasks/my-tasks')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

// Admin: get all tasks
export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAllTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/tasks/all')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

// Manager: create task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/tasks', data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

// Manager: update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${id}`, data)
      return res.data // expecting updated task from backend
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

// -------------------- SLICE --------------------

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch My Tasks
      .addCase(fetchMyTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch All Tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.list.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false

        const index = state.list.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default taskSlice.reducer
