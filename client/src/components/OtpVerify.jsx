import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
        email,
        otp,
      });
      setMessage(res.data.message);
      alert("OTP Verified! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data);
      setMessage("Invalid OTP. Try again.");
    }
  };

  return (
     <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify OTP</h2>
        <form onSubmit={handleVerify} >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
            required
          />
          <button
            type="submit"
            style={styles.button}>
            Verify OTP
          </button>
        </form>
        {message && (
          <p className="text-center mt-4 text-red-500 font-medium">{message}</p>
        )}
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
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default OtpVerify;
