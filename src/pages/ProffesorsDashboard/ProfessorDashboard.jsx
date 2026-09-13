import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { axiosInstance } from '../../Utility/urlInstance';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // For React Router v6+
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MuiButton from '@mui/material/Button';

function ProfessorDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState({
    message: "",
    status: null,
  });
  const [message, setMessage] = useState(""); // To hold the message for admin students
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const auth = useAuthUser();
  let professorId = auth.userId
//   let token = auth.token;
// console.log(token)
  const fetchAllstudents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/professors/getAllProfessorStudents/${professorId}`);
      setStudents(res?.data.students|| []);
    } catch (error) {
      setError("Failed to get students");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllstudents();
  }, []);

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedUserId(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId);
    }
    setOpenDeleteDialog(false);
    setSelectedUserId(null);
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/professors/deleteProfessorStudent/${userId}`);
      if (response?.status === 200) {
        setResponse({
          message: "Student deleted successfully",
          status: true,
        });
        fetchAllstudents();
      } else {
        setResponse({
          message: `Unexpected status code: ${response.status}`,
          status: false,
        });
      }
    } catch (error) {
      setResponse({
        message: error?.response?.data?.errors[0] || "Error deleting user",
        status: false,
      });
    }
  };

  const columns = [
    { field: 'instituteId', headerName: 'Student Institute ID', width: 180 },
    { field: 'firstName', headerName: 'Student First Name', width: 180 },
    { field: 'lastName', headerName: 'Student Last Name', width: 180 },
    { field: 'email', headerName: 'Student Email', width: 180 },
    { field: 'mobileNumber', headerName: 'Student Mobile Number', width: 180 },
    {
      field: 'history',
      headerName: 'See Booking history of student',
      renderCell: (params) => {
        const navigate = useNavigate(); // Hook to navigate
        const handleClick = () => {
          const { userId } = params.row;
          navigate(`/professors/viewStudentBooking/${userId}/${professorId}`);
        };
        return (
          <Button
            style={{ margin: '5px' }}
            onClick={handleClick}
            variant="success"
          >
            See bookings
          </Button>
        );
      },
      width: 220,
    },
    {
      field: 'action',
      headerName: 'Delete student profile',
      renderCell: (params) => (
        <Button
          style={{ margin: '5px' }}
          onClick={() => handleDeleteClick(params.row.userId)}
          variant="danger"
        >
          Delete
        </Button>
      ),
      width: 180,
    },
  ];
  
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ height: '90%', width: '95%', margin: '2%' }}>
      {/* Conditionally render the message for admin students */}
      {message && (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
          {message}
        </div>
      )}
      <DataGrid
        rows={students?.map(user => ({
          id: user.userId,
          instituteId: user.instituteId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          userId: user.userId,
          role: user.role,  // Including role in the rows
        }))}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection={false}
        loading={loading}
        sx={{ border: 2 }}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        PaperProps={{
          style: {
            backgroundColor: '#536990',
            color: '#ffffff',
          },
        }}
      >
        <DialogTitle style={{ color: '#ffffff' }}>Are you sure?</DialogTitle>
        <DialogContent style={{ color: '#ffffff' }}>
          This will permanently delete the student's profile.
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDeleteCancel} style={{ color: '#ffffff' }}>
            Cancel
          </MuiButton>
          <MuiButton onClick={handleDeleteConfirm} style={{ color: '#ffffff' }} variant="contained" color="error">
            Yes, Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ProfessorDashboard;
