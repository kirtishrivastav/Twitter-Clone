import { useContext, useState } from "react";
import { UserContext } from "../../Context/userContext";
import axios from 'axios';
import "./Profile.css";
import Container from "react-bootstrap/Container";
import UserTweets from "./UserTweets";
import EditProfileModal from '../EditProfile/EditProfile';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { USER_ENDPOINT } from "../../Utils/constants";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, loading, updateUser } = useContext(UserContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  
  const handleShowUploadModal = () => setShowUploadModal(true);
  const handleCloseUploadModal = () => setShowUploadModal(false);

  const handleUserUpdate = (updatedUser) => {
    updateUser(updatedUser); // Update the user in the context
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Update state with the selected file
  };

  // Function to handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      return; // If no file is selected, do nothing
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile); //append to form data

    try {
      // Make an API call to upload the file
      const response = await axios.post(`${USER_ENDPOINT}/${user._id}/uploadProfilePic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      

      // Update user context with new profile picture
    
      handleCloseUploadModal(); // Close the modal after successful upload
      updateUser(user._id);
      toast.success("profile uploaded successfully")
      return response

    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  console.log("user from userContext", user);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="container profile-container">
      <Container>
        <div className="details text-center">
          <div className="profile-header">
            <img
              src="https://marketplace.canva.com/EAFIddmg8b0/1/0/1600w/canva-white-minimalist-corporate-personal-profile-linkedin-banner-t5iKXmGyEtU.jpg"
              alt="Cover"
              className="img-fluid profile-cover"
            />
          </div>

          <div className="top">
            <div className="image">
              <img type="file"
                src={user?.profilePicture} // Adjust based on your static file serving
                alt="Profile"
                className="profile-photo"
              />
            </div>
           
          </div>
          <span className="user__name">{user?.name}</span>
          
          <div className="actions">
            <button className="btn btn-primary btn-sm pic-btn " onClick={handleShowUploadModal}>
              Upload Profile Photo
            </button>
            <button className="btn btn-outline-primary btn-sm edit-btn" onClick={handleShowEditModal}>
              Edit
            </button>
          </div>
          <div className="user-joining">
            <span className="user__id">@{user?.username}</span>
            <div className="user__joined">
              <i className="bi bi-calendar"></i>
              <span className="user__joined--text">
                Joined {new Date(user?.createdAt).toDateString()}
              </span>
            </div>
            <div className="user__follows">
              <span className="user__follows__following">
                <b>{user?.following?.length || 0}</b> Following
              </span>
              <span className="user__follows__followers">
                <b>{user?.followers?.length || 0}</b> Followers
              </span>
            </div>
          </div>
        </div>
      </Container>
      <UserTweets />
      <EditProfileModal show={showEditModal} handleClose={handleCloseEditModal} onUserUpdate={handleUserUpdate} />

      {/* Modal for uploading profile picture */}
      <Modal show={showUploadModal} onHide={handleCloseUploadModal} className="profile-upload-modal">
        <Modal.Header >

          <Modal.Title className="title">Upload Profile Pic</Modal.Title>
          <button>
          <FontAwesomeIcon icon={faTimes} onClick={handleCloseUploadModal}/>
        </button>
        </Modal.Header>
        <Modal.Body>
          <p className="upload-p">Note: The image should be square in shape</p>
          <div className="">
          <input type="file"  id="upload-input" onChange={handleFileChange} />
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUploadModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Save Profile Pic
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
