import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { axiosInstance } from "../../Utility/urlInstance.js";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { BeatLoader } from "react-spinners";
import classes from "./Notification.module.css";
import Button from "react-bootstrap/Button";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal/ConfirmDeleteModal";

function Notification() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationInfo, setNotificationInfo] = useState({
    notificationMessage: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const authHeader = useAuthHeader();

  // Fetch all notifications on mount
  useEffect(() => {
    getAllNotifications();
  }, []);

  const getAllNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/notification/getAllNotifications", {
        headers: { Authorization: authHeader },
      });
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications", error);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit of notification form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post(
        "/notification/postNotification",
        notificationInfo, // send object, not string
        { headers: { Authorization: authHeader } }
      );
      toast.success("Notification sent successfully!");
      setNotificationInfo({ notificationMessage: "" });
      getAllNotifications();
    } catch (error) {
      toast.error("Failed to send notification. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const toDelete = async (notificationId) => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/notification/deleteNotification/${notificationId}`, {
        headers: { Authorization: authHeader },
      });
      toast.info("Notification deleted.");
      getAllNotifications();
    } catch (error) {
      toast.error("Error deleting notification.");
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (notificationId) => {
    setSelectedNotificationId(notificationId);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedNotificationId(null);
  };

  const handleDeleteContinue = async () => {
    if (selectedNotificationId) {
      await toDelete(selectedNotificationId);
    }
    setDeleteModalOpen(false);
    setSelectedNotificationId(null);
  };

  // Table column config
  const columns = [
    { field: "notificationMessage", headerName: "Notification Message", width: 850 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          style={{ margin: "5px" }}
          onClick={() => handleDeleteClick(params?.row.id)}
          variant="danger"
        >
          Delete
        </Button>
      ),
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
              Send <br />
              <span className="text-warning">Notifications</span>
            </h1>
            <h5
              className="px-3"
              style={{ color: "#F5F5F5", textAlign: "justify" }}
            >
              Provide a precise notification message to be displayed for all users
              on the main Dashboard.
            </h5>
          </MDBCol>

          <MDBCol md="6" className="position-relative">
            <MDBCard>
              <MDBCardBody
                className="p-5 position-relative overflow-hidden"
                style={{ height: "300px" }}
              >
                <form onSubmit={handleSubmit}>
                  <h2 className="mb-4">Provide Notification</h2>
                  <MDBTextArea
                    wrapperClass="mb-4"
                    label="Notification Message"
                    type="text"
                    name="notificationMessage"
                    value={notificationInfo.notificationMessage}
                    onChange={handleInputChange}
                    required
                  />
                  <MDBBtn
                    className="w-100 mb-4"
                    size="md"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <BeatLoader size={8} color="#fff" /> : "Send Notification"}
                  </MDBBtn>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        <div className={`${classes.listContainer}`}>
          <h2 className={`text-center text-decoration-underline m-4 ${classes.listTitle}`}>
            List of Notifications Sent
          </h2>

          {notifications?.length > 0 ? (
            <Paper sx={{ height: "90%", width: "96%", margin: "2%" }}>
              <DataGrid
                rows={notifications.map((n) => ({
                  id: n.notificationId, // ensure this matches backend
                  notificationMessage: n.notificationMessage,
                }))}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                loading={loading}
                sx={{ border: 2 }}
              />
            </Paper>
          ) : (
            <h3 className="text-center text-white">
              No notifications sent yet.
            </h3>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
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

export default Notification;
