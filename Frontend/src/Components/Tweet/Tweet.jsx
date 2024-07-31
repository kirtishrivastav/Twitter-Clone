import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faHeart,
  faRetweet,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./Tweet.css";
import { TWEET_ENDPOINT } from "../../Utils/constants";
import { UserContext } from "../../Context/userContext";
import {
  likeTweet,
  replyToTweet,
  retweet,
  dislikeTweet,
  DeleteTweet,
} from "../../Utils/ApisCalling";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tweet = () => {
  const [tweets, setTweets] = useState([]);

  const { user } = useContext(UserContext);

  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();

  const fetchTweets = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await axios.get(TWEET_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // console.log("json data", data);
      return data;
      //debugging for checking is tweets are coming from backend
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    fetchTweets().then((data) => {
      // console.log("in useEffect", data);
      setTweets(data); // Initialize with the fetched tweets
    });
  }, []);

  // toast notifications

  // Like handler
  const handleLikeTweet = async (tweetId) => {
    try {
      const updatedTweet = await likeTweet(tweetId);
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId
            ? { ...tweet, likes: updatedTweet.likes }
            : tweet
        )
      );
      console.log("Tweet liked");
      toast.success("tweet liked");
    } catch (error) {
      console.error("Error liking tweet:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning("you already liked Tweet");
        } else if (error.response.status === 500) {
          toast.error("Server error. Tweet not liked");
        } else {
          toast.error("An error occurred. Tweet not liked");
        }
      } else {
        toast.error("An error occurred. Tweet not liked");
      }
    }
  };

  // Dislike handler
  const handleDislikeTweet = async (tweetId) => {
    try {
      const updatedTweet = await dislikeTweet(tweetId);
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId
            ? { ...tweet, likes: updatedTweet.likes }
            : tweet
        )
      );
      console.log("Tweet disliked");
      toast.success("tweet disliked");
    } catch (error) {
      console.error("Error disliking tweet:", error);
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("Server error. Tweet not disliked");
        } else {
          toast.error("An error occurred. Tweet not disliked");
        }
      } else {
        toast.error("An error occurred. Tweet not disliked");
      }
    }
  };

  // Reply handler
  const handleReplyToTweet = async (tweetId, content) => {
    try {
      const newReply = await replyToTweet(tweetId, content);
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId
            ? { ...tweet, replies: [...tweet.replies, newReply] }
            : tweet
        )
      );
      console.log("Replied to tweet");
      toast.success("replied on tweet");
      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Error replying tweet:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning("Tweet not found for reply");
        } else if (error.response.status === 500) {
          toast.error("Server error. reply failed");
        } else {
          toast.error("An error occurred. reply failed");
        }
      } else {
        toast.error("An error occurred. reply failed");
      }
    }
  };

  // Retweet handler
  const handleRetweet = async (tweetId) => {
    try {
      const updatedTweet = await retweet(tweetId);
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId
            ? { ...tweet, retweetBy: updatedTweet.retweetBy }
            : tweet
        )
      );
      console.log("Retweeted");
      toast.success("tweet Retweeted");
    } catch (error) {
      console.error("Error liking tweet:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning("you already Retweeted this tweet");
        } else if (error.response.status === 500) {
          toast.error("Server error. tweet is not retweeted");
        } else {
          toast.error("An error occurred. tweet is not retweeted");
        }
      } else {
        toast.error("An error occurred. tweet is not retweeted");
      }
    }
  };

  // delete tweet

  const handleDelete = async (tweetId) => {
    try {
      await DeleteTweet(tweetId);

      // Filter out the deleted tweet from the state
      setTweets((prevTweets) =>
        prevTweets.filter((tweet) => tweet._id !== tweetId)
      );

      console.log("Tweet deleted");
      toast.success("Tweet deleted");
    } catch (error) {
      console.error("Error deleting tweet:", error);
      if (error.response) {
        if (error.response.status === 500) {
          toast.error("Server error. Tweet is not deleted");
        } else {
          toast.error("An error occurred. Tweet is not deleted");
        }
      } else {
        toast.error("An error occurred. Tweet is not deleted");
      }
    }
  };

  //    model for reply
  const openModal = (tweetId) => {
    setReplyingTo(tweetId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setReplyingTo(null);
    setReplyContent("");
    setModalIsOpen(false);
  };

  useEffect(() => {
    // console.log("tweets ", tweets);
  }, [tweets]);

  // Get the stored user ID from local storage
  const storedUserId = localStorage.getItem("userId");

  // Debug logs
  console.log("Tweet object:", tweets);

  return (
    <div className="main-tweet-container">
      {tweets?.length !== 0 ? (
        tweets.map((tweet) => (
          <div key={tweet._id} className="tweet border-b">
            <div className="tweet-container">
              <div className="tweet-content flex p-4">
                <div className="tweet-details ml-2 w-full">
                  {Array.isArray(tweet.retweetBy) &&
                  tweet.retweetBy.length > 0 ? (
                    <p>
                      <FontAwesomeIcon icon={faRetweet} />{" "}
                      {tweet.retweetBy.map((user) => user.username).join(", ")}
                    </p>
                  ) : (
                    <p></p>
                  )}

                  <div className="tweet-header flex items-center">
                    <h1
                      className="font-bold"
                      onClick={() => navigate(`/user/${tweet.tweetedBy._id}`)}
                    >
                      {tweet.tweetedBy.username}
                    </h1>
                    <p className="text-gray-500 text-sm ml-1">
                      {tweet.tweetedBy.email}
                    </p>
                  </div>

                  <div className="tweet-description">
                    {tweet.image != null ? (
                      <div className="tweet-img">
                        <img src={tweet.image} alt="Tweet" />
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <p>{tweet.content}</p>
                  </div>
                  <div className="tweet-actions flex justify-between my-3">
                    <div className="action-item flex items-center">
                      <div
                        className="icon-wrapper p-2 hover:bg-green-200 rounded-full cursor-pointer"
                        onClick={() => openModal(tweet._id)}
                      >
                        <FontAwesomeIcon icon={faCommentDots} size="lg" />
                      </div>
                      <p>{tweet.replies ? tweet.replies.length : 0}</p>
                    </div>

                    <div className="action-item flex items-center">
                      <div
                        className="icon-wrapper rounded-full cursor-pointer"
                        onClick={() => {
                          if (tweet.likes && tweet.likes.includes(user._id)) {
                            handleDislikeTweet(tweet._id);
                          } else {
                            handleLikeTweet(tweet._id);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faHeart} size="lg" />
                      </div>
                      <p>{tweet.likes ? tweet.likes.length : 0}</p>
                    </div>

                    <div className="action-item flex items-center">
                      <div
                        className="icon-wrapper p-2 hover:bg-yellow-200 rounded-full cursor-pointer"
                        onClick={() => handleRetweet(tweet._id)}
                      >
                        <FontAwesomeIcon icon={faRetweet} />
                      </div>
                      <p>{tweet.retweetBy ? tweet.retweetBy.length : 0}</p>
                    </div>
                    {tweet.tweetedBy._id === storedUserId && (
                      <div
                        className="delete-icon p-2 cursor-pointer"
                        onClick={() => handleDelete(tweet._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <p>No tweets available</p>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Reply Modal"
        className="reply-modal"
        overlayClassName="reply-modal-overlay"
      >
        <div className="modal-header">
          <h2>Reply to Tweet</h2>
          <button onClick={closeModal} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <textarea
          className="textarea"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Write your reply..."
        />
        <div className="modal-actions">
          <button onClick={closeModal} className="modal-close-button">
            Close
          </button>
          <button
            onClick={() => handleReplyToTweet(replyingTo, replyContent)}
            className="modal-reply-button"
          >
            Reply
          </button>
        </div>
      </Modal>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Tweet;
