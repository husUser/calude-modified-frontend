// import React, { useEffect, useState } from "react";
// import { axiosInstance } from "../../Utility/urlInstance.js";
// import {
//   MDBBtn,
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
// } from "mdb-react-ui-kit";
// import { BeatLoader } from "react-spinners";

// function UserRoleUpdater() {
//   const [loading, setLoading] = useState(false);
//   const [handleError, setHandleError] = useState("");
//   const [success, setHandleSuccess] = useState("");
//   const [userInfo, setUserInfo] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");

//   // Fetch all users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axiosInstance.get("/user/allUsers");
//         setUserInfo(response?.data.users);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     // Clear previous messages before making a new request
//     setHandleError("");
//     setHandleSuccess("");
  
//     if (!selectedUser || !selectedRole) {
//       setHandleError("Please select both a user and a role.");
//       return;
//     }
  
//     setLoading(true);
//     try {
//       await axiosInstance.patch(`/user/userRole/${selectedUser}`, {
//         role: selectedRole,
//       });
  
//       setHandleSuccess("User role updated successfully.");
//     } catch (error) {
//       setHandleError(
//         error.response?.data?.errors?.[0] || "Failed to update role."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <MDBContainer fluid className="p-4 container">
//       <MDBRow>
//         <MDBCol md="6" className="text-center text-md-start">
//           <h1 className="my-5 display-3 fw-bold text-white">
//             Update <span className="text-warning">User Role</span>
//           </h1>
//           <h5 className="text-white">
//             Grant or revoke user roles like Operator, TA, or Admin.
//           </h5>
//         </MDBCol>

//         <MDBCol md="6">
//           <MDBCard>
//             <MDBCardBody className="p-5">
//               <form onSubmit={handleSubmit}>
//                 <h2 className="mb-4">Insert Details</h2>

//                 {/* User Selection */}
//                 <select
//                   className="form-select mb-4"
//                   value={selectedUser}
//                   onChange={(e) => setSelectedUser(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select email
//                   </option>
//                   {userInfo.map((user) => (
//                     <option key={user.userId} value={user.userId}>
//                       {user.email}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Role Selection */}
//                 <select
//                   className="form-select mb-4"
//                   value={selectedRole}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select role
//                   </option>
//                   <option value="0">User</option>
//                   <option value="1">Operator</option>
//                   <option value="2">TA</option>
//                   <option value="3">Admin</option>
//                   <option value="5">Professor</option>
//                 </select>

//                 <MDBBtn className="w-100 mb-4" size="md" type="submit" disabled={loading}>
//                   {loading ? <BeatLoader size={8} color="#ffffff" /> : "Update Role"}
//                 </MDBBtn>

//                 {handleError && <p className="text-danger fw-bold">{handleError}</p>}
//                 {success && <p className="text-success fw-bold">{success}</p>}
//               </form>
//             </MDBCardBody>
//           </MDBCard>
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }

// export default UserRoleUpdater;

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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function UserRoleUpdater() {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/user/allUsers");
        setUserInfo(response?.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clear previous toasts before making a new request
    toast.dismiss();
  
    if (!selectedUser || !selectedRole) {
      toast.error("Please select both a user and a role.");
      return;
    }
  
    setLoading(true);
    try {
      await axiosInstance.patch(`/user/userRole/${selectedUser}`, {
        role: selectedRole,
      });
  
      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0] || "Failed to update role."
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
            Update <span className="text-warning">User Role</span>
          </h1>
          <h5 className="text-white">
            Grant or revoke user roles like Operator, TA, or Admin.
          </h5>
        </MDBCol>

        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody className="p-5">
              <form onSubmit={handleSubmit}>
                <h2 className="mb-4">Insert Details</h2>

                {/* User Selection */}
                <select
                  className="form-select mb-4"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select email
                  </option>
                  {userInfo.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.email}
                    </option>
                  ))}
                </select>

                {/* Role Selection */}
                <select
                  className="form-select mb-4"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="0">User</option>
                  <option value="1">Operator</option>
                  <option value="2">TA</option>
                  <option value="3">Admin</option>
                  <option value="5">Professor</option>
                </select>

                <MDBBtn className="w-100 mb-4" size="md" type="submit" disabled={loading}>
                  {loading ? <BeatLoader size={8} color="#ffffff" /> : "Update Role"}
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Toast container */}
      <ToastContainer />
    </MDBContainer>
  );
}

export default UserRoleUpdater;
