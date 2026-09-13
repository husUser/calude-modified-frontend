import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../Utility/urlInstance.js";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Spinner from "react-bootstrap/Spinner";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import "./ProfessorLogIn.model.css";

function LogInSignUp() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [professors, setProfessors] = useState([]);
  const [logInData, setLogInData] = useState({ email: "", password: "" });

  const signIn = useSignIn();
  const navigate = useNavigate();
  const auth = useAuthUser();
  useEffect(() => {
    if (auth?.token) navigate("/ProfessorDashboard");
  }, [auth, navigate]);

  //   useEffect(() => {
  //     const fetchProfessors = async () => {
  //       try {
  //         const response = await axiosInstance.get("/professors/getAllProfessors");
  //         setProfessors(response?.data?.AllProfessors || []);
  //       } catch {
  //         setError("Failed to fetch professor profiles");
  //       }
  //     };
  //     fetchProfessors();
  //   }, []);

  const handleInputChange = (setter) => (e) => {
    setter((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleAuthResponse = (res) => {
    const token = res.headers["authorization"]?.split(" ")[1];
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("this is decoded data", decodedToken);
      if (
        signIn({
          auth: { token, type: "Bearer", expiresIn: 4320 },
          userState: {
            userId: decodedToken.userId,
            userName: decodedToken.userName,
            userRole: decodedToken.userRole,
            verification: decodedToken.verification,
            token,
          },
        })
      ) {
        navigate("/ProfessorDashboard");
      }
    }
  };

  const toggleVisibility = (setter) => () => setter((prev) => !prev);

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/professors/professorLogIn",
        logInData,
      );
      console.log(res);
      handleAuthResponse(res);
      setError("");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="p-1 container">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3 text-white">
            Welcome to Professor's <br />
            <span className="text-warning">Portal</span>
          </h1>
          <h5 className="px-3 text-white text-justify">
            After logging in, you will be able to see a list of your students,
            their booking records, and remove their access to booking. If this
            is your first time, make sure to change your password to replace the
            one provided to you in the admin section.
          </h5>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <MDBCard>
            <MDBCardBody
              className="p-5 position-relative overflow-hidden"
              style={{ height: "515px" }}
            >
              <div
                className="form-transition-container"
                style={{
                  position: "absolute",
                  width: "80%",
                  height: "100%",
                  top: 0,
                  left: isLogin ? "0%" : "-100%",
                  transition: "left 0.6s ease-in-out",
                  padding: "6% 0 0 20%",
                }}
              >
                <form onSubmit={(e) => handleSubmit(e, "login")}>
                  <h2 className="mb-4">Log In</h2>
                  {error && (
                    <span className="errorDisplay fw-bold ">{error}</span>
                  )}
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email"
                    type="email"
                    name="email"
                    onChange={handleInputChange(setLogInData)}
                  />
                  <div className="position-relative">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      onChange={handleInputChange(setLogInData)}
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ cursor: "pointer" }}
                      onClick={toggleVisibility(setShowPassword)}
                    >
                      {/* {showPassword ? "🙈" : "👁️"} */}
                      {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                    </span>
                  </div>
                  <MDBBtn
                    className="w-100 mb-4"
                    size="md"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <BeatLoader /> : "Log In"}
                  </MDBBtn>

                  <div className="forgot">
                    <Link to="/ProfessorEmailProvide">Forgot password?</Link>
                  </div>
                </form>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default LogInSignUp;
