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
import "./LogInSignUp.css";

function LogInSignUp() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [professors, setProfessors] = useState([]);
  const [logInData, setLogInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    instituteId: "",
    guideId: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const signIn = useSignIn();
  const navigate = useNavigate();
  const auth = useAuthUser();

  useEffect(() => {
    if (auth?.token && auth?.verification === true) navigate("/dashboard");
  }, [auth, navigate]);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axiosInstance.get(
          "/professors/getAllProfessors",
        );
        console.log(response);
        setProfessors(response?.data?.professors || []);
      } catch {
        setError("Failed to fetch professor profiles");
      }
    };
    fetchProfessors();
  }, []);

  const handleInputChange = (setter) => (e) => {
    setter((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
  };
  const toggleVisibility = (setter) => () => setter((prev) => !prev);

  const handleAuthResponse = (res) => {
    const token = res.headers["authorization"]?.split(" ")[1];
    if (token) {
      const decodedToken = jwtDecode(token);
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
        navigate("/dashboard");
      }
    }
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (action === "login") {
        const res = await axiosInstance.post("/user/login", logInData);
        handleAuthResponse(res);
      } else if (action === "signup") {
        if (signUpData.password !== signUpData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        await axiosInstance.post("/user/createUser", signUpData);
        navigate("/verify");
      }
      setError("");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.errors || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  console.log(error);
  return (
    <MDBContainer fluid className="p-1 container">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3 text-white">
            Lab Equipment <br />
            <span className="text-warning">Booking Portal</span>
          </h1>
          <h5 className="px-3 text-white text-justify">
            Welcome to IA/FIST Lab Equipment Booking Portal. Simplify your
            access to essential tools and resources with just a few clicks. Sign
            up or log in to manage your bookings effortlessly!
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
                    <span className="errorDisplay fw-bold">{error}</span>
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
                  <p>
                    Don't have an account?{" "}
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={toggleAuthMode}
                    >
                      Sign Up
                    </span>
                  </p>
                  <div className="forgot">
                    <Link to="/emailProvide">Forgot password?</Link>
                  </div>
                  <div className="forgot mt-2">
                    <Link to="/ProfessorLogin">
                      Click Here For Professor's LogIn
                    </Link>
                  </div>
                </form>
              </div>

              <div
                className="form-transition-container"
                style={{
                  position: "absolute",
                  width: "80%",
                  height: "100%",
                  top: 0,
                  left: isLogin ? "100%" : "0%",
                  transition: "left 0.6s ease-in-out",
                  padding: "0 0 0 20%",
                }}
              >
                <form onSubmit={(e) => handleSubmit(e, "signup")}>
                  <h2 className="mb-3 mt-2">Sign Up</h2>
                  {error && <span className="errorDisplay">{error}</span>}
                  <MDBRow>
                    <MDBCol col="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="First name"
                        name="firstName"
                        onChange={handleInputChange(setSignUpData)}
                      />
                    </MDBCol>
                    <MDBCol col="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Last name"
                        name="lastName"
                        onChange={handleInputChange(setSignUpData)}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol col="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Institute ID"
                        name="instituteId"
                        onChange={handleInputChange(setSignUpData)}
                      />
                    </MDBCol>
                    <MDBCol col="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Institute Email"
                        type="email"
                        name="email"
                        onChange={handleInputChange(setSignUpData)}
                      />
                    </MDBCol>
                  </MDBRow>
                  <select
                    className="form-select mb-4"
                    name="guideId"
                    value={signUpData.guideId || ""}
                    onChange={handleInputChange(setSignUpData)}
                    required
                  >
                    <option value="" disabled>
                      Select Guide
                    </option>
                    {professors.map((prof) => (
                      <option key={prof.professorId} value={prof.professorId}>
                        {prof.firstName} {prof.lastName}
                      </option>
                    ))}
                  </select>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Contact Number (+91..)"
                    name="mobileNumber"
                    onChange={handleInputChange(setSignUpData)}
                  />
                  <MDBCol col="6" className="position-relative">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      onChange={handleInputChange(setSignUpData)}
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ cursor: "pointer" }}
                      onClick={toggleVisibility(setShowPassword)}
                    >
                      {/* {showPassword ? "🙈" : "👁️"} */}
                      {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                    </span>
                  </MDBCol>
                  <MDBCol col="6" className="position-relative">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      onChange={handleInputChange(setSignUpData)}
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ cursor: "pointer" }}
                      onClick={toggleVisibility(setShowConfirmPassword)}
                    >
                      {/* {showConfirmPassword ? "🙈" : "👁️"} */}
                      {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
                    </span>
                  </MDBCol>
                  <MDBBtn
                    className="w-100 mb-4"
                    size="md"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <BeatLoader /> : "Sign Up"}
                  </MDBBtn>
                  <p>
                    Already have an account?{" "}
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={toggleAuthMode}
                    >
                      Log In
                    </span>
                  </p>
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
