import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch user info
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/profile/', {
          headers: { Authorization: `Token ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    // Fetch appointments
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/appointments/', {
          headers: { Authorization: `Token ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchUser();
    fetchAppointments();
  }, [token]);

  if (!user) return <p>Loading profile...</p>;

  return (
     <div style={styles.page}>
      <div style={styles.card}>
      <h2 style={styles.heading}>{user.username}'s Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>

      <h3 style={{ marginTop: '20px', color: 'white' }}>Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Slot</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Age</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} style={styles.row}>
                <td style={styles.td}>{appt.doctor.name}</td>
                <td  style={styles.td}>{appt.appointment_date}</td>
                <td  style={styles.td}>{appt.slot.time}</td>
                <td  style={styles.td}>{appt.patient_name}</td>
                <td  style={styles.td}>{appt.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}
const styles = {
    page: {
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #3a8dff, #6dd5ed)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minWidth: '100vw',
      marginTop: '60px',
    
    },
    card: {
      background: 'darkblue',
      borderRadius: '12px',
      padding: '30px',
      width: '80%',
      maxWidth: '800px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    },
    heading: {
      color: '#3a8dff',
      marginBottom: '15px',
      textAlign: 'center',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 10px', 
    },
    th: {
      background: '#3a8dff',
      color: 'black',
      padding: '10px',
      textAlign: 'left',
      borderRadius: '8px 8px 0 0',
    },
    td: {
      padding: '10px',
      background: 'black',
      borderRadius: '8px',
    },
    row: {
      marginBottom: '10px',
    },
  };

export default Profile;
