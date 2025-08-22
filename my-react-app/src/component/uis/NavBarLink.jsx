import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as necessary

const NavBarLink = () => {

  const { isAuthenticated , setIsAuthenticated, username} = useContext(AuthContext);

  function logout(){
    localStorage.removeItem("access");
    localStorage.removeItem("cart_code"); // Clear cart for next user
    // Optionally, reset cart count if you have a setter in context or props
    if (typeof window.setNumberCartItems === 'function') {
      window.setNumberCartItems(0);
    }
    setIsAuthenticated(false);
  }
  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      {isAuthenticated ?
        <>

          <li className='nav-item'>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
            }
              end
            >
              {`Hi,${username}`}
            </NavLink>
          </li>
          <li className='nav-item' onClick={logout}>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"}
              end
            >
              logout
            </NavLink>
          </li>
        </>
        :
        <>

          <li className='nav-item'>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"}

              end
            >
              Login

            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to="/register"
              className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
              }
              end
            >
              Register
            </NavLink>
          </li>
        </>
      }





    </ul>
  )
}

export default NavBarLink;
