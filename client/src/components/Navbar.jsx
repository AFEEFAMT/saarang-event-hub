import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Saarang Hub</Link>
      </div>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/">Events</Link>
            <Link to="/my-registrations">My Tickets</Link>
            {role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;