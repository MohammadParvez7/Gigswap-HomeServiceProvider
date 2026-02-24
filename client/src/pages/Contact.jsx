import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Styles/Contact.css";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const defaultContactFormData = {
  username: "",
  email: "",
  message: "",
  address: "", // Area Name
  mapLink: "", // Google Map Link
  date: "",
  time: "",
};

export const Contact = () => {
  const [contact, setContact] = useState(defaultContactFormData);
  const [userData, setUserData] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceFromURL = params.get("service");
    if (serviceFromURL) {
      setContact((prev) => ({ ...prev, message: serviceFromURL }));
    }
  }, [location]);

  useEffect(() => {
    if (userData && user) {
      setContact((prev) => ({
        ...prev,
        username: user.username,
        email: user.email,
        message: contact.message || prev.message,
      }));
      setUserData(false);
    }
  }, [userData, user, contact.message]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.address || !contact.mapLink) {
      return toast.warn("Please select Area and paste Map Link!");
    }
    try {
      const response = await fetch("https://gigswap-hsp-server.vercel.app/api/form/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (response.ok) {
        setContact({ ...defaultContactFormData, username: user.username, email: user.email });
        toast.success("Service Booked Successfully!");
      } else {
        toast.error("Failed to book service.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  return (
    <section className="section-contact">
      <div className="contact-content container"><h1 className="main-heading">Book Your Service</h1></div>
      <div className="container grid grid-two-cols">
        <div className="contact-img"><img src="/images/support.png" alt="support" /></div>
        <section className="section-form">
          <form onSubmit={handleSubmit}>
            <div><label>Username</label><input type="text" name="username" value={contact.username} readOnly /></div>
            <div><label>Email</label><input type="email" name="email" value={contact.email} readOnly /></div>
            <div>
              <label>Services</label>
              <select name="message" value={contact.message} onChange={handleInput} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
                <option value="">Select Service</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Ac-Repair">Ac-Repair</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Pest Control">Pest Control</option>
              </select>
            </div>
            {/* ADDRESS SECTION */}
            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label>1. Select Area (Required)</label>
                <select name="address" value={contact.address} onChange={handleInput} required style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }}>
                  <option value="">-- Choose Area --</option>
                  <option value="Shivaji Nagar">Shivaji Nagar</option>
                  <option value="Viman Nagar">Viman Nagar</option>
                  <option value="Kothrud">Kothrud</option>
                  <option value="Hinjewadi">Hinjewadi</option>
                </select>
              </div>
              <div>
                <label>2. Paste Map Link (Required)</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input type="text" name="mapLink" placeholder="Paste link here..." value={contact.mapLink} onChange={handleInput} required style={{ flex: 1, padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }} />
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ background: "#4285F4", color: "#fff", padding: "10px 15px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold" }}>📍 Maps</a>
                </div>
              </div>
            </div>
            <div className="grid grid-two-cols" style={{ marginTop: "15px" }}>
              <div><label>Date</label><input type="date" name="date" value={contact.date} onChange={handleInput} min={new Date().toISOString().split("T")[0]} required /></div>
              <div><label>Time</label><input type="time" name="time" value={contact.time} onChange={handleInput} required /></div>
            </div>
            <button type="submit" className="btn-submit" style={{ marginTop: "20px", width: "100%", padding: "14px", fontWeight: "bold" }}>Book Now</button>
          </form>
        </section>
      </div>
    </section>
  );
};