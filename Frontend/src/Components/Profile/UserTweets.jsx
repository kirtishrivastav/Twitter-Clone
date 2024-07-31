import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { TWEET_ENDPOINT } from "../../Utils/constants";
import { UserContext } from "../../Context/userContext";
import {
  faHeart,
  faComment,
  faRetweet,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Profile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import {
  likeTweet,
  replyToTweet,
  retweet,
  dislikeTweet,
  DeleteTweet
} from "../../Utils/ApisCalling";
import Modal from "react-modal";
function UserTweets() {
  const { user, loading } = useContext(UserContext);
  const [tweets, setTweets] = useState([]);
  const [tweetsLoading, setTweetsLoading] = useState(true);

  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  //   console.log("user from userContext", user);

  //  fetch tweets of the user who logged in
  useEffect(() => {
    const fetchTweets = async (userID) => {
      userID = user._id;
      if (!user || !userID) return;

      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          `${TWEET_ENDPOINT}/allTweets/${userID}`,
          config
        );
        setTweets(response.data);
        // debugg

        console.log("response from fetch", response.data);
        setTweetsLoading(false);
      } catch (error) {
        console.error("Error fetching tweets:", error);
        setTweetsLoading(false);
      }
    };

    if (user) {
      fetchTweets();
    }
  }, [user]);

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

  // model for reply
  const openModal = (tweetId) => {
    setReplyingTo(tweetId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setReplyingTo(null);
    setReplyContent("");
    setModalIsOpen(false);
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  console.log("tweets state", tweets);
  // console.log("tweeted by from tweets",tweets.tweetedBy.email);
  // console.log(user._id)
  return (
    <>
      <div className="row tweets">
        <h3>Tweets and Replies</h3>
        <div className="col-md-12 profile-tweets">
          {tweetsLoading ? (
            <p>Loading tweets...</p>
          ) : tweets?.length > 0 ? (
            tweets.map((tweet, _id) => {
              return (
                <div className="tweet" key={_id}>

                  {tweet.retweetBy.length > 0 ? (
                    <p>
                      <FontAwesomeIcon icon={faRetweet} />{" "}
                      {tweet.retweetBy.map((user) => user.username).join(", ")}
                    </p>
                  ) : (
                    <p></p>
                  )}
                 

                  <p>{new Date(tweet.createdAt).toDateString()}</p>
                  {tweet.image != null ? (
                    <div className="tweet-img">
                      <img src={tweet.image} alt="Tweet" />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <p>{tweet?.content}</p>
                 


                  <div className="tweet-action flex justify-between my-3">
                    <div className="action-item flex items-center">
                      <div
                        className="icon-wrapper p-2 hover:bg-green-200 rounded-full cursor-pointer"
                        onClick={() => openModal(tweet._id)}
                      >
                        <FontAwesomeIcon icon={faComment} size="lg" />
                      </div>
                      <p>{tweet.reply ? tweet.reply.length : 0}</p>
                    </div>
                    <div className="action-item flex items-center">
                      <div
                        className="icon-wrapper rounded-full cursor-pointer"
                        onClick={() => {
                          if (
                            tweet.likes &&
                            tweet.likes.includes(user._id)
                          ) {
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
                        {tweet.retweetBy.length}
                      </div>
                    </div>
                     {/* delete */}
                  <div
                  className="delete-icon p-2 cursor-pointer"
                  onClick={() => handleDelete(tweet._id)}
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </div>
                   
                  </div>
                </div>
              );
            })
          ) : (
            <p>No tweets yet.</p>
          )}

          {/* model */}
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
        </div>
        <ToastContainer></ToastContainer>
      </div>
    </>
  );
}

export default UserTweets;
