const EventCard = ({ event, actionButton }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{event.title}</h3>
        <span className="badge">{event.category}</span>
      </div>
      <div className="card-body">
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Day {event.day}</strong> | {event.startTime} - {event.endTime}</p>
        <p className="desc">{event.description}</p>
        
        <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.85rem' }}>
          {event.registrationCount} / {event.maxParticipants} Registered
        </div>
      </div>
      <div className="card-footer">
        {actionButton}
      </div>
    </div>
  );
};

export default EventCard;