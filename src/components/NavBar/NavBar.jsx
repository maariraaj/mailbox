import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, reset } from '../../store/getData-slice';
import { signOut } from '../../store/signin-slice';

const NavBar = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.data.status);
  const count = useSelector((state) => state.data.count);

  const isLoggedIn = useSelector((state) => state.signin.isLoggedIn);

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
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border border-danger mb-3" style={{ boxShadow: '0 0 10px red', marginTop: '10px', marginLeft: '10px', marginRight: '10px' }}>
      <NavLink className="navbar-brand d-flex align-items-center" to="/">
        <img
          src="/mailicon.ico"
          width="30"
          height="30"
          className="d-inline-block align-top me-1 ms-3"
          alt="Logo"
        />
        <span style={{ marginLeft: '10px' }}>MailBox</span>
      </NavLink>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" activeclassname="active" to="/compose">New Mail</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeclassname="active" to="/inbox">Inbox{`(${count})`}</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeclassname="active" to="/sent">Sent Mail</NavLink>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" activeclassname="active" to="/">Account</NavLink>
          </li>
          {!isLoggedIn && (<li className="nav-item">
            <NavLink className="nav-link" activeclassname="active" to="/signin">SignIn</NavLink>
          </li>)}
          {isLoggedIn && (<li className="nav-item" onClick={handleSignOut}>
            <NavLink className="nav-link" activeclassname="active" to="/signin">SignOut</NavLink>
          </li>)}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
