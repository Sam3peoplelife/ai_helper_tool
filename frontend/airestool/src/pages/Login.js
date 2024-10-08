import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [user, setUser] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/login", { username, password });
            const token = response.data.token;
            setMessage('Login successful');
            setMessageType('success');
            setUsername('');
            setPassword('');
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            setTimeout(() => {
                navigate('/account');
                window.location.reload();
            }, 2000);
        } catch (error) {
            setMessage('Login error');
            setMessageType('error');
            console.log("Login error", error);
        }
    };

    return (
        <div className='w-full h-screen flex'>
            <div className='w-[50%] h-[100%] bg-[#659DBD] text-white flex justify-center items-center'>
                <form className='text-center border rounded-lg w-[600px] h-[400px] p-9' onSubmit={handleLogin}>
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
                    <button className='w-[200px] h-[50px] border hover:bg-[#5CDB95]' type='submit'>Login</button>
                    {message && (
                        <p className={`mt-4 text-lg ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
            <div className='w-[50%] h-[100%] bg-[#05386B] text-white flex justify-center items-center'>
                <h2 className='text-3xl text-white'>LOGIN</h2>
            </div>
        </div>
    );
}

export default Login;
