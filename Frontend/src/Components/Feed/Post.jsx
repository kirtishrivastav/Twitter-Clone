/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from "react-modal";
import "./Post.css";
import { TWEET_ENDPOINT } from "../../Utils/constants.js";
import { UserContext } from "../../Context/userContext.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

function Post() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Loading user data...</div>; // Handle loading state
  }

  const id = user._id;

  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("content", description);
    if (image) {
      formData.append("image", image);
    }

    // Retrieve the token from local storage
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`${TWEET_ENDPOINT}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

       
      console.log(response.data);
       

      // Reset the form
      setDescription("");
      setImage(null);
      setModalIsOpen(false); // Close the modal after submission
      console.log("tweet created successfully");
      toast.success("tweet created")


    } catch (error) {
      console.error("Error creating tweet:", error);
      toast.error("error in creating tweet")
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
        <div className="flex-container">
          <div><h1>Home</h1></div>
          {/* model jsx */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="New Tweet"
            className="tweet-modal"
            overlayClassName="overlay"
          >
            <div className="modal-header">
              <h2>New Tweet</h2>
              <button onClick={closeModal} className="close-button">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="What Is Happening?!"
            />
            {image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Selected" />
              </div>
            )}
            <div className="footer">
              <div>
                <label htmlFor="image-upload" className="image-upload-label">
                  <FontAwesomeIcon icon={faImage} size="lg" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <div className="footer-btn">
                <button onClick={submitHandler} className="post-button">
                  Tweet
                </button>
                <button onClick={closeModal} className="close-button">
                  Close
                </button>
              </div>
            </div>
          </Modal>

          <div className="footer">
            <button onClick={openModal} className="post-button">
              Tweet
            </button>
          </div>
          <ToastContainer></ToastContainer>
        </div>
  );
}

export default Post;
