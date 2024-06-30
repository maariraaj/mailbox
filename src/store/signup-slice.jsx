import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_KEY = 'AIzaSyCatwThboBu2LgMKmq15aAmAgyFtgh1CAw';

export const signUp = createAsyncThunk('auth/signUp', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      email: credentials.email,
      password: credentials.password,
      returnSecureToken: true,
    });
    console.log("User has successfully signed up.")
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const signupSlice = createSlice({
  name: 'signup',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default signupSlice.reducer;