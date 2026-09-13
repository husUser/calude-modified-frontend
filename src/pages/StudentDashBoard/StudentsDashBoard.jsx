import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../Utility/urlInstance";
import { useParams } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Button from "@mui/material/Button"; // Importing MUI Button

function StudentsDashBoard() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [disabledBookingIds, setDisabledBookingIds] = useState([]); // Track which bookings are completed
  const auth = useAuthUser();
  const userId = auth.userId;

  useEffect(() => {
    getUserBookings();
  }, []);

  const getUserBookings = async () => {
    try {
      const res = await axiosInstance.get(
        `/result/findAllBookingForStudent/${userId}`,
      );
      if (res?.status === 200) {
        if (res?.data.results.length === 0) {
          setMessage("No booking history found");
          setBookingHistory([]); // Set to empty array instead of string
        } else {
          setBookingHistory(res?.data.results);
        }
      } else {
        setMessage("Error fetching booking history");
        setBookingHistory([]); // Set to empty array in case of error
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.errors[0] ||
          "no booking data to display" ||
          "Error getting user booking history",
      );
      setBookingHistory([]); // Set to empty array in case of error
    } finally {
      setLoading(false); // Ensure loading is set to false no matter what
    }
  };
  console.log(bookingHistory);
  // Function to handle booking completion
  const handleCompleteBooking = async (resultId, userId) => {
    try {
      // Call your update API here (the controller you provided above)
      const result = await axiosInstance.get(
        `/result/statusUpdateByStudent/${userId}/${resultId}`,
      );

      if (result.status === 200) {
        // Successfully updated status, disable the button for this bookingId
        setDisabledBookingIds((prev) => [...prev, resultId]);
        getUserBookings(); // Refresh booking history to reflect changes
      }
    } catch (error) {
      setError("Error completing booking");
      console.log(error);
    }
  };

  const columns = [
    { field: "EquipmentName", headerName: "Equipment name", width: 190 },
    { field: "bookedDate", headerName: "Date of booking", width: 180 },
    { field: "slotDate", headerName: "Slot Date", width: 180 },
    { field: "slotTime", headerName: "Slot Time", width: 180 },
    { field: "displayBookingId", headerName: "Booking ID", width: 180 },
    {
      field: "operatorStatusConfirmation",
      headerName: "Operator Status Confirmation",
      width: 210,
    },
    {
      field: "studentConfirmation",
      headerName: "Student Confirmation",
      width: 180,
    },
    {
      field: "studentStatus",
      headerName: "Complete Booking",
      width: 180,
      renderCell: (params) => {
        const isCompleted =
          params.row.studentConfirmation === "Results collected";
        const isDisabled =
          disabledBookingIds.includes(params.row.id) || isCompleted;

        return (
          <Button
            variant="contained"
            color="primary"
            disabled={isDisabled}
            onClick={() => handleCompleteBooking(params.row.resultId, userId)}
          >
            {isCompleted ? "Completed" : "Complete Booking"}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-center mt-3 text-white">Student Booking History</h1>
      <Paper sx={{ height: "90%", width: "80%", margin: "2% auto" }}>
        {message && (
          <div
            style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}
          >
            {message}
          </div>
        )}
        {error && (
          <div
            style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}

        <DataGrid
          rows={bookingHistory?.map((booking) => ({
            id: booking.bookingId, // This will be used as row ID
            resultId: booking.resultId, // Add resultId here to be used in the button
            EquipmentName: booking.Equipment.equipmentName,
            bookedDate: booking.bookedDate,
            operatorStatusConfirmation: booking.operatorStatusConfirmation,
            studentConfirmation: booking.studentConfirmation,
            displayBookingId: booking.displayBookingId,
            slotDate: booking.slotDate,
            slotTime: booking.slotTime,
          }))}
          columns={columns}
          pagination
          pageSize={10}
          rowsPerPageOptions={[5, 10]}
          loading={loading}
          sx={{ border: 2 }}
        />
      </Paper>
    </div>
  );
}

export default StudentsDashBoard;
