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
                        <div className="bg-amazon-blue p-4 flex items-center space-x-3 text-white sticky top-0 z-10">
                            <div className="bg-white rounded-full p-1">
                                <User className="text-amazon-blue h-6 w-6" />
                            </div>
                            <span className="font-bold text-lg">Hello, {user ? user.name : 'sign in'}</span>
                        </div>

                        {/* Menu Content */}
                        <div className="flex flex-col py-2">
                            {menuItems.map((section, idx) => (
                                <div key={idx} className="border-b border-gray-200 py-4 px-8 last:border-0">
                                    <h3 className="font-bold text-[18px] mb-3">{section.title}</h3>
                                    <ul className="space-y-4">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex items-center justify-between text-gray-700 hover:bg-gray-100 -mx-8 px-8 py-2 cursor-pointer transition-colors text-[14px]">
                                                {item}
                                                <ChevronRight className="h-4 text-gray-400" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {user && (
                                <div className="border-t border-gray-200 py-4 px-8 mt-2">
                                    <h3 className="font-bold text-[18px] mb-3">Help & Settings</h3>
                                    <ul className="space-y-4">
                                        <li className="text-gray-700 hover:bg-gray-100 -mx-8 px-8 py-2 cursor-pointer transition-colors text-[14px]">Your Account</li>
                                        <li className="text-gray-700 hover:bg-gray-100 -mx-8 px-8 py-2 cursor-pointer transition-colors text-[14px]">Customer Service</li>
                                        <li
                                            onClick={() => {
                                                localStorage.removeItem('user');
                                                window.location.reload();
                                            }}
                                            className="text-gray-700 hover:bg-gray-100 -mx-8 px-8 py-2 cursor-pointer transition-colors text-[14px] font-medium"
                                        >
                                            Sign Out
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <div
                            onClick={onClose}
                            className="absolute top-4 -right-12 cursor-pointer text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="h-8 w-8" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Sidebar;
