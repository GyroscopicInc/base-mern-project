import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import history from '../../app/history';

export const initialState = {
  user: {},
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = userSlice.actions;

export const login = (data) => async (dispatch) => {
  await axios
    .post('/api/user/login', data)
    .then((response) => {
      dispatch(loginSuccess(response.data));
    })
    .catch((error) => {
      console.log(error.response);
    });
};

export const logout = () => async (dispatch) => {
  await axios
    .post('/api/user/logout')
    .then(() => {
      dispatch(logoutSuccess());
      history.push('/login');
    })
    .catch((error) => {
      console.log(error.response);
    });
};

export const userSelector = (state) => state.user;
export default userSlice.reducer;
