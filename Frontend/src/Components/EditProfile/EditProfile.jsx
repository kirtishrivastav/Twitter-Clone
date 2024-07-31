/* eslint-disable react/prop-types */
import { useState, useContext,} from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { UserContext } from "../../Context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { editUser } from "../../Utils/ApisCalling";


import "./EditProfile.css";

const EditProfileModal = ({ show, handleClose, onUserUpdate}) => {
  const { user,} = useContext(UserContext);
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');

  const handleSave = async () => {
    const userId = user._id;
    const userDetails = { name, location, dateOfBirth };
    const token = localStorage.getItem('token'); // or get the token from context or props

    try {
      const updatedUser = await editUser(userId, userDetails, token);
      onUserUpdate(updatedUser); // Update the user in the context
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };
 
  

  return (
    <Modal show={show} onHide={handleClose} className="edit-profile-modal">
      <Modal.Header >
        <Modal.Title>Edit Profile</Modal.Title>
        <button>
          <FontAwesomeIcon icon={faTimes} onClick={handleClose}/>
        </button>
      </Modal.Header>
      <Modal.Body>
        <Form className="Form">
          <Form.Group controlId="formName" className="Form-group">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formLocation"  className="Form-group">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDateOfBirth"  className="Form-group">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
