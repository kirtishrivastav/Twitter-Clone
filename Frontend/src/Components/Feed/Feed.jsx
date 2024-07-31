import Tweet from "../Tweet/Tweet"
import Post from "./Post"
// import { useContext } from "react"
// import { UserContext } from "../../Context/userContext"

function Feed() {
 

  return (
    
      <div className="main-container">
      <Post></Post>
      <Tweet></Tweet>
      </div> 
  )
}

export default Feed
