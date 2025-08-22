import React, { useEffect , useState, useContext } from 'react'
import UserInfo from './UserInfo'
import OrderHistoryItemContainer from './OrderHistoryItemContainer'
import api from '../../api'
import Spinner from '../uis/Spinner'
import { AuthContext } from '../../context/AuthContext'

const UserProfilePage = () => {
    const [userInfo, setUserInfo] = useState({})
    const [orderitems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(false)
    const { username } = useContext(AuthContext) // or use isAuthenticated if that's more reliable

    useEffect(function(){
        setUserInfo({}); // Clear previous user info immediately on username change
        setLoading(true);
        api.get("user_info/")
        .then(res => {
            setUserInfo(res.data)
            setOrderItems(res.data.items);
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
        })
    }, [username]) // re-run when username changes

    if (loading){
        return <Spinner loading={loading} />
    }
    return (
        <div className='container my-5'>
            <UserInfo userInfo={userInfo}/>
            <OrderHistoryItemContainer orderitems={orderitems} />
        </div>
    )
}

export default UserProfilePage