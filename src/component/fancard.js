import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas"; // Import html2canvas to capture the div as an image

const MembershipCard = () => {
  const navigate = useNavigate();
  const [memberDetails, setMemberDetails] = useState({
    nickname: "",
    socialHandle: "",
    fanSince: "",
    badge: "",
    nationality: "",
    profilePhoto: "",
    fanNo: "",
  });
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(null); // For handling errors

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/"); // Redirect if no userId found
      return;
    }

    const fetchMemberDetails = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        const res = await fetch(`https://pellerserver.onrender.com/member?userId=${userId}`);
        const data = await res.json();

        if (res.ok) {
          setMemberDetails({
            nickname: data.nickname,
            socialHandle: data.socialHandle,
            fanSince: data.fanSince,
            badge: data.badge,
            nationality: data.nationality,
            profilePhoto: data.profilePhoto || "/default-avatar.png", // Default image if profile photo is not available
            fanNo: data.fanNo,
          });
        } else {
          throw new Error(data.message || "Error fetching member details");
        }
      } catch (err) {
        setError(err.message); // Set the error message
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchMemberDetails();
  }, [navigate]);

  // Function to download the membership card as a JPEG
  const handleDownload = () => {
    const cardElement = document.getElementById("membership-card");
    html2canvas(cardElement).then((canvas) => {
      const imageUrl = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "membership-card.jpg"; // File name for download
      link.click();
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetching fails
  }

  return (
    <div className="membership-card-container">
      <button className="download-button" onClick={handleDownload}>
        Download Card
      </button>
      <div id="membership-card" className="membership-card">
        <div className="membership">
          {/* Header Section */}
          <div className="card-header">
            <h2>Peller Nation ID</h2>
            <p className="member-no">Fan No: {memberDetails.fanNo}</p>
          </div>
          {/* Body Section */}
          <div className="card-body">
            <div className="card-details">
              <p><strong>Nickname:</strong> {memberDetails.nickname}</p>
              <p><strong>Social Handle:</strong> {memberDetails.socialHandle}</p>
              <p><strong>Fan Since:</strong> {memberDetails.fanSince}</p>
              <p><strong>Badge/Rank:</strong> {memberDetails.badge}</p>
              <p><strong>Nationality:</strong> {memberDetails.nationality}</p>
            </div>
            <div className="card-photo">
              <img
                src={memberDetails.profilePhoto}
                alt="Profile"
                className="profile-photo"
              />
            </div>
          </div>
          {/* Footer Section with Social Media Icons */}
          <div className="card-footer">
            <FaFacebook className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaInstagram className="social-icon" />
            <FaTiktok className="social-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
