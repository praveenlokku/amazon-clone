import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, User } from 'lucide-react';
import { useStateValue } from '../StateProvider.jsx';

function Sidebar({ isOpen, onClose }) {
    const [{ user }] = useStateValue();

    const menuItems = [
        {
            title: "Trending",
            items: ["Best Sellers", "New Releases", "Movers and Shakers"]
        },
        {
            title: "Digital Content & Devices",
            items: ["Echo & Alexa", "Fire TV", "Kindle E-Readers & eBooks", "Amazon Prime Video", "Amazon Prime Music"]
        },
        {
            title: "Shop By Category",
            items: ["Mobiles, Computers", "TV, Appliances, Electronics", "Men's Fashion", "Women's Fashion", "Home, Kitchen, Pets"]
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[100] cursor-pointer"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[365px] bg-white z-[101] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="bg-[#232f3e] p-[10px_10px_10px_35px] flex items-center space-x-[10px] text-white">
                            <div className="bg-white rounded-full p-0.5 mt-[-1px]">
                                <User className="text-[#232f3e] h-6 w-6" />
                            </div>
                            <span className="font-bold text-[19px] tracking-[-0.5px]">Hello, {user ? user.name : 'sign in'}</span>
                        </div>

                        {/* Menu Content */}
                        <div className="flex flex-col py-2 mb-[50px]">
                            {menuItems.map((section, idx) => (
                                <div key={idx} className="border-b border-[#d5d9d9] py-[13px] last:border-0 relative">
                                    <h3 className="font-bold text-[18px] mb-[5px] px-9 text-[#111]">{section.title}</h3>
                                    <ul className="space-y-[0px]">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex items-center justify-between text-[#111] hover:bg-[#eaeded] px-9 py-[13px] cursor-pointer transition-colors text-[14px]">
                                                {item}
                                                <ChevronRight className="h-[20px] text-[#888]" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {user && (
                                <div className="border-t border-[#d5d9d9] py-[13px] relative">
                                    <h3 className="font-bold text-[18px] mb-[5px] px-9 text-[#111]">Help & Settings</h3>
                                    <ul className="space-y-[0px]">
                                        <li className="text-[#111] hover:bg-[#eaeded] px-9 py-[13px] cursor-pointer transition-colors text-[14px]">Your Account</li>
                                        <li className="text-[#111] hover:bg-[#eaeded] px-9 py-[13px] cursor-pointer transition-colors text-[14px]">Customer Service</li>
                                        <li
                                            onClick={() => {
                                                localStorage.removeItem('user');
                                                window.location.reload();
                                            }}
                                            className="text-[#111] hover:bg-[#eaeded] px-9 py-[13px] cursor-pointer transition-colors text-[14px]"
                                        >
                                            Sign Out
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Close Button placed outside relative to wrapper */}
                    <div
                        onClick={onClose}
                        className="fixed top-4 left-[380px] z-[110] cursor-pointer text-white hover:text-gray-200 transition-colors drop-shadow-md"
                    >
                        <X className="h-9 w-9" strokeWidth={1.5} />
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Sidebar;
