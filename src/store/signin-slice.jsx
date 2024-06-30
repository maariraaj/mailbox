import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'AIzaSyCatwThboBu2LgMKmq15aAmAgyFtgh1CAw';

export const signIn = createAsyncThunk('auth/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      email: credentials.email,
      password: credentials.password,
      returnSecureToken: true,
    });
    localStorage.setItem('token', response.data.idToken);
    localStorage.setItem('mailId', response.data.email);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const signinSlice = createSlice({
  name: 'signin',
  initialState: { user: null, loading: false, error: null, isLoggedIn: !!localStorage.getItem('token') },
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('mailId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { signOut } = signinSlice.actions;
export default signinSlice.reducer;
