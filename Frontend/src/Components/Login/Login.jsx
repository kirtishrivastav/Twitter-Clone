import { useContext, useState } from 'react';
import axios from 'axios';
import "./Login.css";
import { AUTH_ENDPOINT } from '../../Utils/constants';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/userContext';
import { Link } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
// configure toast


  const { updateUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [setError] = useState('');
  const navigate = useNavigate();


  const loginSuccess = () =>{
    toast.success("successful login");
  }
  const loginFailed=()=>{
    toast.error("login failed");
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${AUTH_ENDPOINT}/login`, {
        username,
        password,
      });

      // Debugging
      console.log("Login success", response);
      console.log("User ID:", response.data.person._id);

      // Store the token and userId in localStorage
     
    // Store the token and userId in localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.person._id);

    // Debugging
    console.log('Token and UserId stored in localStorage:', response.data.token, response.data.person._id);

       // Show success toast
      loginSuccess();

      // Update user context with user id
      await updateUser(response.data.person._id);
     

      // Debugging
      console.log("User context updated",updateUser.user);

      // Redirect after successful login
      navigate('/');
     

    
      setUsername('');
      setPassword('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.err);
        console.log(err);
       
        
      } else {
        setError('An error occurred. Please try again later.');
        toast.error('An error occurred. Please try again later.');
      }

      // Show failed login toast
      loginFailed();
    }
  };


  return (
<>
    <div className="login-container">
      <div className="welcome-section">
        <h2>Welcome</h2>
      </div>
      <div className="login-section">
        <h2>Login</h2>
        <form onSubmit={handleLogin} >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <Link to="/register">
       <div className="register-link">
          <p>Do not have an account? <a href="#">Register here</a></p>
        </div>
       </Link>
        </form>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default Login;
