import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying payment...");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const verifyPayment = async () => {
      const userId = searchParams.get("userId");
      const reference = searchParams.get("reference");

      console.log("userId from URL:", userId);
      console.log("reference from URL:", reference);

      // Check if both userId and reference are available
      if (!userId || !reference) {
        setMessage("Invalid payment details.");
        setLoading(false);
        return;
      }

      try {
        // Call backend to verify payment with the reference and userId
        const response = await axios.post("https://pellerserver.onrender.com/verify-payment", {
          reference,
          userId,
        });

        if (response.data.success) {
          setMessage("Payment successful! Your membership is confirmed.");
          
          // Check if the membership status is active or properly updated before redirecting
          if (response.data.membershipStatus === "active") {
            // Redirect to membership card page after successful payment and membership confirmation
            setTimeout(() => {
              navigate("/member"); // Redirect to the membership card page
            }, 2000); // 2-second delay for message display
          } else {
            setMessage("Membership status is not active. Please contact support.");
          }
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
  }, [searchParams, navigate]); // Added navigate to dependencies

  return (
    <div>
      <h2>{loading ? "Verifying Payment..." : message}</h2>
    </div>
  );
};

export default PaymentSuccess;
