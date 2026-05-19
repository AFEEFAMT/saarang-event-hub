import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyRegistrations from './pages/MyRegistrations';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, role } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin && role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/my-registrations" element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;