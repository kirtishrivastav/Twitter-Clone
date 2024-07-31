import axios from "axios";

import { TWEET_ENDPOINT } from "./constants"; 
import { USER_ENDPOINT } from "./constants";

 // Function to like a tweet
export const likeTweet = async (tweetId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${TWEET_ENDPOINT}/${tweetId}/like`, {}, config);
    return response.data;
   
  } catch (error) {
    console.error("Error liking tweet:", error);
    throw error;
  }
};

// Function to dislike a tweet
export const dislikeTweet = async (tweetId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${TWEET_ENDPOINT}/${tweetId}/dislike`, {}, config);
    return response.data;
  } catch (error) {
    console.error("Error disliking tweet:", error);
    throw error;
  }
};

// Function to reply to a tweet
export const replyToTweet = async (tweetId, content) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const body = { content };
    const response = await axios.post(`${TWEET_ENDPOINT}/${tweetId}/reply`, body, config);
    return response.data;
  } catch (error) {
    console.error("Error replying to tweet:", error);
    throw error;
  }
};

// retweet
export const retweet = async (tweetId) => {
  try {
    const token = localStorage.getItem('token'); // the token is saved in localStorage
    if (!token) {
      throw new Error('No token found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(`${TWEET_ENDPOINT}/${tweetId}/retweet`, {}, config);

    if (response.status === 200) {
      console.log('Retweet successful', response.data);
      return response 
      // Handle successful retweet (e.g., update the UI)
    } else {
      console.error('Error retweeting', response.data);
      // Handle the error response
    }
  } catch (error) {
    console.error('Error retweeting', error);
    // Handle the error (e.g., show an error message to the user)
  }
};

export const getAllTweets = async (token) => {
  try {
    const response = await axios.get(`${TWEET_ENDPOINT}/`, {
      headers: {
        Authorization: `Bearer ${token}` // Use the token saved in local storage for authentication
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};


// Function to edit user details
export const editUser = async (userId, userDetails, token) => {
  try {
    const response = await axios.put(
      `${USER_ENDPOINT }/${userId}`,
      userDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('User updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
  }
};


export const DeleteTweet = async (tweetId) => {
  try {
    const token = localStorage.getItem("token"); // Assuming you have a token for authentication

    const response = await axios.delete(`${TWEET_ENDPOINT}/delete/${tweetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("Tweet has been deleted");
      return response.data.tweets; // Return the updated list of tweets
    }
  } catch (error) {
    console.error("Error deleting tweet:", error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for higher-level handling
  }
};
