

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { axiosInstance } from '../../Utility/urlInstance';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from "react-toastify";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal/ConfirmDeleteModal";
function ListOfUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState({
    message: "",
    status: null,
  });
  const [message, setMessage] = useState(""); // To hold the message for admin users
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // { userId, role }
  const [isDeleting, setIsDeleting] = useState(false);

  
//   let token = auth.token;
// console.log(token)
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/user/allUsers");
      setUsers(res?.data.users || []);
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);
  
  const deleteUser = async (userId, role) => {
    // Prevent deletion if the user is an admin (role 3 or 4)
    if (role === 3 || role === 4) {
      toast.error("Can't delete admin."); // Show error toast for admins
      return;
    }
  
    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(
        `/user/userProfileDelete/${userId}`
      );
      if (response.status === 200) {
        toast.success("User deleted successfully!"); // Success toast
        fetchAllUsers(); // Fetch updated list of users
      } else {
        toast.error(`Unexpected status code: ${response.status}`); // Error toast
      }
    } catch (error) {
      toast.error(error?.response?.data?.errors[0] || "Error deleting user"); // Show error message if there's an issue
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (userId, role) => {
    setSelectedUser({ userId, role });
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteContinue = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.userId, selectedUser.role);
    }
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };
  
  
  const columns = [
    { field: 'instituteId', headerName: 'Institute ID', width: 180 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'guideId', headerName: 'Guide ID', width: 180 },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <>
        <Button
          style={{ margin: "5px" }}
          onClick={() => handleDeleteClick(params?.row.userId, params?.row.role)}
          variant="danger"
        >
          Delete
        </Button>
            <ToastContainer />
        </>
      ),
      width: 150,
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ height: '90%', width: '95%', margin: '2%' }}>
      {/* Conditionally render the message for admin users */}
      {message && (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
          {message}
        </div>
      )}
      <DataGrid
        rows={users?.map(user => ({
          id: user.userId,
          instituteId: user.instituteId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          guideId: user.guideId,
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
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onCancel={handleDeleteCancel}
        onContinue={handleDeleteContinue}
        message="Are you sure you want to delete this item?"
        loading={isDeleting}
      />
    </Paper>
  );
}

export default ListOfUsers;
