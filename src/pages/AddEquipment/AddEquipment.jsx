import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { axiosInstance } from "../../Utility/urlInstance.js";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea
} from "mdb-react-ui-kit";
import { BeatLoader } from "react-spinners";
import classes from "./AddEquipment.module.css"
import Button from "react-bootstrap/Button";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal/ConfirmDeleteModal";
// !-------------------------
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
// !----------------------


function AddEquipment() {
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState("");
  const [operator, setOperator] = useState([]);
  const [success, setHandleSuccess] = useState("");
  const [Equipments, setEquipments] = useState([]);
    const [message, setMessage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [signUpData, setSignUpData] = useState({
    equipmentName: "",
    equipmentModel: "",
    guidelines: "",
    maxSamples: "",
    maxBookingsPerTwoWeeks: "",
    operatorId: "",
    workingStatus: true, // assuming default to true
  });

  // Fetch operators on component mount
  useEffect(() => {
    const getOperators = async () => {
      try {
        const response = await axiosInstance.get("/equipments/getOperator");
        setOperator(response?.data.users || []);
      } catch (error) {
        console.error("Error fetching operators", error);
      }
    };
    getOperators();
  }, []);

  const handleOperatorChange = (userId) => {
    setSignUpData((prev) => ({ ...prev, operatorId: userId }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
        await axiosInstance.post("/equipments/equipmentDetails", signUpData);
  
      // Display success toast
      toast.success("Equipment Added Successfully");
      getEquipmentList();
    } catch (error) {
      // Display error toast
      toast.error("Failed to add equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const getEquipmentList = async () => {
    try {
      const res = await axiosInstance.get(`/equipments/getAllEquipmentDetails`);
      if (res?.data.data.length > 0) {
        setEquipments(res?.data.data);
      } else {
        setEquipments([]);
      }
    } catch (error) {
   
      setEquipments([]); 
    }
  };

  let toDelete = async (equipmentId) => {
    // let token = auth.token;
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/equipments/deleteEquipmentDetails/${equipmentId}`);
      // await axiosInstance.delete(`equipments/deleteEquipmentDetails/${equipmentId}`, { 
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      getEquipmentList();
    } catch (error) {
      console.error("Error deleting answer:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (equipmentId) => {
    setSelectedEquipmentId(equipmentId);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedEquipmentId(null);
  };

  const handleDeleteContinue = async () => {
    if (selectedEquipmentId) {
      await toDelete(selectedEquipmentId);
    }
    setDeleteModalOpen(false);
    setSelectedEquipmentId(null);
  };

  useEffect(() => {
    getEquipmentList();
  }, []);
// table section 
const columns = [
  { field: 'equipmentName', headerName: 'Equipment Name', width: 130 },
  { field: 'equipmentModel', headerName: 'Equipment Model', width: 130 },
  { field: 'guidelines', headerName: 'Guideline', width: 220 },
  { field: 'maxBookingsPerTwoWeeks', headerName: 'Max. Booking per 2 weeks ', width: 180 },
  { field: 'maxSamples', headerName: 'Max. samples.', width: 150 },
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
  <div className={`${classes.mainDash} d-flex flex-column`}>
    <MDBContainer fluid className="p-4 container">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3 text-white">
            Add <br />
            <span className="text-warning">Equipments</span>
          </h1>

          <h5 className="px-3" style={{ color: "#F5F5F5", textAlign: "justify" }}>
            Please enter the equipment details in the designated space. Be sure to double-check the information, as it will be used by students for publication purposes. The equipment information should include the Equipment Model (e.g., name with model, company, and country e.g., GC-MS 11256, Agilent, USA).
          </h5>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <MDBCard>
            <MDBCardBody
              className="p-5 position-relative overflow-hidden"
              style={{ height: "650px" }}
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
                <div className="auth-form mt-1">
                  {handleError && <span className="errorDisplay fw-bold">{handleError}</span>}
                  {success && <p className="text-success fw-bold">{success}</p>}
                  <form onSubmit={handleSubmit}>
                    <h2 className="mb-4">Insert Details</h2>
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Equipment Name"
                      type="text"
                      name="equipmentName"
                      onChange={handleInputChange}
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Equipment Model"
                      type="text"
                      name="equipmentModel"
                      onChange={handleInputChange}
                    />
                    <MDBTextArea
                      wrapperClass="mb-4"
                      label="Guideline (600 characters)"
                      type="text"
                      name="guidelines"
                      maxLength="600"
                      onChange={handleInputChange}
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Max. Samples per slot"
                      type="text"
                      name="maxSamples"
                      onChange={handleInputChange}
                    />
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Max. Bookings (2 weeks)"
                      type="text"
                      name="maxBookingsPerTwoWeeks"
                      onChange={handleInputChange}
                    />

                    <select
                      className="form-select mb-4"
                      onChange={(e) => handleOperatorChange(e.target.value)}
                      value={signUpData.operatorId}
                      required
                    >
                      <option value="" disabled>
                        Select Operator
                      </option>
                      {operator?.map((op) => (
                        <option key={op.userId} value={op.userId}>
                          {op.email}
                        </option>
                      ))}
                    </select>

                    <MDBBtn
                      className="w-100 mb-4"
                      size="md"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <BeatLoader /> : "Add Equipment"}
                    </MDBBtn>
                  </form>
              
                </div>
                <ToastContainer />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

   <div className={`${classes.listContainer}`}>
  <h2 className={`text-center text-decoration-underline m-4 ${classes.listTitle}`}>List of Equipment</h2>

  {Equipments?.length > 0 ? (

<Paper sx={{ height: '90%', width: '96%', margin: '2%' }}>
{/* Conditionally render the message for admin users */}
{message && (
  <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
    {message}
  </div>
)}
<DataGrid
  rows={Equipments?.map(singleEquipment => ({
    id:singleEquipment.equipmentId,
    equipmentName: singleEquipment.equipmentName,
    equipmentModel: singleEquipment.equipmentModel,
    guidelines: singleEquipment.guidelines,
    maxBookingsPerTwoWeeks: singleEquipment.maxBookingsPerTwoWeeks,
    maxSamples:singleEquipment.maxSamples,
    operatorName:singleEquipment.operatorName
  }))}
  columns={columns}
  initialState={{ pagination: { paginationModel } }}
  pageSizeOptions={[5, 10]}
  checkboxSelection={false}
  loading={loading}
  sx={{ border: 2 }}
/>
</Paper>
    // Equipments.map((singleEquipment, i) => (
    //   <div key={i} className={`${classes.equipment_row} text-white mb-3`}>
    
    //     <div className={`${classes.equipment_item} col-12 col-md-3`}>
    //       <strong>Equipment Name:</strong> {singleEquipment?.equipmentName}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-3`}>
    //       <strong>Equipment Model:</strong> {singleEquipment?.equipmentModel}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-4 ${classes.guideline}`}>
    //       <strong>Equipment Guideline:</strong> {singleEquipment?.guidelines}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-2`}>
    //       <strong>Allowed booking per week:</strong> {singleEquipment?.maxBookingsPerTwoWeeks}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-2`}>
    //       <strong>Max sample per slot:</strong> {singleEquipment?.maxSamples}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-3`}>
    //       <strong>Equipment Operator:</strong> {singleEquipment?.operatorName}
    //     </div>
    //     <div className={`${classes.equipment_item} col-12 col-md-3`}>
    //       <strong>Equipment Operator:</strong> {singleEquipment?.operatorName}
    //     </div>

    //     <div>
    //       <Button className="m-4" onClick={() => toDelete(singleEquipment?.equipmentId)} variant="danger">
    //         Delete Equipment
    //       </Button>
    //     </div>
    //   <h1>-----------------------------------------------------------------------------</h1>
    //   </div>    
    // ))
  
  ) : (
    <h3 className="text-center text-white">No Equipment Detail uploaded so far.</h3>
  )}
</div>

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

export default AddEquipment;

