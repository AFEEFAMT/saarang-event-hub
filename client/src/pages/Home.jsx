import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/registrations/${eventId}`);
      alert('Ticket secured!');
      fetchEvents(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  if (loading) return <div className="page-container">Loading lineup...</div>;

  return (
    <div className="page-container">
      <h2>Saarang 2027 Lineup</h2>
      <div className="grid">
        {events.map((evt) => (
          <EventCard 
            key={evt._id} 
            event={evt} 
            actionButton={
              token ? (
                <button 
                  className="btn-primary" 
                  disabled={evt.registrationCount >= evt.maxParticipants}
                  onClick={() => handleRegister(evt._id)}
                >
                  {evt.registrationCount >= evt.maxParticipants ? 'Sold Out' : 'Register'}
                </button>
              ) : (
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Log in to register</span>
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Home;