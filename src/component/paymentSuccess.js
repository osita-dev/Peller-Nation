import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const userId = searchParams.get("userId");
      const reference = searchParams.get("reference");

      if (!userId || !reference) {
        setMessage("Invalid payment details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post("https://pellerserver.onrender.com/verify-payment", {
          reference,
          userId,
        });

        if (response.data.success) {
          setMessage("Payment successful! Your membership is confirmed.");

          // Store success in localStorage
          localStorage.setItem("paymentVerified", "true");

          setTimeout(() => {
            navigate("/membership-form"); // Redirect back to form
          }, 2000);
        } else {
          setMessage("Payment verification failed.");
        }
      } catch (error) {
        setMessage("Error verifying payment. Please try again.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>{loading ? "Verifying Payment..." : message}</h2>
    </div>
  );
};

export default PaymentSuccess;
