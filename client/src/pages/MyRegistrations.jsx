import { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const MyRegistrations = () => {
  const [myEvents, setMyEvents] = useState([]);

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/registrations/my');
      setMyEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Are you sure you want to drop this ticket?')) return;
    try {
      await api.delete(`/registrations/${eventId}`);
      fetchMyEvents(); 
    } catch (err) {
      alert('Failed to cancel ticket');
    }
  };

  return (
    <div className="page-container">
      <h2>My Tickets</h2>
      {myEvents.length === 0 && <p>You haven't registered for any events yet.</p>}
      <div className="grid">
        {myEvents.map((evt) => (
          <EventCard 
            key={evt._id} 
            event={evt} 
            actionButton={
              <button className="btn-danger" onClick={() => handleCancel(evt._id)}>
                Cancel Ticket
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MyRegistrations;