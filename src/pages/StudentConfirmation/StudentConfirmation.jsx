// import React,{useEffect} from 'react'
// import styles from './StudentConfirmation.module.css'
// import { useParams } from 'react-router-dom';
// import { axiosInstance } from '../../Utility/urlInstance';
// function StudentConfirmation() {
//     const { userId } = useParams();
// let validator = async ()=>{
//          try {
//             axiosInstance.post(`/user/studentConfirmation/${userId}`)
//          } catch (error) {
//             console.log(error)
//          }
//     }

// useEffect(()=>{
//     validator()
// },[])

//   return (
//     <div className={styles.successDisplay}>
// <h2 className='text-success text-dark ' >
// You have successfully granted permission.
// </h2>
// <h3 className='text-center'>Thank You!</h3>
//     </div>
//   )
// }

// export default StudentConfirmation
import React, { useEffect } from "react";
import styles from "./StudentConfirmation.module.css";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../Utility/urlInstance";
function StudentConfirmation() {
  const { userId } = useParams();
  let validator = async () => {
    try {
      axiosInstance.post(`/user/studentConfirmation/${userId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    validator();
  }, []);

  return (
    <div className={styles.successDisplay}>
      <h2 className="text-success text-dark ">
        You have successfully granted permission.
      </h2>
      <h3 className="text-center">Thank You!</h3>
    </div>
  );
}

export default StudentConfirmation;
