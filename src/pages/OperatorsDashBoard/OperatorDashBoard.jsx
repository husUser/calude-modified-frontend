import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../Utility/urlInstance';
import { useParams, Link } from 'react-router-dom';  
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

function OperatorDashBoard() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("");  
  const [openDialog, setOpenDialog] = useState(false);  
  const [selectedResultId, setSelectedResultId] = useState(null);  
  const [rowIndex, setRowIndex] = useState(null);  
  const [bookingIdFilter, setBookingIdFilter] = useState("");  // Step 1: Add filter state
  const auth = useAuthUser();
  const userId = auth.userId;

  useEffect(() => {
    getUserBookings();
  }, []);
console.log(userId)
  const getUserBookings = async () => {
    try {
      const res = await axiosInstance.get(`/result/findAllBookingForOperator/${userId}`);
      if (res?.status === 200) {
        if (res?.data.results.length === 0) {
          setMessage("No booking history found");
          setMessageType("error");  
          setBookingHistory([]); 
        } else {
          console.log(res)
          // Filter out rows where visible is false here
          const filteredBookings = res?.data.results.filter(booking => booking.visible !== false);
          setBookingHistory(filteredBookings);
          setFilteredBookings(filteredBookings);  // Store all bookings in filteredBookings
        }
      } else {
        setMessage("Error fetching booking history");
        setMessageType("error");  
        setBookingHistory([]); 
      }
    } catch (error) {
      console.log(error);
      setMessage(error?.response?.data?.errors[0] || "No booking history to display");
      setMessageType("error");
      setBookingHistory([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleDontShow = (resultId, index) => {
    setSelectedResultId(resultId);  
    setRowIndex(index);  
    setOpenDialog(true);  
  };

  const handleDialogClose = () => {
    setOpenDialog(false);  
  };

  const handleConfirmDontShow = async () => {
    try {
      setMessage(""); // Clear any previous message
      setMessageType("");

      const res = await axiosInstance.post('/result/updateResultVisibility', {
        resultId: selectedResultId,
        visible: false
      });

      if (res.status === 200) {
        getUserBookings();
        setMessageType('success'); 
        // Update the booking history, marking the updated row as invisible
        setBookingHistory(prevBookingHistory => 
          prevBookingHistory.map((booking, index) => 
            index === rowIndex ? { ...booking, visible: false } : booking
          )
        );
      } else {
        setMessage('Failed to update visibility');
        setMessageType('error');  
      }
    } catch (error) {
      setMessage('Error updating visibility');
      setMessageType('error');
    } finally {
      setOpenDialog(false);  
    }
  };

  // Step 2: Add function to handle filter change
  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setBookingIdFilter(filterValue);

    // Filter the bookings based on the displayBookingId
    if (filterValue === "") {
      setFilteredBookings(bookingHistory);
    } else {
      const filtered = bookingHistory.filter(booking =>
        booking.displayBookingId.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  };

  const columns = [
    { field: 'firstName', headerName: 'Student Name', width: 190 },
    { field: 'instituteId', headerName: 'Student Ins. Id', width: 120 },
    { field: 'EquipmentName', headerName: 'Equipment name', width: 130 },
    { field: 'bookedDate', headerName: 'Date of booking', width: 120 },
    { field: 'slotDate', headerName: 'Slot Date', width: 90 },
    { field: 'slotTime', headerName: 'Slot Time', width: 100 },
    { field: 'displayBookingId', headerName: 'Booking ID', width: 90 },
    { field: 'studentConfirmation', headerName: 'Student Confirmation', width: 180 },
    { field: 'operatorStatusConfirmation', headerName: 'Operator Status Confirmation', width: 210 },
    {
      field: 'studentStatus',
      headerName: 'Update Result Status',
      width: 200,
      renderCell: (params) => {
        return (
          <Link 
            to={`/operatorUpdates/${params.row.resultId}`}
          >
            <Button
              variant="contained"
              color="primary"
            >
              Update Result Status
            </Button>
          </Link>
        );
      }
    },
    {
      field: 'dontShow',
      headerName: 'Don\'t Show',
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDontShow(params.row.resultId, params.row.id)} 
            disabled={params.row.visible === false}  
          >
            Don't Show
          </Button>
        );
      }
    }
  ];

  return (
    <div>
      <h1 className='text-center mt-3 text-white'>Equipment Slot Booking History</h1>


      <TextField
        placeholder="Search by Booking ID"
        variant="outlined"
        value={bookingIdFilter}
        onChange={handleFilterChange}
        sx={{ margin: '1rem 1rem', width: '25%', border:'black 1px solid', color:'white' }}
      />



      <Paper sx={{ height: '90%', width: '80%', margin: '2% auto' }}>
        {message && (
          <div
            style={{
              color: messageType === 'success' ? 'green' : 'red',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            {message}
          </div>
        )}

        <DataGrid
          rows={filteredBookings.map(booking => ({
            id: booking.bookingId, 
            resultId: booking.resultId, 
            firstName: booking.User.firstName,
            instituteId: booking.User.instituteId,
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

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          style: {
            backgroundColor: '#565D8E',
            color: '#ffffff',
          },
        }}
      >
        <DialogTitle style={{ color: '#ffffff' }}>
          Are you sure, you will not be able to see it again?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: '#ffffff' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDontShow} variant="contained" color="error">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OperatorDashBoard;
