import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api.js';
import AuthFooter from '../components/AuthFooter.jsx';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [, dispatch] = useStateValue();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        // Security check: capital, special char, number
        const hasCapital = /[A-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!hasCapital || !hasSpecial || !hasNumber) {
            alert("Password must include at least one capital letter, one special character, and one number for improved security.");
            return;
        }

        setLoading(true);
        try {
            // Register User directly
            const { data } = await axios.post(
                `${API_BASE_URL}/api/users/register/`,
                { 'name': name, 'email': email, 'password': password }
            );

            dispatch({
                type: 'SET_USER',
                user: data
            });

            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }

        setLoading(true);
        try {
            // 1. Verify OTP
            await axios.post(`${API_BASE_URL}/api/users/verify-otp/`, {
                email,
                code: otp,
                is_registration: true
            });

            // 2. Register User
            const { data } = await axios.post(
                `${API_BASE_URL}/api/users/register/`,
                { 'name': name, 'email': email, 'password': password }
            );

            dispatch({
                type: 'SET_USER',
                user: data
            });

            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.detail || "Verification failed. Please check the OTP.");
        } finally {
            setLoading(false);
        }
    };

    // OTP screen removed as requested - "Feature coming soon"

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

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-[13px] font-bold mb-1 ml-0.5">Your name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                            placeholder="First and last name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold mb-1 ml-0.5">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
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
                            required
                        />
                        <div className="flex items-center space-x-2 mt-1 ml-0.5">
                            <span className="italic text-blue-600 font-serif font-bold text-[14px]">i</span>
                            <span className="text-[12px]">Passwords must be at least 6 characters.</span>
                        </div>
                    </div>

                    <p className="text-[13px] italic text-gray-500 py-2">
                        Email verification via OTP will be implemented very soon. You can register directly for now.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="button w-full py-1.5 text-[13px] font-medium rounded-[3px] shadow-sm mt-2 flex justify-center items-center"
                    >
                        {loading ? 'Registering...' : 'Create your Amazon account'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-[13px]">
                        Already have an account? <Link to="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Sign in</Link>
                    </p>
                </div>

                <p className="text-[12px] mt-6 leading-tight">
                    By creating an account, you agree to Amazon's <span className="text-[#0066c0] hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:underline cursor-pointer">Privacy Notice</span>.
                </p>
            </div>

            <AuthFooter />
        </div>
    );
}

export default Signup;
