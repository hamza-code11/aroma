import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../config';

export const fetchUsers = createAsyncThunk('users/fetch', async ({ page = 1, search = '', sortBy = 'id', sortOrder = 'asc' }) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({ page, search, sortBy, sortOrder });
  const res = await fetch(`${API_URL}/users?${params}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  return res.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { 
    data: [], 
    pagination: {}, 
    loading: false, 
    search: '',       // ✅ Default value
    sortBy: 'id',     // ✅ Default value
    sortOrder: 'asc', // ✅ Default value
  },
  reducers: {
    setSearch: (state, action) => { state.search = action.payload; },
    setSort: (state, action) => { 
      state.sortBy = action.payload.sortBy; 
      state.sortOrder = action.payload.sortOrder; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state) => { state.loading = false; });
  },
});

export const { setSearch, setSort } = usersSlice.actions;
export default usersSlice.reducer;