import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/translate";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import RegisterStudent from "./pages/RegisterStudent";
import WashermanSelection from "./pages/WashermanSelection";
import StudentDashboard from "./pages/StudentDashboard";
import WashClothes from "./pages/WashClothes";
import WashermanDashboard from "./pages/WashermanDashboard";
import SummaryPage from "./pages/SummaryPage";
import Collectcloths from "./pages/Collectcloths";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/RegisterStudent" element={<RegisterStudent />} />
          <Route path="/WashermanSelection" element={<WashermanSelection />} />
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
          <Route path="/WashClothes" element={<WashClothes />} />
          <Route path="/WashermanDashboard" element={<WashermanDashboard />} />
          <Route path="/Washerman/PrintSummary" element={<SummaryPage />} />
          <Route path="/Washerman/Collect" element={<Collectcloths />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
