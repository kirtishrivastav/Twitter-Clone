
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { Link } from 'react-router-dom';
import './RightPanel.css';

const WhoToFollow = () => {
    // Sample static users data
    const otherUsers = [
        {
            _id: '1',
            name: 'John Doe',
            username: 'johndoe',
            avatar: 'https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg'
        },
        {
            _id: '2',
            name: 'Jane Smith',
            username: 'janesmith',
            avatar: 'https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg'
        }
    ];

    return (
        <div className='who-to-follow-container'>
            <div className='search-bar'>
                <FontAwesomeIcon icon={faSearch} size="lg" />
                <input type="text" className='search-input' placeholder='Search' />
            </div>
            <div className='follow-suggestions'>
                <h1 className='suggestions-title'>Who to follow</h1>
                {otherUsers.map((user) => {
                    return (
                        <div key={user._id} className='user-card'>
                            <div className='user-info'>
                                <img src={user.avatar} alt={`${user.name}'s avatar`} className='avatar' />
                                <div className='user-details'>
                                    <h1 className='user-name'>{user.name}</h1>
                                    <p className='user-username'>{`@${user.username}`}</p>
                                </div>
                            </div>
                            <div>
                                <a to={`/profile/${user._id}`}>
                                    <button className='profile-button'>Profile</button>
                                </a>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default WhoToFollow;

