import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userSelector, login } from '../features/user/userSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(userSelector);

  useEffect(() => {
    dispatch(login());
  }, [dispatch]);

  return (
    <>
      <div>home</div>
      <div>page</div>
    </>
  );
};

export default Home;
