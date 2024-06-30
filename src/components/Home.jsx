import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, reset } from '../store/getData-slice';
import { signOut } from '../store/signin-slice';

const Home = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.data.status);

  const mailId = localStorage.getItem('mailId');

  const handleSignOut = () => {
    dispatch(reset());
    dispatch(signOut());
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchData());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(fetchData());
  }, [])

  return (
    <div className='text-center mt-5'>
      <h3>Welcome {mailId} to  MailBox Client</h3>
      <button className='btn btn-danger mt-5' onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default Home