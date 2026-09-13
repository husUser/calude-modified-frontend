import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRotue/PrivateRoute.jsx";

// Import Pages
import DashBoard from "./pages/DashBoard/DashBoard";
import LogInSignUp from "./pages/LogInSignUp/LogInSignUp";
import BookingTable from "./pages/BookingTable/BookingTable";
import VerifyRequest from "./pages/verifyRequestPage/VerifyRequest";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Layout from "./components/LayOut/LayOut";
import About from "./pages/AboutPage/AboutPage";
import Information from "./pages/InformationDesk/Information";
import ProfessorDashboard from "./pages/ProffesorsDashboard/ProfessorDashboard";
import StudentsDashBoard from "./pages/StudentDashBoard/StudentsDashBoard";
import OperatorDashBoard from "./pages/OperatorsDashBoard/OperatorDashBoard";
import Verify from "./pages/VerifyPage/Verify.jsx";
import EquipmentBlocking from "./pages/BlockEquipmentSlot/EquipmentBlocking.jsx"
import UpdateEquipStatus from "./pages/UpateEquipmentStatus/UpdateEquipStatus.jsx"
import AddEquipment from "./pages/AddEquipment/AddEquipment.jsx"
import EmailForPassword from "./pages/EmailForPassword/EmailForPassword.jsx"
import ProfessorLogIn from "./pages/ProfessorLogIn/ProfessorLogIn.jsx"
import EmailForPasswordForProfessors from "./pages/EmailForPassword/EmailForPasswordForProfessors.jsx"
import AddProfessors from "./pages/AddProfessors/AddProfessors.jsx"
import ListOfUsers from "./pages/ListOfUsersForAdmin/ListOfUsers.jsx"
import UserRoleUpdater from "./pages/userRoleUpdator/UserRoleUpdater.jsx"
import DeleteRecords from "./pages/deleteOldRecords/DeleteRecords.jsx";
import OperatorUpdating from "./pages/OperatorUpdating/OperatorUpdating.jsx";
import ContactForm from "./pages/ContactForm/ContactForm.jsx"
import StudentConfirmation from "./pages/StudentConfirmation/StudentConfirmation.jsx";
import StudentsBookingDetail from "./pages/StudentsBookingDetailForProfessor/StudentsBookingDetail.jsx"
import ProfessorPasswordUpdator from "./pages/PasswordUpdator/ProfessorPasswordUpdator.jsx"
import PasswordUpdater from "./pages/PasswordUpdator/PasswordUpdater.jsx";
import Notification from "./pages/Notification/Notification.jsx"
import Acknowledgement from "./pages/Acknowledgment/Acknowledgment.jsx";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Public Routes (No authentication required) */}
      <Route path="/" element={<Layout><LogInSignUp /></Layout>} />
      <Route path="/login" element={<Layout><LogInSignUp /></Layout>} />
      <Route path="/signup" element={<LogInSignUp />} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/information" element={<Layout><Information /></Layout>} />
      <Route path="/ProfessorLogin" element={<Layout><ProfessorLogIn /></Layout>} />
      <Route path="/ProfessorEmailProvide" element={<Layout><EmailForPasswordForProfessors /></Layout>} />
      <Route path="/contactForCode" element={<Layout><ContactForm /></Layout>} />
      <Route path="/studentConfirmation/:userId"  element={<StudentConfirmation />}/>
      <Route path="/emailProvide" element={<EmailForPassword />} />
      <Route  path="/professorPasswordReset/:professorId"  element={<ProfessorPasswordUpdator />} />
      <Route path="/userPasswordReset/:userId" element={<PasswordUpdater />}/>
      <Route path="/ack" element={<Layout><Acknowledgement /></Layout>}/>
      {/* Protected Routes - Require Authentication */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Layout><DashBoard /></Layout>} />
        <Route path="/bookingTable" element={<BookingTable />} />
        <Route path="/professorDashboard" element={<Layout><ProfessorDashboard /></Layout>} />
        <Route path="/myBookings" element={<Layout><StudentsDashBoard /></Layout>} />
        <Route path="/operatorList" element={<Layout><OperatorDashBoard /></Layout>} />
        <Route path="/blockBooking" element={<Layout showFooter={false}><EquipmentBlocking /></Layout>} />
        <Route path="/EquipStatusUpdate" element={<Layout showFooter={false}><UpdateEquipStatus /></Layout>} />
        <Route path="/addEquipments" element={<Layout showFooter={false}><AddEquipment /></Layout>} />
        <Route path="/addProfessors" element={<Layout showFooter={false}><AddProfessors /></Layout>} />
        <Route path="/ListOfAllUsers" element={<Layout><ListOfUsers /></Layout>} />
        <Route path="/userRoleUpdate" element={<Layout><UserRoleUpdater /></Layout>} />
        <Route path="/deleteOldData" element={<Layout><DeleteRecords /></Layout>} />
        <Route path="/operatorUpdates/:resultId" element={<Layout><OperatorUpdating /></Layout>} />
        <Route path="/notification" element={<Layout><Notification /></Layout>} />
        <Route path="/professors/viewStudentBooking/:userId/:professorId" element={<Layout showHeader={false} showFooter={true}> <StudentsBookingDetail/></Layout>}
        />
      </Route>

      {/* Public Info Pages */}
      <Route path="/verify" element={<VerifyRequest />} />
      <Route path="/verifyLogIn" element={<Verify />} />

      {/* Redirect to Dashboard if No Match */}
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
};

export default RoutesConfig;
