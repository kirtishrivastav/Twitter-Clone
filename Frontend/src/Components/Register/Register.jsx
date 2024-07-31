import { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { AUTH_ENDPOINT } from '../../Utils/constants';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userName: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${AUTH_ENDPOINT}/register`, {
        name: formData.fullName,
        email: formData.email,
        username: formData.userName,
        password: formData.password,
      });

      setMessage(`Registration successful! Token: ${response.data.token}`);
       // Redirect after successful login
       toast.success("you have register successfully")
       navigate('/login');
      

    } catch (error) {
      toast.error("error in registraion")
      setMessage(error.response ? error.response.data.message : 'Error occurred');
    }
  };

  return (
    <div className="login-container">
      <div className="register-welcome-section">
        <h2>Join Us</h2>
        <div className="icon">
          {/* <FontAwesomeIcon icon={faTwitter} /> */}
        </div>
      </div>
      <div className="register-section">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="FullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="userName"
            placeholder="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">SignUp</button>
        </form>
        {message && <p>{message}</p>}
      
        <div className="register-link">
          <p>Already have account
          <Link to="/login"> <a href="#">Login Here</a>  </Link></p>
            
        </div>
       
      <ToastContainer></ToastContainer>
      </div>
    </div>
  );
}

export default Register;
