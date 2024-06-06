import {FaSignInAlt,FaSignOutAlt,FaUser} from 'react-icons/fa'
import {Link,useNavigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import {logout,reset} from '../features/auth/authSlice'
import Avatar from '@mui/material/Avatar';
import School from '@mui/icons-material/School';
import Button from '@mui/material/Button'

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        console.log("logout click")
            dispatch(logout())
            dispatch(reset())
            navigate('/')
    }
  return (
    <header className='header'>
        <div className='logo'>
            {/* <Link to='/'>GoalSetter</Link> */}
            <Avatar sx={{ m:1, bgcolor: '#1E56A0' }} >
            <School />
          </Avatar>
        </div>
        <ul>
            {user ? (
                 <li>
                 <Button onClick={onLogout} className='buttoncolor' >
                     <FaSignOutAlt/>Logout
                 </Button>
                 </li>
            ) : (
                <>
                {/* <li>
                <Link to='/login'>
                    <FaSignInAlt/>Login
                </Link>
                </li>
                <li>
                    <Link to='/register'>
                        <FaUser/>Register
                    </Link>
                </li> */}
                </>
            )}
           
        </ul>
    </header>
  )
}

export default Header