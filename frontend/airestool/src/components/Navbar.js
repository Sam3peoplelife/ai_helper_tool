import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const isUserSigned = !!localStorage.getItem('token')
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate("/login");
    };

  return (
    <nav className='flex justify-around p-3 items-center bg-[#242582] text-zinc-300'>
        <Link to="/"><h1 className='text-3xl'>AIResTool</h1></Link>
        <ul className='flex gap-6'>
            {isUserSigned?(
                <>
                    <Link to="/account"><h1>Account</h1></Link>
                    <Link to="/predictorupdate"><h1>Model</h1></Link>
                    <li><button onClick={handleSignOut}>Sign Out</button></li>
                </>
            ) : (
            <>
                <Link to="/login"><h1>Login</h1></Link>
                <Link to="/signup"><h1>SignUp</h1></Link>
            </>
        )}
            
        </ul>
    </nav>
  )
}

export default Navbar
