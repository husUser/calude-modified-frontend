import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../Utility/urlInstance.js";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { BeatLoader } from "react-spinners";
import { useParams } from 'react-router-dom';

function OperatorUpdating() {
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState("");
  const [success, setHandleSuccess] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
 
  const { resultId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setHandleError("");
    setHandleSuccess("");
    
    if (!resultId || !selectedStatus) {
      setHandleError("Please select status for updating");
      return;
    }
  
    setLoading(true);
    try {
      await axiosInstance.post(`/result/statusUpdateByOperator`, {
        operatorStatusConfirmation: selectedStatus,
        resultId
      });
  
      setHandleSuccess("Booking Status updated successfully.");
    } catch (error) {
      setHandleError(
        error.response?.data?.errors?.[0] || "Failed to update status."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <MDBContainer fluid className="p-4 container">
      <MDBRow>
        <MDBCol md="6" className="text-center text-md-start">
          <h1 className="my-5 display-3 fw-bold text-white">
            Update <span className="text-warning">Booking Status</span>
          </h1>
          <h5 className="text-white">
          Here, you can update the status of the analysis. This will send a message to the student about the status of the sample analysis on their dashboard.
          </h5>
        </MDBCol>

        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody className="p-5">
              <form onSubmit={handleSubmit}>
                <h2 className="mb-4">Update Booking Status</h2>
                <select
                  className="form-select mb-4"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="completed">completed</option>
                  <option value="technical issue">technical issue</option>
                  <option value="sample issue">sample issue</option>
                  <option value="in progress">in progress</option>
                  <option value="student was absent on slot time">student was absent on slot time</option>
                </select>

                <MDBBtn className="w-100 mb-4" size="md" type="submit" disabled={loading}>
                  {loading ? <BeatLoader size={8} color="#ffffff" /> : "Update Status"}
                </MDBBtn>

                {handleError && <p className="text-danger fw-bold">{handleError}</p>}
                {success && <p className="text-success fw-bold">{success}</p>}
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default OperatorUpdating;
