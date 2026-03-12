import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, dispatch] = useStateValue();

    const register = async (e) => {
        e.preventDefault();

        if (name && email && password) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const { data } = await axios.post(
                    'http://localhost:8000/api/users/register/',
                    { 'name': name, 'email': email, 'password': password },
                    config
                );

                dispatch({
                    type: 'SET_USER',
                    user: data
                });

                localStorage.setItem('user', JSON.stringify(data));
                navigate('/');
            } catch (error) {
                alert(error.response?.data?.detail || "Registration failed.");
            }
        } else {
            alert("Please fill in all fields.");
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col items-center p-6 text-[#111]">
            <Link to="/">
                <div className="flex flex-col items-center mb-6 pt-2">
                    <div className="flex items-baseline">
                        <span className="text-black font-black text-3xl tracking-tighter">amazon</span>
                        <span className="text-black text-xs ml-0.5">.in</span>
                    </div>
                </div>
            </Link>

            <div className="w-[350px] border border-gray-300 rounded-lg p-6 flex flex-col">
                <h1 className="text-3xl font-normal mb-4">Create Account</h1>

                <form className="space-y-4">
                    <div>
                        <label className="block text-[13px] font-bold mb-1 ml-0.5">Your name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                            placeholder="First and last name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold mb-1 ml-0.5">Mobile number or Email</label>
                        <input
                            type="text"
                            className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold mb-1 ml-0.5">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="flex items-center space-x-2 mt-1 ml-0.5">
                            <span className="italic text-blue-600 font-serif font-bold text-[14px]">i</span>
                            <span className="text-[12px]">Passwords must be at least 6 characters.</span>
                        </div>
                    </div>

                    <p className="text-[13px] font-bold py-2">
                        To verify your number, we will send you a text message with a temporary code. Message and data rates may apply.
                    </p>

                    <button
                        type="submit"
                        onClick={register}
                        className="button w-full py-1.5 text-[13px] font-medium rounded-[3px] shadow-sm mt-2"
                    >
                        Verify mobile number
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-[13px]">
                        Already have an account? <Link to="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Sign in</Link>
                    </p>
                    <p className="text-[13px] mt-4">
                        Buying for work? <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Create a free business account</span>
                    </p>
                </div>

                <p className="text-[12px] mt-6 leading-tight">
                    By creating an account, you agree to Amazon's <span className="text-[#0066c0] hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:underline cursor-pointer">Privacy Notice</span>.
                </p>
            </div>

            <div className="mt-10 border-t border-gray-200 w-full flex flex-col items-center pt-8 bg-gradient-to-t from-[#fff] to-[#fafafa] flex-grow">
                <div className="flex space-x-10 text-[11px] text-[#0066c0]">
                    <span className="hover:underline cursor-pointer">Conditions of Use</span>
                    <span className="hover:underline cursor-pointer">Privacy Notice</span>
                    <span className="hover:underline cursor-pointer">Help</span>
                </div>
                <p className="text-[11px] text-[#555] mt-4">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
            </div>
        </div>
    );
}

export default Signup;
