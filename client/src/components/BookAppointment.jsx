import { useState, useEffect } from 'react';
import axios from 'axios';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  const token = localStorage.getItem('token');

  // this will Fetch doctors and slots
  useEffect(() => {
    const fetchDoctorsAndSlots = async () => {
      try {
        const [doctorsRes, slotsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/doctors/', {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get('http://localhost:8000/api/slots/', {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setDoctors(doctorsRes.data);
        setSlots(slotsRes.data);
      } catch (err) {
        console.error('Error fetching doctors or slots:', err);
      }
    };
    fetchDoctorsAndSlots();
  }, [token]);

  // Fetch available slots excluding leaves
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDate || slots.length === 0) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/leaves/?doctor=${selectedDoctor}&date=${selectedDate}`,
          { headers: { Authorization: `Token ${token}` } }
        );

        const leaves = res.data.map((l) => l.slot); // unavailable slot IDs
        const filtered = slots.filter((slot) => !leaves.includes(slot.id));
        setAvailableSlots(filtered);
        setSelectedSlot(''); 
      } catch (err) {
        console.error('Error fetching leaves:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDoctor, selectedDate, slots, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert('Please select a slot');
      return;
    }

    const data = {
      patient_name: patientName,
      age: parseInt(age),
      appointment_date: selectedDate,
      doctor: parseInt(selectedDoctor),
      slot: parseInt(selectedSlot),
    };

    try {
      await axios.post('http://localhost:8000/api/appointments/create/', data, {
        headers: { Authorization: `Token ${token}` },
      });
      alert('Appointment booked successfully!');
      // Reset form
      setPatientName('');
      setAge('');
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedSlot('');
      setAvailableSlots([]);
    } catch (err) {
      console.error('Error booking appointment:', err.response?.data);
      alert(err.response?.data?.detail || 'Error booking appointment');
    }
  };

  return (
    <div style={styles.page}>
        <div style={styles.card}>
      <h2 style={styles.title}>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <br /><br />

        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} - {d.speciality}
            </option>
          ))}
        </select>
        <br /><br />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
        <br /><br />

        <div>
          <h4 style={{ color: "#3a8dff", marginBottom: "10px" }}>Select Slot</h4>
          {loadingSlots && <p>Loading slots...</p>}
          {!loadingSlots && selectedDoctor && selectedDate && availableSlots.length === 0 && (
            <p>No slots available for this doctor on this date.</p>
          )}
          {!loadingSlots &&
            availableSlots.map((slot) => (
              <label key={slot.id} style={{ display: 'block', margin: '5px 0', color: "#333", fontWeight: "500", }}>
                <input
                  type="radio"
                  name="slot"
                  value={slot.id}
                  checked={selectedSlot === String(slot.id)}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  required
                />{' '}
                {slot.time}
              </label>
            ))}
        </div>
        <br />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
    </div>
  );
}
const styles = {
  page: {
    height: "100vh",
    width:"100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #3a8dff, #6dd5ed)",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "350px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    background: "#3a8dff",
    color: "black",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
};


export default BookAppointment;



