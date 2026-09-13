import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './PasswordUpdator.module.css';
import { axiosInstance } from '../../Utility/urlInstance';
import { useParams, useNavigate } from 'react-router-dom';

function PasswordUpdater() {
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [showForm, setShowForm] = useState(true); // Manage form visibility
  const { userId } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axiosInstance.post(`/user/userPasswordReset/${userId}`, { newPassword });
      setError('');
      setResponse('Password updated successfully!');
      setShowForm(false); // Hide form on success

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login'); // Use navigate for redirection
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error?.response?.data?.errors[0]);
    }
  };

  return (
    <div>
      {showForm ? (
        <Form className={styles.updateForm} onSubmit={handleSubmit}>
          <Form.Group controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="your new password..."
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Text className="text-muted">
              Provide your new password
            </Form.Text>
          </Form.Group>

          <Form.Group className="my-2" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="confirm your password.."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Form.Text className="text-muted">
              Make sure both passwords are similar
            </Form.Text>
          </Form.Group>

          {error && <p className="text-danger fw-bold">{error}</p>}
          <br />
          <Button className="mt-1" variant="success" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        
    <div className={styles.successDisplay}>
<h3 className='text-success text-center' >{response}</h3>
    </div>
      )}
    </div>
  );
}

export default PasswordUpdater;
