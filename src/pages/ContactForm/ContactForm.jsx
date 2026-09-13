// import React, { useState } from 'react';
// import { useForm, ValidationError } from '@formspree/react';
// import { toast, ToastContainer } from 'react-toastify'; // Ensure correct import
// import 'react-toastify/dist/ReactToastify.css';  // Make sure CSS is imported

// function ContactForm() {
//   const [state, handleSubmit] = useForm("xbldwvrd");
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const handleFormSubmit = (e) => {
//     e.preventDefault();  // Prevent default form submission
//     e.target.reset();  // Reset the form fields after submission
    
//     handleSubmit(e);  // Submit the form
//     setFormSubmitted(true);  // Set form submission state to true
    
//     // Show the success toast after resetting the form
//     toast.success("Your request for the code base has been sent! We will get back to you soon.", {
//       position: "top-right",  // Use string directly for position
//       autoClose: 5000,  // Automatically close the toast after 5 seconds
//     });
//   };
  

//   return (
//     <div>
//       <form onSubmit={handleFormSubmit} style={formStyle}>
//         <label htmlFor="email" style={labelStyle}>
//           Email Address
//         </label>
//         <input
//           id="email"
//           type="email"
//           name="email"
//           style={inputStyle}
//         />
//         <ValidationError
//           prefix="Email"
//           field="email"
//           errors={state.errors}
//           style={errorStyle}
//         />
        
//         <label htmlFor="message" style={labelStyle}>
//           Message
//         </label>
//         <textarea
//           id="message"
//           name="message"
//           style={textareaStyle}
//         />
//         <ValidationError
//           prefix="Message"
//           field="message"
//           errors={state.errors}
//           style={errorStyle}
//         />
        
//         <button type="submit" disabled={state.submitting} style={buttonStyle}>
//           Submit
//         </button>
//       </form>

//       {/* Toast Container to display the toast notifications */}
//       <ToastContainer />
//     </div>
//   );
// }

// // Styles (same as before)
// const formStyle = {
//   maxWidth: '500px',
//   margin: '10% auto',
//   padding: '20px',
//   backgroundColor: '#f9f9f9',
//   borderRadius: '8px',
//   boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
// };

// const labelStyle = {
//   display: 'block',
//   marginBottom: '8px',
//   fontSize: '16px',
//   fontWeight: '600',
// };

// const inputStyle = {
//   width: '100%',
//   padding: '10px',
//   marginBottom: '12px',
//   fontSize: '16px',
//   border: '1px solid #ccc',
//   borderRadius: '4px',
// };

// const textareaStyle = {
//   width: '100%',
//   padding: '10px',
//   marginBottom: '12px',
//   fontSize: '16px',
//   border: '1px solid #ccc',
//   borderRadius: '4px',
//   minHeight: '100px',
// };

// const buttonStyle = {
//   width: '100%',
//   padding: '12px',
//   backgroundColor: '#4CAF50',
//   color: '#fff',
//   fontSize: '16px',
//   fontWeight: '600',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   transition: 'background-color 0.3s ease',
// };

// const errorStyle = {
//   color: 'red',
//   fontSize: '12px',
//   marginBottom: '12px',
// };

// const successMessageStyle = {
//   marginTop: '15px',
//   color: '#4CAF50',
//   fontSize: '16px',
//   fontWeight: '600',
// };

// export default ContactForm;
// import React, { useState } from "react";
// import { useForm, ValidationError } from "@formspree/react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./ContactForm.css";

// function ContactForm() {
//   const [state, handleSubmit] = useForm("xbldwvrd");
//   const [formSubmitted, setFormSubmitted] = useState(false);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     e.target.reset();
//     handleSubmit(e);
//     setFormSubmitted(true);

//     toast.success(
//       "Your request for the code base has been sent! We will get back to you soon.",
//       {
//         position: "top-right",
//         autoClose: 5000,
//       }
//     );
//   };

//   return (
//     <section className="contact-container">
//       {/* Heading */}
//       <div className="heading-wrapper">
//         <h1 className="main-heading">
//           Contact <span className="heading-accent">Us</span>
//         </h1>
//         <div className="heading-underline"></div>
//       </div>

//       {/* Glass Card */}
//       <div className="content-card contact-card">
//         <form onSubmit={handleFormSubmit} className="contact-form">
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               name="email"
//               className="form-input"
//               required
//             />
//             <ValidationError
//               prefix="Email"
//               field="email"
//               errors={state.errors}
//               className="form-error"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="message" className="form-label">
//               Message
//             </label>
//             <textarea
//               id="message"
//               name="message"
//               className="form-textarea"
//               required
//             />
//             <ValidationError
//               prefix="Message"
//               field="message"
//               errors={state.errors}
//               className="form-error"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={state.submitting}
//             className="submit-button"
//           >
//             {state.submitting ? "Submitting..." : "Submit Request"}
//           </button>
//         </form>
//       </div>

//       <ToastContainer />
//     </section>
//   );
// }

// export default ContactForm;
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {axiosInstance} from '../../Utility/urlInstance'
import "./ContactForm.css";

function ContactForm() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post( "/user/contactUs", formData);
      if (res.data.success) {
        toast.success(res.data.message || "Your request has been sent successfully!");
        setFormData({ email: "", message: "" });
      } else {
        toast.error("Failed to send request. Try again.");
      }
    } catch (error) {
      console.log(error)
      toast.error("Server error. Please try later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="contact-container">
      <div className="content-card contact-card">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="your email"
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              required
              placeholder="your message max 500 character"
               maxLength={400}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Sending..." : "Submit Request"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </section>
  );
}

export default ContactForm;
