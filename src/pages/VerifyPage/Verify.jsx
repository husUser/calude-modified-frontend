// import React from "react";
// import {Link} from "react-router-dom"
// function Verify() {
//   return (
//     <div>
//       <section className="mt-5 flex flex-col justify-center items-center text-center">
//         <h1 className="text-6xl font-bold mb-4 text-white text-decoration-underline">
//           Verification Request !
//         </h1>
//         <h2 className="text-4xl font-semibold mb-6 text-white">
//           <i>Your Account is not verified by your guide yet</i>
//         </h2>

//         <div className="">
//           <div className="resizer">
//             <h3 className="text-xl mb-5 text-justify text-white">
//              <h4><b>Dear User</b></h4>
//               <h5 className="text-center ">
//               Upon your registration, an email was sent to your guide to
//               verify that you are a student working under their supervision.
//               Kindly contact your guide and ask them to check their email and
//               click the Verify button after reading the necessary
//               information. If they accidentally delete the verification email,
//               please contact Support for assistance😊
//                 </h5>
//             </h3>
//           </div>
//           <Link to='/login' className="text-white fw-bold" > Click to logIn</Link>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Verify;
import React from "react";
import { Link } from "react-router-dom";

const verifyFadeInStyle = `
  @keyframes verifyFadeInUp {
    0% {
      opacity: 0;
      transform: translateY(24px) scale(0.97);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .verify-fade-in {
    opacity: 0;
    animation: verifyFadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
`;

function Verify() {
  return (
    <div>
      <style>{verifyFadeInStyle}</style>
      <section
        className="verify-fade-in mt-5 flex flex-col justify-center items-center text-center py-5 px-4 mx-auto rounded-3"
        style={{
          background:
            "linear-gradient(135deg, #4a7a94 0%, #3f7d8c 45%, #5a8ba3 100%)",
          maxWidth: "700px",
          boxShadow: "0 10px 30px rgba(30, 60, 80, 0.25)",
        }}
      >
        <h1 className="text-6xl font-bold mb-4 text-white text-decoration-underline">
          Verification Request !
        </h1>
        <h2 className="text-4xl font-semibold mb-6 text-white">
          <i>Your Account is not verified by your guide yet</i>
        </h2>

        <div className="">
          <div className="resizer">
            <h3 className="text-xl mb-5 text-justify text-white">
              <h4>
                <b>Dear User</b>
              </h4>
              <h5 className="text-center ">
                Upon your registration, an email was sent to your guide to
                verify that you are a student working under their supervision.
                Kindly contact your guide and ask them to check their email and
                click the Verify button after reading the necessary information.
                If they accidentally delete the verification email, please
                contact Support for assistance😊
              </h5>
            </h3>
          </div>
          <Link to="/login" className="text-white fw-bold">
            {" "}
            Click to logIn
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Verify;
