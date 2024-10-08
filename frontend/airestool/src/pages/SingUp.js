import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
    const [user, setUser] = useState([]);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3001/register', { email, username, password })
            .then(() => {
                setMessage("Registration successful");
                setMessageType("success");
                setEmail('');
                setUsername('');
                setPassword('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })
            .catch((error) => {
                setMessage("Unable to register");
                setMessageType("error");
                console.log("Unable to register", error);
            });
    };

    return (
        <div className='w-full h-screen flex'>
            <div className='w-[50%] h-[100%] bg-[#659DBD] text-white flex justify-center items-center'>
                <form className='text-center border rounded-lg w-[600px] h-[400px] p-9' onSubmit={handleRegister}>
                    <label>Email</label>
                    <br />
                    <input className="w-[400px] h-[40px] rounded-xl bg-[#05386B] p-2"
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <br />
                    <label>Username</label>
                    <br />
                    <input className="w-[400px] h-[40px] rounded-xl bg-[#05386B] p-2"
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <br />
                    <label>Password</label>
                    <br />
                    <input className="w-[400px] h-[40px] rounded-xl bg-[#05386B] p-2"
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <br />
                    <button className='w-[200px] h-[50px] border hover:bg-[#5CDB95]' type='submit'>Sign Up</button>
                    {message && (
                        <p className={`mt-4 text-lg ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
            <div className='w-[50%] h-[100%] bg-[#05386B] text-white flex justify-center items-center'>
                <h2 className='text-3xl text-white'>Sign Up</h2>
            </div>
        </div>
    );
}

export default SignUp;
