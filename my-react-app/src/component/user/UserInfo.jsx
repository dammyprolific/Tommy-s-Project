import React from 'react'
import styles from './UserInfo.module.css'
import pic from '../../assets/user.png'

const UserInfo = ({userInfo}) => {
  return (
    <div className='row mb-4'>
        <div className={`col-md-3 py-3 card ${styles.textCenter}`}>
                        <img
                            src={userInfo.profile_image || pic}
                            alt="User Profile"
                            className={`img-fluid rounded-circle mb-3 mx-auto ${styles.profileImage}`} 
                        />
                        <h4>{userInfo.first_name || userInfo.username ? `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() : 'User'}</h4>
                        <p className='text-muted'>{userInfo.email}</p>
                        <button className='btn mt-2' style={{ backgroundColor: '#6050DC', color:'white'}}> 
                            Edit Profile
                        </button>
        </div>
        <div className='col-md-9'>
            <div className='card'>
                <div className='card-header' style={{ backgroundColor:'#6050dc', color:'white'}}>
                    <h5>Account Overview</h5>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <p>
                                <strong>Username:</strong> {userInfo.username}
                            </p>
                            <p>
                                <strong>Full Name:</strong> {`${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim()}
                            </p>
                            <p>
                                <strong>Email:</strong> {userInfo.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {userInfo.phone}
                            </p>
                        </div>
                        <div className='col-md-6'>
                            <p>
                                <strong>City:</strong> {userInfo.city}
                            </p>
                            <p>
                                <strong>State:</strong> {userInfo.state}
                            </p>
                            <p>
                                <strong>Address:</strong> {userInfo.address}
                            </p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default UserInfo
