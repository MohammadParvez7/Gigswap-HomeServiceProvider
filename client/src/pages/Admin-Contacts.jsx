import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import "./Styles/Admin.css";
import { toast } from "react-toastify";

export const AdminContacts = () => {
  const [contactData, setContactData] = useState([]);
  const { authorizationToken } = useAuth();

  const getContactsData = async () => {
    try {
      const response = await fetch("https://gigswap-home-service-provider-serve.vercel.app/api/admin/contacts", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setContactData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContactById = async (id) => {
    try {
      const response = await fetch(`https://gigswap-home-service-provider-serve.vercel.app/api/admin/contacts/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (response.ok) {
        getContactsData();
        toast.success("Booking deleted successfully");
      } else {
        toast.error("Not Deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContactsData();
  }, []);

  return (
    <section className="admin-contacts-section">
      <h1 className="main-heading">Booked Services</h1>

      <div className="container admin-contacts-grid">
        {contactData.map((curContactData, index) => {
          const { username, email, message, address, mapLink, time, date, _id, status, acceptedBy } = curContactData;
          return (
            <div key={index} className="contact-card-responsive">
              <p><strong>Name:</strong> {username}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Service:</strong> {message}</p>
              <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
              <p>
              <strong>Time:</strong> {new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
              
              {/* ✅ Naya Address aur Map Logic */}
              <p><strong>Area:</strong> {address}</p>
              <p>
                <strong>Location:</strong>{" "}
                {mapLink ? (
                  <a href={mapLink} target="_blank" rel="noreferrer" className="location-link" style={{color: "#007bff", fontWeight: "bold", textDecoration: "underline"}}>
                    View Customer Location 📍
                  </a>
                ) : (
                  <span style={{color: "gray"}}>No Map Link Provided</span>
                )}
              </p>

              <div className="status-box">
                <p>
                  <strong>Current Status:</strong>{" "}
                  <span className={`status-text ${status}`}>
                    {status || "Pending"}
                  </span>
                </p>

                {(status === "Accepted" || status === "Completed") && acceptedBy && (
                  <p className="worker-info">
                    {status === "Accepted" ? " Accepted by: " : " Completed by: "} 
                    <strong>{acceptedBy}</strong>
                  </p>
                )}
              </div>

              {/* <button className="btn-delete" style={{marginTop: "10px", background: "#ff4d4d"}} onClick={() => deleteContactById(_id)}>
                Delete Booking
              </button> */}
            </div>
          );
        })}
      </div>
    </section>
  );
};