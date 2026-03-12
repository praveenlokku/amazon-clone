import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStateValue } from '../StateProvider.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

function OrdersPage() {
    const [{ user }, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Orders');
    const navigate = useNavigate();

    const tabs = ['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled Orders'];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get('http://localhost:8000/api/orders/my/', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1000px] mx-auto px-4 py-4 md:py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-1 text-[12px] text-[#565959] mb-4">
                    <Link to="/profile" className="hover:underline hover:text-[#c45500]">Your Account</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#c45500]">Your Orders</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-[28px] font-normal text-[#111]">Your Orders</h1>

                    <div className="relative flex items-center max-w-[400px] w-full">
                        <Search className="absolute left-3 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search all orders"
                            className="w-full pl-9 pr-20 py-1.5 border border-gray-300 rounded-[4px] text-[13px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-[0_1px_2px_rgba(0,0,0,0.1)_inset]"
                        />
                        <button className="absolute right-0 bg-[#333] hover:bg-[#222] text-white text-[13px] font-bold px-4 py-1.5 rounded-r-[4px] border border-[#333]">
                            Search Orders
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-300 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-[14px] font-medium transition-all relative ${activeTab === tab
                                    ? "text-[#111] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-amazon-orange"
                                    : "text-[#565959] hover:text-[#111]"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Time Range Filter */}
                <div className="flex items-center text-[14px] text-[#111] mb-6">
                    <span className="font-bold mr-2">{orders.length} orders</span>
                    <span className="text-[#565959]">placed in</span>
                    <div className="ml-2 flex items-center bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] px-3 py-1 rounded-[8px] shadow-sm cursor-pointer group transition-colors">
                        <span className="text-[13px] font-medium">past 3 months</span>
                        <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amazon-orange mb-4"></div>
                        <p className="text-gray-500 italic">Finding your past orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center">
                        <p className="text-[14px] text-[#565959] mb-4">Looks like you haven't placed an order in the last 3 months.</p>
                        <Link to="/" className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline">View orders from 2023</Link>
                    </div>
                ) : (
                    <div className="space-y-6 pb-20">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-[#d5d9d9] rounded-[8px] overflow-hidden">
                                {/* Order Card Header */}
                                <div className="bg-[#f0f2f2] px-4 py-3 flex flex-wrap items-center justify-between text-[12px] text-[#565959] border-b border-[#d5d9d9]">
                                    <div className="flex flex-wrap gap-x-12 gap-y-2">
                                        <div>
                                            <p className="uppercase font-normal tracking-tight">Order Placed</p>
                                            <p className="text-[13px] font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="uppercase font-normal tracking-tight">Total</p>
                                            <p className="text-[13px] font-medium mt-0.5">₹{Number(order.totalPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        </div>
                                        <div className="relative group/ship">
                                            <p className="uppercase font-normal tracking-tight">Ship To</p>
                                            <div className="flex items-center cursor-pointer hover:text-[#c45500] hover:underline mt-0.5">
                                                <span className="text-[13px] font-medium text-[#007185] group-hover/ship:text-[#c45500]">{user.name}</span>
                                                <ChevronDown className="h-3 w-3 ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="uppercase font-normal tracking-tight">Order # {order._id}</p>
                                        <div className="flex space-x-2 text-[#007185] text-[13px]">
                                            <span className="hover:text-[#c45500] hover:underline cursor-pointer">View order details</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="hover:text-[#c45500] hover:underline cursor-pointer">Invoice</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Card Content */}
                                <div className="p-4 flex flex-col md:flex-row gap-6">
                                    <div className="flex-grow">
                                        <h2 className="text-[18px] font-bold text-[#111] mb-4">
                                            {order.isDelivered ? `Delivered ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Arriving Soon'}
                                        </h2>

                                        <div className="space-y-6">
                                            {(order.orderItems || []).map((item) => (
                                                <div key={item._id} className="flex gap-4">
                                                    <div className="w-[100px] h-[100px] flex-shrink-0 flex items-center justify-center cursor-pointer">
                                                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Link to={`/product/${item.product}`} className="text-[#007185] hover:text-[#c45500] hover:underline font-medium text-[14px] line-clamp-2">
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-[#565959] text-[12px] mt-1">Return window closed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => navigate(`/product/${item.product}`)}
                                                                className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-[8px] px-4 py-1.5 text-[13px] h-[33px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors font-medium flex items-center"
                                                            >
                                                                <img src="https://m.media-amazon.com/images/G/31/AUI_Assets/reorder_32x32._CB485934149_.png" className="h-4 w-4 mr-2" alt="Buy Again" />
                                                                Buy it again
                                                            </button>
                                                            <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] px-4 py-1.5 text-[13px] h-[33px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors font-medium">
                                                                View your item
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons Column */}
                                    <div className="flex flex-col space-y-2 w-full md:w-[240px]">
                                        <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-colors">
                                            Track package
                                        </button>
                                        <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-colors">
                                            Return or replace items
                                        </button>
                                        <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-colors">
                                            Share gift receipt
                                        </button>
                                        <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-colors text-left pl-3">
                                            Leave delivery feedback
                                        </button>
                                        <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-colors text-left pl-3">
                                            Write a product review
                                        </button>
                                        <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] transition-colors text-left pl-3 text-red-700">
                                            Archive order
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-[#f0f2f2] px-4 py-2 border-t border-[#d5d9d9] text-[13px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">
                                    Archive order
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;
