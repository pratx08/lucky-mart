import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/authReducer';
import '../styles/Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>LUCKY MART</h2>
      </div>
      <div className="nav-right">
        {user?.role === 'admin' && <span className="nav-item">Report</span>}
        <span className="nav-item" onClick={handleLogout}>Logout</span>
      </div>
    </nav>
  );
};

export default Navbar;
