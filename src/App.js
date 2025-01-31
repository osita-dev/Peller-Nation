import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MembershipForm from "./component/memberForm";
import MembershipCard from "./component/fancard";
import PaymentSuccess from "./component/paymentSuccess";
import NotFound from "./component/notfound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MembershipForm />} />
        <Route path="/member" element={<MembershipCard />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} /> {/* 404 route */}
      </Routes>
    </Router>
  );
};

export default App;
