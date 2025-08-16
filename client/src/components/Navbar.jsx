import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f0f0f0',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 1000
    }}>
    <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
    <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
    <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
    <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default Navbar;