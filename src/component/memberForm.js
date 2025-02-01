import React, { useState, useEffect } from "react";

const MembershipForm = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    tiktokHandle: "",
    fanSince: "",
    badge: "500",
    nationality: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("paymentVerified");
    if (verified === "true") {
      setPaymentVerified(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files) {
      setImagePreview(URL.createObjectURL(files[0]));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch("https://pellerserver.onrender.com/submit-form", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (result.success && result.userId) {
        setUserId(result.userId);

        const paymentResponse = await fetch("https://pellerserver.onrender.com/generate-payment-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: result.userId,
            amount: formData.badge,
          }),
        });

        const paymentData = await paymentResponse.json();

        if (paymentData.paymentLink) {
          window.location.href = paymentData.paymentLink;
        } else {
          alert("Error generating payment link: " + (paymentData.error || "Unknown error"));
        }
      } else {
        alert("Error: userId is missing from response");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.nickname &&
      formData.tiktokHandle &&
      formData.fanSince &&
      formData.nationality &&
      formData.image
    );
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Membership Form</h1>

      {paymentVerified ? (
        <div className="success-message">
          ✅ Your membership is verified! You can now proceed.
        </div>
      ) : (
        <form className="membership-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <label className="form-label">
            Nickname:
            <input
              className="form-input"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-label">
            Social Handle:
            <input
              className="form-input"
              type="text"
              name="tiktokHandle"
              value={formData.tiktokHandle}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-label">
            Fan Since:
            <input
              className="form-input"
              type="text"
              name="fanSince"
              value={formData.fanSince}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-label">
            Badge:
            <select
              className="form-select"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
            >
              <option value="500">Fan (₦500)</option>
              <option value="1000">Mega Fan (₦1000)</option>
              <option value="1500">Ultimate Fan (₦1500)</option>
            </select>
          </label>
          <label className="form-label">
            Nationality:
            <input
              className="form-input"
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-label">
            Profile Photo:
            <input
              className="form-input"
              type="file"
              name="image"
              onChange={handleChange}
              required
            />
          </label>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Profile Preview" width="100" height="100" />
            </div>
          )}

          <button
            className="form-button"
            type="submit"
            disabled={loading || !isFormValid()}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default MembershipForm;
