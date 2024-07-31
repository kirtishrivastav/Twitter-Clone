/* eslint-disable react/prop-types */
import { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './LeftSidePanel.css';
import { Link } from 'react-router-dom';

const LeftSidePanel = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    

    useEffect(() => {
        const token = localStorage.getItem('userId','token'); // token storage
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        window.location.href = '/login'; // Redirect to login page
    };
    return (
        <div className='left-side-panel'>
            <div>
                <div>
                    <img className='twitter-logo' src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png" alt="twitter-logo" />
                </div>
                <div className='menu'>
                    <Link to="/" className='menu-item'>
                        <FontAwesomeIcon icon={faHome} />
                        <h1>Home</h1>
                    </Link>
                    
                    <Link to="/profile" className='menu-item'>
                        <FontAwesomeIcon icon={faUser} />
                        <h1>Profile</h1>
                    </Link>

                    {isLoggedIn ? (
                        <div className='menu-item' onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <h1>Logout</h1>
                        </div>
                    ) : (
                        <Link to="/login" className='menu-item'>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <h1>Login</h1>
                        </Link>
                    )}
                    
                    {/* <Link to="/login">
                    <div className='menu-item'>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <h1>Login</h1>
                    </div>
                    </Link> */}
                    
                </div>
            </div>
        </div>
    );
}

export default LeftSidePanel;
