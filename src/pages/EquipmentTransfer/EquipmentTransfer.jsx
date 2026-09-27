import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { axiosInstance } from "../../Utility/urlInstance.js";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import Button2 from "react-bootstrap/Button";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./EquipmentTransfer.module.css";

// Small, local confirmation modal — same visual pattern as
// ConfirmDeleteModal, kept in this file since this feature is meant to
// stay isolated.
function ConfirmTransferModal({
  open,
  onCancel,
  onContinue,
  message,
  loading,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      PaperProps={{
        style: {
          backgroundColor: "#517894",
          color: "#ffffff",
        },
      }}
    >
      <DialogTitle style={{ color: "#ffffff" }}>
        Confirm Operator Update
      </DialogTitle>
      <DialogContent style={{ color: "#ffffff" }}>{message}</DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={loading}
          style={{ color: "#ffffff" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onContinue}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? "Updating..." : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EquipmentTransfer() {
  const [equipments, setEquipments] = useState([]);
  const [operators, setOperators] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  // Per-row selected operator: { [equipmentId]: operatorUserId }
  const [selectedOperatorByRow, setSelectedOperatorByRow] = useState({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState(null); // { equipmentId, equipmentName, operatorUserId, operatorLabel }
  const [submitting, setSubmitting] = useState(false);

  const authHeader = useAuthHeader();

  useEffect(() => {
    getEquipmentList();
    getOperators();
  }, []);

  const getEquipmentList = async () => {
    setPageLoading(true);
    try {
      const res = await axiosInstance.get(`/equipments/getAllEquipmentDetails`);
      setEquipments(res?.data?.data?.length > 0 ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching equipment details:", error);
      setEquipments([]);
    } finally {
      setPageLoading(false);
    }
  };

  const getOperators = async () => {
    try {
      const response = await axiosInstance.get("/equipments/getOperator");
      setOperators(response?.data?.users || []);
    } catch (error) {
      console.error("Error fetching operators", error);
      setOperators([]);
    }
  };

  const handleOperatorSelect = (equipmentId, operatorUserId) => {
    setSelectedOperatorByRow((prev) => ({
      ...prev,
      [equipmentId]: operatorUserId,
    }));
  };

  const handleUpdateOperatorClick = (equipment) => {
    const operatorUserId = selectedOperatorByRow[equipment.equipmentId];
    if (!operatorUserId) {
      toast.warning("Please select an operator first.");
      return;
    }
    const operator = operators.find((op) => op.userId === operatorUserId);

    setPendingTransfer({
      equipmentId: equipment.equipmentId,
      equipmentName: equipment.equipmentName,
      operatorUserId,
      operatorLabel: operator
        ? `${operator.firstName} (${operator.email})`
        : "the selected operator",
    });
    setConfirmOpen(true);
  };

  const handleCancelTransfer = () => {
    if (submitting) return;
    setConfirmOpen(false);
    setPendingTransfer(null);
  };

  const handleConfirmTransfer = async () => {
    if (!pendingTransfer) return;
    setSubmitting(true);
    try {
      const response = await axiosInstance.patch(
        `/equipments/transferOperator`,
        {
          equipmentId: pendingTransfer.equipmentId,
          operatorUserId: pendingTransfer.operatorUserId,
        },
        { headers: { Authorization: authHeader } },
      );

      toast.success(
        response?.data?.message || "Operator updated successfully.",
      );
      setConfirmOpen(false);
      setPendingTransfer(null);

      // Refresh the list so the newly assigned operator appears immediately
      await getEquipmentList();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update operator. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { field: "equipmentName", headerName: "Equipment Name", width: 180 },
    // { field: "equipmentModel", headerName: "Equipment Model", width: 180 },
    { field: "operatorName", headerName: "Current Operator", width: 160 },
    { field: "operatorEmail", headerName: "Operator Email", width: 200 },
    // { field: "operatorPhoneNumber", headerName: "Operator Phone", width: 150 },
    {
      field: "action",
      headerName: "Assign Operator",
      width: 360,
      sortable: false,
      renderCell: (params) => (
        <div className={classes.actionCell}>
          <select
            className="form-select"
            style={{
              width: "170px",
              display: "inline-block",
              marginRight: "8px",
            }}
            value={selectedOperatorByRow[params.row.id] || ""}
            onChange={(e) =>
              handleOperatorSelect(params.row.id, e.target.value)
            }
          >
            <option value="" disabled>
              Select Operator
            </option>
            {operators?.map((op) => (
              <option key={op.userId} value={op.userId}>
                {op.firstName} ({op.email})
              </option>
            ))}
          </select>
          <Button2
            size="sm"
            variant="primary"
            onClick={() => handleUpdateOperatorClick(params.row)}
          >
            Update Operator
          </Button2>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className={classes.mainDash}>
      <MDBContainer fluid className="p-5 container">
        <MDBRow>
          <MDBCol md="6" className="text-center text-md-start">
            <h1 className="my-5 display-3 fw-bold text-white">
              Equipment <span className="text-warning">Operator Transfer</span>
            </h1>
            <h5 className="text-white">
              Operators rotate periodically between equipment. Select an
              operator for a piece of equipment and confirm to reassign it.
              Operator name, email, and phone number are always taken directly
              from the selected user's account.
            </h5>
          </MDBCol>

          {/* <MDBCol md="6">
            <MDBCard>
              <MDBCardBody className="p-5">
                <h2 className="mb-4">How it works</h2>
                <h5>
                  Pick an operator from the dropdown next to a piece of
                  equipment in the table below, then click{" "}
                  <b>Update Operator</b>. You'll be asked to confirm before
                  anything is saved.
                </h5>
              </MDBCardBody>
            </MDBCard>
          </MDBCol> */}
        </MDBRow>

        <div className={classes.listContainer}>
          <h2
            className={`text-center text-white text-decoration-underline m-4 ${classes.listTitle}`}
          >
            Equipment &amp; Assigned Operators
          </h2>

          {equipments?.length > 0 ? (
            <Paper sx={{ height: "90%", width: "98%", margin: "1%" }}>
              <DataGrid
                rows={equipments.map((equipment) => ({
                  id: equipment.equipmentId,
                  equipmentId: equipment.equipmentId,
                  equipmentName: equipment.equipmentName,
                  equipmentModel: equipment.equipmentModel,
                  operatorName: equipment.operatorName,
                  operatorEmail: equipment.operatorEmail,
                  operatorPhoneNumber: equipment.operatorPhoneNumber,
                }))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection={false}
                loading={pageLoading}
                rowHeight={64}
                sx={{ border: 2 }}
              />
            </Paper>
          ) : (
            <h3 className="text-center text-white">
              No Equipment Detail uploaded so far.
            </h3>
          )}
        </div>
      </MDBContainer>

      <ConfirmTransferModal
        open={confirmOpen}
        onCancel={handleCancelTransfer}
        onContinue={handleConfirmTransfer}
        loading={submitting}
        message={
          pendingTransfer
            ? `Are you sure? ${pendingTransfer.operatorLabel} will be assigned to ${pendingTransfer.equipmentName}.`
            : ""
        }
      />

      <ToastContainer />
    </div>
  );
}

export default EquipmentTransfer;
