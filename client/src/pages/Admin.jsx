import { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '', category: 'Music', venue: '', day: 1, startTime: '10:00', endTime: '12:00'
  });

  const fetchEvents = async () => {
    const res = await api.get('/events');
    setEvents(res.data.events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      fetchEvents();
      alert('Event successfully created.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event? This will wipe all user registrations for it.')) return;
    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Create Form */}
        <div className="form-container" style={{ margin: '0', flex: '1', minWidth: '300px' }}>
          <h2>Create New Event</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <input placeholder="Title" required onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <input placeholder="Venue" required onChange={e => setFormData({...formData, venue: e.target.value})} />
            </div>
            <div className="form-group">
              <select onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Music</option><option>Drama</option><option>Comedy</option><option>Media</option><option>Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group"><input type="number" min="1" max="5" placeholder="Day" onChange={e => setFormData({...formData, day: e.target.value})} /></div>
              <div className="form-group"><input type="time" required onChange={e => setFormData({...formData, startTime: e.target.value})} /></div>
              <div className="form-group"><input type="time" required onChange={e => setFormData({...formData, endTime: e.target.value})} /></div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Deploy Event</button>
          </form>
        </div>

        {/* Right Side: Manage Events */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2>Manage Database</h2>
          <div className="grid" style={{ marginTop: '0' }}>
            {events.map(evt => (
              <EventCard 
                key={evt._id} 
                event={evt} 
                actionButton={<button className="btn-danger" onClick={() => handleDelete(evt._id)}>Delete</button>}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;