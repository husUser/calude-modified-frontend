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
import classes from "./UpdateEquipStatus.module.css";
import Button from "react-bootstrap/Button";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from "react-toastify";
function UpdateEquipStatus() {
  const [loading, setLoading] = useState(false);
  const [handleError, setHandleError] = useState("");
  const [success, setHandleSuccess] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(""); // Store selected equipment ID
  const [visibility, setVisibility] = useState(""); // Store visibility status
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchEquipmentList = async () => {
      try {
        const response = await axiosInstance.get(
          "/equipments/getAllEquipmentDetails",
        );
        setEquipments(response?.data.data);
      } catch (error) {
        console.error("Error fetching equipment details:", error);
      }
    };

    fetchEquipmentList();
  }, []);

  const filteredEquipments = equipments.filter(
    (equipment) => equipment.workingStatus === true,
  );
  const notWorkingEquipments = equipments.filter(
    (equipment) => equipment.workingStatus === false,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "equipment") {
      setSelectedEquipment(value);
    } else if (name === "visibility") {
      setVisibility(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEquipment) {
      setHandleError("Please select  equipment");
      return;
    }

    setLoading(true);
    try {
      setHandleError(""); // Reset error
      setHandleSuccess(""); // Reset success message

      // Update the server with the visibility status
      await axiosInstance.patch(`/equipments/updateEquipmentWorkingStatus`, {
        equipmentId: selectedEquipment,
        workingStatus: "false",
      });

      // Update equipment state to move the equipment from visible list to invisible
      setEquipments(
        equipments.map((equipment) =>
          equipment.equipmentId === selectedEquipment
            ? { ...equipment, workingStatus: false }
            : equipment,
        ),
      );

      setHandleSuccess("Equipment visibility updated successfully.");
    } catch (error) {
      setHandleError(error.response?.data?.errors?.[0] || "Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeVisible = async (equipmentId) => {
    try {
      await axiosInstance.patch(`/equipments/updateEquipmentWorkingStatus`, {
        equipmentId,
        workingStatus: "true",
      });

      // Update equipment state to move the equipment from invisible list to visible
      setEquipments(
        equipments.map((equipment) =>
          equipment.equipmentId === equipmentId
            ? { ...equipment, workingStatus: true }
            : equipment,
        ),
      );
    } catch (error) {
      console.error("Error making equipment visible:", error);
    }
  };
  // table section
  const columns = [
    { field: "equipmentName", headerName: "Equipment model", width: 200 },
    { field: "equipmentModel", headerName: "Equipment model", width: 200 },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <>
          <Button
            style={{ margin: "5px" }}
            onClick={() => handleMakeVisible(params?.row.id)}
            variant="danger"
          >
            Make Visible
          </Button>
          <ToastContainer />
        </>
      ),
      width: 150,
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <>
      <div className={classes.mainDash}>
        <MDBContainer fluid className="p-5 container">
          <MDBRow>
            <MDBCol md="6" className="text-center text-md-start">
              <h1 className="my-3 display-3 fw-bold text-white">
                Update <span className="text-warning">Equipment Status</span>
              </h1>
              <h5 className="text-white">
                By specifying the equipment name and its working status, you can
                control its visibility to users. If you set the visibility to{" "}
                <span style={{ color: "black" }}>
                  <b>Invisible</b>
                </span>
                , the equipment will not be available for booking, preventing
                users from selecting it. On the other hand, if the visibility is
                set to{" "}
                <span style={{ color: "black" }}>
                  <b>Visible</b>
                </span>
                , the equipment will be shown as available and users will be
                able to book it.
              </h5>
            </MDBCol>

            <MDBCol md="6">
              <MDBCard>
                <MDBCardBody className="p-5">
                  <form onSubmit={handleSubmit}>
                    <h2 className="mb-4">Select Equipment</h2>

                    {/* Equipment selection */}
                    <select
                      className="form-select mb-4"
                      name="equipment"
                      value={selectedEquipment}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select Equipment
                      </option>
                      {filteredEquipments?.map((equipment) => (
                        <option
                          key={equipment.equipmentId}
                          value={equipment.equipmentId}
                        >
                          {equipment.equipmentName}
                        </option>
                      ))}
                    </select>

                    <MDBBtn
                      className="w-100 mb-4"
                      size="md"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <BeatLoader size={8} color="#ffffff" />
                      ) : (
                        "Make Equipment Invisible"
                      )}
                    </MDBBtn>

                    {/* Error and success messages */}
                    {handleError && (
                      <p className="text-danger fw-bold">{handleError}</p>
                    )}
                    {success && (
                      <p className="text-success fw-bold">{success}</p>
                    )}
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>

          <div className={`${classes.listContainer}`}>
            {/* sx={{ height: "90%", width: "80%", margin: "1% auto" }} */}
            <h2
              className={`text-center text-decoration-underline m-4 ${classes.listTitle}`}
            >
              List of Invisible Equipments
            </h2>
            {notWorkingEquipments.length > 0 ? (
              <Paper
                sx={{
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {/* Conditionally render the message for admin users */}
                {message && (
                  <div
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {message}
                  </div>
                )}
                <DataGrid
                  rows={notWorkingEquipments?.map((equipment) => ({
                    id: equipment.equipmentId,
                    equipmentName: equipment.equipmentName,
                    equipmentModel: equipment.equipmentModel,
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
              <h3 className="text-center text-white">
                No Equipment marked as Invisible.
              </h3>
            )}
          </div>
        </MDBContainer>
      </div>
    </>
  );
}

export default UpdateEquipStatus;
