import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/doctors/")
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  const handleBook = (doctorId) => {
    navigate(`/appointments/create?doctor=${doctorId}`);
  };

  return (
    <div className="doctors-page">
      <style>{`
        .doctors-page {
        padding: 2rem;
        text-align: center;
        background-color: #007BFF;
        height: 100vh;
        width: 100vw;
        }
        .title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          color: white;
        
        
        }
        .underline {
          width: 4rem;
          height: 4px;
          background: teal;
          margin: 0 auto 2rem auto;
        }
        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          justify-content: center;
          max-width: 1000px;
          margin-left: 150px;
        }
        .doctor-card {
          padding: 1rem;
          background: #fff;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          margin: 0 auto;
        
        }
        .doctor-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
        }
        .doctor-speciality {
          font-size: 0.9rem;
          color: #555;
        }
        .doctor-department {
          font-size: 0.85rem;
          color: #777;
          margin-bottom: 1rem;
        }
        .book-btn {
          background: teal;
          color: white;
          padding: 0.5rem 1.2rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: background 0.3s;
          border: none;
        }
        .book-btn:hover {
          background: #006d6d;
        }
      `}</style>

      <h2 className="title">Meet Our Doctors</h2>
      <div className="underline"></div>

      {doctors.length === 0 ? (
        <p style={{ color: "#555" }}>No doctors available.</p>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-speciality">{doctor.speciality}</p>
              <p className="doctor-department">{doctor.department}</p>
              <button
                onClick={() => handleBook(doctor.id)}
                className="book-btn"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorsList;

