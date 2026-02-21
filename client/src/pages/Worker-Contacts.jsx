import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import "./Styles/Worker.css";
import { toast } from "react-toastify";

export const WorkerContacts = () => {
  const [contactData, setContactData] = useState([]);
  const { authorizationToken, user } = useAuth();

  const getContactsData = async () => {
    try {
      const response = await fetch(
        "https://gig-swap-hsp-backend.vercel.app/api/worker/contacts",
        {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setContactData(data);
      }
    } catch (error) {
      console.log("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    getContactsData();
  }, []);

  const handleStatus = async (id, status) => {
    const isConfirmed = window.confirm(`Kya aap is booking ko "${status}" mark karna chahte hain?`);
    
    if (isConfirmed) {
      try {
        const response = await fetch(`https://gig-swap-hsp-backend.vercel.app/api/worker/update-status/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({ 
            status: status, 
            workerName: user.username 
          }),
        });

        if (response.ok) {
          toast.success(`Status updated to ${status}`);
          getContactsData(); 
        } else {
          toast.error("Status update fail ho gaya");
        }
      } catch (error) {
        console.log("Error updating status:", error);
        toast.error("Server error!");
      }
    }
  };

  return (
    <section className="worker-contacts-section">
      <h1 className="main-heading">Service Jobs for You</h1>

      <div className="container worker-contacts">
        {contactData.map((cur) => {
          const { username, message, address, mapLink, time, date, _id, status, acceptedBy } = cur;
          const isLockedByOthers = acceptedBy && acceptedBy !== user.username;

          return (
            <div key={_id} className="contact-card" style={{ opacity: isLockedByOthers ? 0.6 : 1 }}>
              <p><strong>Customer:</strong> {username}</p>
              <p><strong>Service:</strong> {message}</p>
              <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {time}</p>
              
              {/* ✅ Area aur Clickable Map Link */}
              <p><strong>Area:</strong> <span style={{color: "#e67e22", fontWeight: "bold"}}>{address}</span></p>
              <p>
                <strong>Map Direction:</strong>{" "}
                {mapLink ? (
                  <a href={mapLink} target="_blank" rel="noreferrer" style={{ color: "#27ae60", fontWeight: "bold", textDecoration: "underline" }}>
                    Open Navigation 📍
                  </a>
                ) : (
                  <span>Link not available</span>
                )}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${status || "Pending"}`}>
                  {status || "Pending"} 
                  {isLockedByOthers && ` (Taken by ${acceptedBy})`}
                </span>
              </p>

              <div className="status-buttons">
                {isLockedByOthers ? (
                  <p style={{ color: "#d9534f", fontWeight: "bold", marginTop: "10px" }}>
                    Already Taken
                  </p>
                ) : (
                  <>
                    <button 
                      className="btn accept" 
                      onClick={() => handleStatus(_id, "Accepted")}
                      disabled={status === "Accepted"}
                    >
                      {status === "Accepted" ? "Accepted" : "Accept Job"}
                    </button>

                    <button 
                      className="btn completed" 
                      onClick={() => handleStatus(_id, "Completed")}
                      disabled={status === "Completed"}
                    >
                      Mark Completed
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};