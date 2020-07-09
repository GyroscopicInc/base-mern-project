import { combineReducers } from '@reduxjs/toolkit';

import user from '../features/user/userSlice';

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
