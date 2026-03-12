import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';
import axios from 'axios';
import { countryCodes } from '../utils/countryCodes.js';

function Login() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ code: 'IN', dial: '+91' });
    const [, dispatch] = useStateValue();

    const handleContinue = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setStep(2);
        } else {
            alert("Please enter a valid mobile number or email.");
        }
    };

    const signIn = async (e) => {
        e.preventDefault();

        if (email && password) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const { data } = await axios.post(
                    'http://localhost:8000/api/users/login/',
                    { 'username': email, 'password': password },
                    config
                );

                dispatch({
                    type: 'SET_USER',
                    user: data
                });

                localStorage.setItem('user', JSON.stringify(data));
                navigate('/');
            } catch (error) {
                alert(error.response?.data?.detail || "Invalid email or password.");
            }
        } else {
            alert("Please enter both email and password.");
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col items-center pt-3 p-6 text-[#111]">
            <Link to="/">
                <div className="flex flex-col items-center mb-4 mt-2">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                        alt="Amazon Logo"
                        className="h-[31px] w-auto object-contain mt-2"
                    />
                    <span className="text-black text-[13px] translate-x-[42px] -translate-y-[10px] bg-white px-0.5">.in</span>
                </div>
            </Link>

            {step === 1 && (
                <>
                    <div className="w-[350px] border border-[#ddd] rounded-[8px] p-[26px] pb-6 flex flex-col z-10">
                        <h1 className="text-[28px] font-normal mb-3 leading-[1.2]">Sign in <span className="text-[20px] font-normal">or</span> create account</h1>

                        <form className="space-y-4" onSubmit={handleContinue}>
                            <div>
                                <label className="block text-[13px] font-bold mb-[2px]">Enter mobile number or email</label>
                                <div className={`flex ${(email && /\d/.test(email)) ? 'gap-[6px]' : ''}`}>
                                    {/* Country Code Dropdown - Only show if string contains numbers */}
                                    {(email && /\d/.test(email)) && (
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className="flex bg-[#f3f3f3] hover:bg-[#e7e9ec] border border-[#a6a6a6] rounded-[3px] items-center px-2 py-[7px] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset] transition-colors h-full"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            >
                                                <span className="text-[13px] text-[#0f1111]">{selectedCountry.code} {selectedCountry.dial}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="10" height="10" className="text-[#333] ml-[6px] mt-0.5">
                                                    <path fill="currentColor" d="M12.53 5.47a.75.75 0 0 0-1.06 0L8 8.94 4.53 5.47a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l4-4a.75.75 0 0 0 0-1.06z" />
                                                </svg>
                                            </div>

                                            {isDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                                    <div className="absolute top-full left-0 mt-1 w-[280px] bg-white border border-[#cdcdcd] rounded-[3px] shadow-[0_2px_4px_rgba(0,0,0,0.13)] z-50 max-h-[250px] overflow-y-auto">
                                                        <ul className="py-1">
                                                            {countryCodes.map((country, index) => (
                                                                <li
                                                                    key={index}
                                                                    className={`px-3 py-1.5 text-[13px] hover:bg-[#f3f3f3] hover:text-[#e77600] cursor-pointer border-l-[3px] ${selectedCountry.code === country.code ? 'bg-[#f3f3f3] border-l-[#e77600] text-[#e77600] font-bold' : 'border-l-transparent'}`}
                                                                    onClick={() => {
                                                                        setSelectedCountry(country);
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    {country.name} {country.dial}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Input Field */}
                                    <div className={`group/input flex flex-grow border border-[#a6a6a6] rounded-[3px] bg-white focus-within:border-[#007185] focus-within:shadow-[0_0_0_3px_#c8f3fa,inset_0_1px_2px_rgba(0,0,0,.15)] transition-all overflow-hidden items-center shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset]`}>
                                        <input
                                            type="text"
                                            className="w-full py-[7px] pl-[10px] pr-2 outline-none text-[13px] text-[#0f1111]"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            autoFocus
                                        />
                                        {email && (
                                            <div
                                                className="cursor-pointer flex items-center justify-center px-2 py-2 text-[#0f1111] hover:bg-[#f3f3f3] transition-colors h-full flex-shrink-0"
                                                onClick={() => setEmail('')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <button
                                type="submit"
                                className="w-full py-[5px] text-[13px] font-normal rounded-[8px] hover:bg-[#F7CA00] bg-[#FFD814] border border-[#FCD200] shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors"
                            >
                                Continue
                            </button>
                        </form>

                        <p className="text-[12px] text-[#111] mt-[18px] leading-[1.5]">
                            By continuing, you agree to Amazon's <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>.
                        </p>

                        <div className="mt-[22px] flex items-center space-x-1 cursor-pointer group">
                            <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[4px] border-y-transparent border-l-[#666] group-hover:border-l-[#c45500] transition-colors ml-1" />
                            <span className="text-[13px] text-[#0066c0] hover:text-[#c45500] hover:underline">Need help?</span>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#e7e7e7]">
                            <span className="text-[13px] font-bold">Buying for work?</span>
                            <div className="text-[13px] text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Create a free business account</div>
                        </div>
                    </div>

                    <div className="w-[350px] relative mt-6 flex flex-col items-center">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#e7e7e7] z-0"></div>
                        <span className="bg-white px-3 text-[12px] text-[#767676] z-10">New to Amazon?</span>
                    </div>

                    <Link to="/signup" className="w-[350px] mt-3 pb-8">
                        <button className="w-full bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] py-[5px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[13px] rounded-[8px] transition-colors font-normal">
                            Create your Amazon account
                        </button>
                    </Link>
                </>
            )}

            {step === 2 && (
                <div className="w-[350px] border border-[#ddd] rounded-[8px] p-[26px] pb-[22px] flex flex-col z-10">
                    <h1 className="text-[28px] font-normal mb-2 leading-[1.2]">Sign in</h1>

                    <div className="text-[13px] text-[#111] mb-3 flex items-center gap-1">
                        <span>{email}</span>
                        <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer font-normal" onClick={() => setStep(1)}>
                            Change
                        </span>
                    </div>

                    <form className="space-y-[14px]" onSubmit={signIn}>
                        <div>
                            <div className="flex justify-between items-baseline mb-[2px]">
                                <label className="block text-[13px] font-bold">Password</label>
                                <span className="text-[13px] text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Forgot password?</span>
                            </div>
                            <input
                                type="password"
                                className="w-full border border-[#a6a6a6] p-[6px] px-2 rounded-[3px] outline-none focus:border-[#007185] focus:shadow-[0_0_0_3px_#c8f3fa,inset_0_1px_2px_rgba(15,11,17,.15)] shadow-[0_1px_2px_rgba(0,0,0,0.2)_inset]"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-[5px] text-[13px] font-normal rounded-[8px] hover:bg-[#F7CA00] bg-[#FFD814] border border-[#FCD200] shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="flex items-center mt-4 mb-1">
                        <input type="checkbox" className="w-[14px] h-[14px] mr-2 cursor-pointer" />
                        <span className="text-[13px] text-[#111]">Keep me signed in. <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">Details</span></span>
                    </div>

                    <div className="flex items-center my-[14px] relative">
                        <div className="flex-grow border-t border-[#e7e7e7]"></div>
                        <span className="flex-shrink-0 mx-[10px] text-[#767676] text-[12px]">or</span>
                        <div className="flex-grow border-t border-[#e7e7e7]"></div>
                    </div>

                    <button className="w-full bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] py-[5px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[13px] rounded-[8px] transition-colors font-normal">
                        Sign in with a passkey
                    </button>

                    <button className="w-full bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] py-[5px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[13px] rounded-[8px] transition-colors font-normal mt-3">
                        Get an OTP on your phone
                    </button>
                </div>
            )}

            <div className={`border-t border-[#e7e7e7] w-full flex flex-col items-center pt-8 bg-gradient-to-t from-white to-[#fafafa] flex-grow ${step === 2 ? 'mt-8' : 'mt-0'}`}>
                <div className="flex space-x-7 text-[11px] text-[#0066c0]">
                    <span className="hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span>
                    <span className="hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>
                    <span className="hover:text-[#c45500] hover:underline cursor-pointer">Help</span>
                </div>
                <p className="text-[11px] text-[#555] mt-3 mb-10">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
            </div>
        </div>
    );
}

export default Login;
