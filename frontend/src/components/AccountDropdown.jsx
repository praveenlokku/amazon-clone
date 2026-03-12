import React from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';

const buyItAgainItems = [
    {
        id: 1,
        title: "Mamypoko pants All night absorb| Pant Style...",
        price: "560.00",
        per_count: "(₹8.00/count)",
        image: "https://m.media-amazon.com/images/I/61k1bEaCHcL._AC_SX425_.jpg"
    },
    {
        id: 2,
        title: "Home Sizzler 2 Pieces 3D Maple Eyelet Polyester...",
        price: "339.00",
        per_count: "",
        image: "https://m.media-amazon.com/images/I/81I-1XF+09L._SX425_.jpg"
    },
    {
        id: 3,
        title: "Stayfree Secure xl | Combo packs 120 Pads...",
        price: "546.00",
        per_count: "(₹4.55/count)",
        image: "https://m.media-amazon.com/images/I/61I2oP+JpwL._SX425_.jpg"
    },
    {
        id: 4,
        title: "NIVEA Luminous Even Glow Oil Control Day Cream...",
        price: "269.00",
        per_count: "(₹672.50/100 ml)",
        image: "https://m.media-amazon.com/images/I/41K+-T1d3SL._SX425_.jpg"
    }
];

function AccountDropdown({ handleAuthentication }) {
    const [{ user }] = useStateValue();

    return (
        <div className="absolute right-[-140px] top-[48px] pt-1 z-[100] cursor-default hidden group-hover:block drop-shadow-md">
            <div className="w-[850px] bg-white border border-[#ccc] rounded-[3px] p-4 text-[#111] shadow-[0_4px_10px_rgba(0,0,0,0.15)] relative">
                {/* Triangle pointer border */}
                <div className="absolute top-[-11px] right-[148px] w-0 h-0 border-x-[11px] border-x-transparent border-b-[11px] border-b-[#ccc]"></div>
                {/* Triangle pointer inner */}
                <div className="absolute top-[-10px] right-[149px] w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-white z-[1]"></div>

                {/* Top Profile Selection Bar */}
                <div className="w-full bg-[#f3f8fa] p-3 rounded-[3px] flex justify-between items-center mb-4 text-[13px]">
                    <div className="text-[#333]">Who is shopping? Select a profile.</div>
                    <div className="text-teal-700 font-medium cursor-pointer hover:underline hover:text-red-700 flex items-center pr-1">
                        Manage Profiles <span className="ml-[2px] text-[10px]">{'>'}</span>
                    </div>
                </div>

                <div className="flex">
                    {/* Left Column: Buy it again */}
                    <div className="w-[40%] border-r border-[#eee] pr-4">
                        <h3 className="font-bold text-[16px] mb-1">Buy it again</h3>
                        <a href="#" className="text-teal-700 text-[13px] hover:underline hover:text-red-700 block mb-3">View All & Manage</a>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                            {buyItAgainItems.map((item) => (
                                <div key={item.id} className="flex gap-3 items-center">
                                    <div className="w-[80px] h-[80px] flex-shrink-0 flex items-center justify-center p-1 cursor-pointer">
                                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="flex flex-col">
                                        <a href="#" className="text-teal-700 text-[14px] hover:underline hover:text-red-700 line-clamp-2 leading-tight">
                                            {item.title}
                                        </a>
                                        <div className="flex items-center mt-1">
                                            <span className="text-[#B12704] text-[14px] leading-tight">
                                                ₹{item.price}
                                            </span>
                                            {item.per_count && (
                                                <span className="text-[#565959] text-[12px] leading-tight ml-1">
                                                    {item.per_count}
                                                </span>
                                            )}
                                        </div>
                                        <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-[100px] px-3 py-[3px] text-[12px] text-[#0F1111] shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-fit mt-1 drop-shadow-sm font-medium">
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Middle Column: Your Lists */}
                    <div className="w-[30%] px-5 border-r border-[#eee]">
                        <h3 className="font-bold text-[16px] mb-3">Your Lists</h3>
                        <ul className="space-y-[6px] text-[#444] text-[13px]">
                            <li>
                                <a href="#" className="hover:text-red-700 hover:underline">
                                    Alexa Shopping List
                                    <span className="text-[#767676] text-[11px] block leading-none mt-1">0 items</span>
                                </a>
                            </li>
                            <hr className="my-[10px] border-[#eee]" />
                            <li><a href="#" className="hover:text-red-700 hover:underline">Shopping List</a></li>
                            <hr className="my-[10px] border-[#eee]" />
                            <li><a href="#" className="hover:text-red-700 hover:underline">Create a Wish List</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Wish from Any Website</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Baby Wishlist</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Discover Your Style</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Explore Showroom</a></li>
                        </ul>
                    </div>

                    {/* Right Column: Your Account */}
                    <div className="w-[30%] pl-5">
                        <h3 className="font-bold text-[16px] mb-3">Your Account</h3>
                        <ul className="space-y-[6px] text-[#444] text-[13px]">
                            <li><a href="#" className="hover:text-red-700 hover:underline">Switch Accounts</a></li>
                            <li>
                                {user ? (
                                    <span onClick={handleAuthentication} className="cursor-pointer hover:text-red-700 hover:underline text-[#444]">Sign Out</span>
                                ) : (
                                    <Link to="/login" className="hover:text-red-700 hover:underline">Sign In</Link>
                                )}
                            </li>
                            <hr className="my-[10px] border-[#eee]" />
                            <li><Link to="/profile" className="hover:text-red-700 hover:underline">Your Account</Link></li>
                            <li><Link to="/orders" className="hover:text-red-700 hover:underline">Your Orders</Link></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Your Wish List</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Keep shopping for</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Your Recommendations</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Returns</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Recalls and Product Safety Alerts</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Your Prime Membership</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Your Prime Video</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Your Subscribe & Save Items</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Memberships & Subscriptions</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Your Seller Account</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Content Library</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Devices</a></li>
                            <li><a href="#" className="hover:text-red-700 hover:underline">Register for a free Business Account</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountDropdown;
