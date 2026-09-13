// import React from "react";
// import styles from "./VerofuRequest.module.css";
// import { Link } from "react-router-dom";
// import useAuthUser from "react-auth-kit/hooks/useAuthUser";
// function VerifyRequest() {
//   const auth = useAuthUser();
//   return (
//     <div className={styles.successDisplay}>
//       <h1>
//         {" "}
//         <b>
//           {" "}
//           <i>Congratulations</i>
//         </b>{" "}
//         ! {auth?.userName}
//       </h1>
//       <h3 className="text-success text-dark ">
//         You have successfully registered. However, you need confirmation from
//         your guide. Please contact your guide / supervisor to confirm your registration
//         through the email which is sent already. Once confirmed, you'll be able
//         to book equipment on your next login.
//       </h3>
//       <Link className={styles.forLink} to="/login">
//         Click to login
//       </Link>
//     </div>
//   );
// }

// export default VerifyRequest;
import React from "react";
import styles from "./VerofuRequest.module.css";
import { Link } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
function VerifyRequest() {
  const auth = useAuthUser();
  return (
    <div className={styles.successDisplay}>
      <h1>
        {" "}
        <b>
          {" "}
          <i>Congratulations</i>
        </b>{" "}
        ! {auth?.userName}
      </h1>
      <h3 className="text-success">
        You have successfully registered. However, you need confirmation from
        your guide. Please contact your guide / supervisor to confirm your
        registration through the email which is sent already. Once confirmed,
        you'll be able to book equipment on your next login.
      </h3>
      <Link className={styles.forLink} to="/login">
        Click to login
      </Link>
    </div>
  );
}

export default VerifyRequest;
