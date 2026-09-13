import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../Utility/urlInstance.js";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import {BeatLoader} from 'react-spinners'
import classes from './AddProfessors.module.css'
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal/ConfirmDeleteModal";

// import Spinner from 'react-bootstrap/spi';
function AddProfessors() {
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState("");
  const [success, setHandleSuccess] = useState("");
  const [professors, setProfessors] = useState("");
  const [message, setMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  //!   ---------------------
  const [registerProf, setProfData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    labName: "",
    labRoomNumber: "",
    password:""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Clear previous messages
    setHandleError(""); 
    setHandleSuccess(""); 
  
    try {
      const response = await axiosInstance.post("/professors/createProfessorProfile", registerProf);
      
      // Show success toast notification
      toast.success(response?.data.message);
      // Optionally, you can call this function after success
      getProfessorsDetail();
    } catch (error) {
  
      
      // Show error toast notification
      toast.error(error.response?.data.errors || "email already in use  please try again");
    } finally {
      setLoading(false);
    }
  };

 //* -----------------------
  let handleProfessorDetails = (e) => {
    switch (e.target.name) {
      case "firstName":
        setProfData((pre) => {
          return { ...pre, firstName: e.target.value };
        });
        break;
      case "lastName":
        setProfData((pre) => {
          return { ...pre, lastName: e.target.value };
        });
        break;
      case "email":
        setProfData((pre) => {
          return { ...pre, email: e.target.value };
        });
        break;
      case "labName":
        setProfData((pre) => {
          return { ...pre, labName: e.target.value };
        });
        break;
      case "labRoomNumber":
        setProfData((pre) => {
          return { ...pre, labRoomNumber: e.target.value };
        });
        break;
      case "password":
        setProfData((pre) => {
          return { ...pre, password: e.target.value };
        });
        break;
      default:
        break;
    }
  };

   const getProfessorsDetail = async () => {
      try {
        const res = await axiosInstance.get(`/professors/getAllProfessors`);  
        if (res?.data.professors.length > 0) {
          setProfessors(res?.data?.professors);
        } else {
          setProfessors([]);
        }
      } catch (error) {
        setProfessors([]); 
      }
    };
    let toDelete = async (professorId) => {
      // let token = auth.token;
      try {
        setIsDeleting(true);
        await axiosInstance.delete(`/professors/deleteProfessorProfile/${professorId}`);
        // await axiosInstance.delete(`equipments/deleteEquipmentDetails/${equipmentId}`, { 
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        getProfessorsDetail();
      } catch (error) {
        console.error("Error deleting answer:", error.message);
      } finally {
        setIsDeleting(false);
      }
    };

    const handleDeleteClick = (professorId) => {
      setSelectedProfessorId(professorId);
      setDeleteModalOpen(true);
    };

    const handleDeleteCancel = () => {
      setDeleteModalOpen(false);
      setSelectedProfessorId(null);
    };

    const handleDeleteContinue = async () => {
      if (selectedProfessorId) {
        await toDelete(selectedProfessorId);
      }
      setDeleteModalOpen(false);
      setSelectedProfessorId(null);
    };

      useEffect(() => {
        getProfessorsDetail();
      }, []);
// table section 
const columns = [
  { field: 'firstName', headerName: 'First Name', width: 130 },
  { field: 'lastName', headerName: 'Last Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 220 },
  { field: 'labName', headerName: 'Lab Name', width: 180 },
  { field: 'labRoomNumber', headerName: 'Lab Room No.', width: 150 },
  {
    field: 'action',
    headerName: 'Action',
    renderCell: (params) => (
      <>
      <Button
        style={{ margin: "5px" }}
        onClick={() => handleDeleteClick(params?.row.id)}
        variant="danger"
      >
        Delete
      </Button>
     
      </>
    ),
    width: 150,
  },
];

const paginationModel = { page: 0, pageSize: 10 };
  return (
   <div className={classes.mainDash}>
       <MDBContainer fluid  className="p-5 container">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3 text-white">
           Add <br />
            <span className="text-warning">Professor Profile</span>
          </h1>
          {/* <span>{error&&error.message}</span> */}
          <h5
            className="px-3"
            style={{ color: "#F5F5F5", textAlign: "justify" }}
          >
               Please enter the professor's details in the designated space. Be sure to double-check the information and refer to the example provided in the label if needed. . <b style={{color:"red"}}>no need to add Dr.</b> on first name as it will be automatically added, email must contain @ch.iitr.ac.in, first name and last name cant take space or special character.
          </h5>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <MDBCard className="">
            <MDBCardBody
              className="p-5 position-relative overflow-hidden"
              style={{ height: "600px" }}
            >
            <div
                className="form-transition-container"
                style={{
                  position: "absolute",
                  width: "80%",
                  height: "100%",
                  top: 0,
                  left: "0%",
                  padding: "6% 0 0 20%",
                }}
              >
                {/* Login Form */}
                <div className="auth-form mt-5">
                  {handleError && (
                    <span className="text-danger fw-bold">{handleError}</span>
                  )}
                  {success && (
                    <span className="text-success fw-bold">{success}</span>
                  )}
                  <form onSubmit={handleSubmit}>
                    <h2 className="mb-4">Insert Profile Details </h2>
                    <MDBInput
                      wrapperClass="mb-4"
                      label="First name"
                      id="email-login"
                      type="text"
                      name="firstName"
                      onChange={handleProfessorDetails}
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Last name"
                      id="email-login"
                      type="text"
                      name="lastName"
                      onChange={handleProfessorDetails}
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="email (IITR)"
                      id="email-login"
                      type="text"
                      name="email"
                      onChange={handleProfessorDetails}
                    />
                     <MDBInput
                      wrapperClass="mb-4"
                      label="password"
                      id="email-login"
                      type="text"
                      name="password"
                      onChange={handleProfessorDetails}
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Lab name"
                      id="email-login"
                      type="text"
                      name="labName"
                      onChange={handleProfessorDetails}
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Lab room Number"
                      id="email-login"
                      type="text"
                      name="labRoomNumber"
                      onChange={handleProfessorDetails}
                    />
                    <MDBBtn
                      className="w-100 mb-4"
                      size="md"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <BeatLoader /> : "Add Professor Profile"}
                    </MDBBtn>
                  </form>
            
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <div className={`${classes.listContainer}`}>
  <h2 className={`text-center text-decoration-underline m-4 ${classes.listTitle}`}>List of Professors</h2>


  {professors?.length > 0 ? (
    // professors.map((singleProfessor, i) => (
    //   <div key={i} className={`${classes.equipment_row} text-white mb-3`}>
    
    //     <div className={`${classes.equipment_item} col-12 col-md-3`}>
    //       <strong>Prof. First Name:</strong> {singleProfessor?.firstName}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-3`}>
    //       <strong>Prof. Last Name:</strong> {singleProfessor?.lastName}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-3 ${classes.guideline}`}>
    //       <strong>Prof. email:</strong> {singleProfessor?.email}
    //     </div>
     
    //     <div className={`${classes.equipment_item} col-12 col-md-2`}>
    //       <strong>Prof. lab room number:</strong> {singleProfessor?.labRoomNumber}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-2`}>
    //       <strong>Prof. Lab Name:</strong> {singleProfessor?.labName}
    //     </div>
    //     <div>
    //       <Button className="m-4" onClick={() => toDelete(singleProfessor?.professorId)} variant="danger">
    //         Delete Prof. profile
    //       </Button>
    //     </div>
    //   <h1>-------------------------------------------------------------------------</h1>
    //   </div>    
    // ))
    <Paper sx={{ height: '90%', width: '96%', margin: '2%' }}>
      {/* Conditionally render the message for admin users */}
      {message && (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
          {message}
        </div>
      )}
      <DataGrid
        rows={professors?.map(user => ({
          id: user.professorId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          labName: user.labName,
          labRoomNumber:user.labRoomNumber
        }))}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection={false}
        loading={loading}
        sx={{ border: 2 }}
      />
    </Paper>
  ) : (
    <h3 className="text-center text-white">No Professor Detail Added so far.</h3>
  )}
</div>
<ToastContainer />
    </MDBContainer>
  <ConfirmDeleteModal
    open={deleteModalOpen}
    onCancel={handleDeleteCancel}
    onContinue={handleDeleteContinue}
    message="Are you sure you want to delete this item?"
    loading={isDeleting}
  />
   </div>
  );
}

export default AddProfessors;
