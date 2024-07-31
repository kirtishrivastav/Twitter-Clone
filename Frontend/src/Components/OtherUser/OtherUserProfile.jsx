import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
// import UserTweets from "../Profile/UserTweets";
import { TWEET_ENDPOINT } from "../../Utils/constants";
import {
  faHeart,
  faComment,
  faRetweet,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  likeTweet,
  replyToTweet,
  retweet,
  dislikeTweet,
} from "../../Utils/ApisCalling";
import Modal from "react-modal";

function OtherUserProfile() {
  const [isFollowing, setIsFollowing] = useState(false);

  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [tweetsLoading, setTweetsLoading] = useState(true);

  // actions states
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // action handlers

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
        if (error.response.status === 500) {
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

  // user tweets
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      try {
        const response = await axios.get(
          `http://localhost:5000/API/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
        // Check if the current user is following the profile user
        if (user.followers.includes(currentUserId)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

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
  // follow funtionality
  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId");

    try {
      await axios.post(
        `http://localhost:5000/API/user/${userId}/follow`,
        { userId: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser((prevUser) => ({
        ...prevUser,
        followers: [...prevUser.followers, currentUserId],
      }));
      setIsFollowing(true);
      toast.success("started following");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("error follwing");
    }
  };

  // unfollow functionality
  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId");
  
    try {
      await axios.post(
        `http://localhost:5000/API/user/${userId}/unfollow`,
        { userId: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser((prevUser) => ({
        ...prevUser,
        followers: prevUser.followers.filter((id) => id !== currentUserId),
      }));
      setIsFollowing(false);
      toast.success("Unfollowed user");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Error unfollowing user");
    }
  };
  

  console.log("other user infor", user);
  console.log(isFollowing);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className="container profile-container">
        <Container>
          <div className="details text-center">
            <div className="profile-header">
              <img
                src="https://i.pinimg.com/736x/cb/18/a5/cb18a5c37122194375bf51a4b903d962.jpg"
                alt="Cover"
                className="img-fluid profile-cover"
              />
            </div>

            <div className="top">
              <div className="image">
                <img
                  src={
                    user?.profilePicture ||
                    "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                  }
                  alt="Profile"
                  className=" profile-photo"
                />
              </div>
            </div>
            <span className="other_userName">{user?.username}</span>

            <div className="actions">
              {/* <h3 className="user_name">{user.name}</h3> */}

              <div>
      {isFollowing ? (
        <button className="btn btn-secondary btn-sm pic-btn" onClick={handleUnfollow}>
          Unfollow
        </button>
      ) : (
        <button className="btn btn-primary btn-sm pic-btn" onClick={handleFollow}>
          Follow
        </button>
      )}
    </div>
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
                        {tweet.retweetBy
                          .map((user) => user.username)
                          .join(", ")}
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
                          {tweet.retweetBy.length}
                        </div>
                      </div>
                      {user?._id === tweet?._id && (
                        <div
                          // onClick={() => deleteTweetHandler(tweet?._id)}
                          className="action-item flex items-center"
                        >
                          <div className="icon-wrapper p-2 hover:bg-red-300 rounded-full cursor-pointer">
                            <FontAwesomeIcon icon={faTrash} size="lg" />
                          </div>
                        </div>
                      )}
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
      </div>
    </>
  );
}

export default OtherUserProfile;
