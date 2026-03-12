import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useStateValue } from '../StateProvider.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Package, Truck, CheckCircle, AlertCircle, XCircle, RotateCcw } from 'lucide-react';

function OrdersPage() {
    const [{ user }, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);
    const [archivedOrders, setArchivedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [timeFilter, setTimeFilter] = useState('past 3 months');
    const navigate = useNavigate();

    const tabs = ['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled Orders'];
    const timeFilters = ['past 3 months', '2024', '2023', '2022', 'Older'];

    const handleAction = (name) => {
        alert(`${name} functionality is coming soon! Our team is processing your request.`);
    };

    const archiveOrder = (id) => {
        setArchivedOrders([...archivedOrders, id]);
        alert("Order archived successfully. You can view it in your archived orders section.");
    };

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

    // Enhanced Filtering Logic
    const filteredOrders = useMemo(() => {
        let result = orders.filter(o => !archivedOrders.includes(o._id));

        // 1. Tab Filter
        if (activeTab === 'Not Yet Shipped') {
            result = result.filter(o => !o.isDelivered);
        } else if (activeTab === 'Cancelled Orders') {
            // Placeholder for cancelled logic if status exists
            result = [];
        } else if (activeTab === 'Buy Again') {
            // Logic handled by specialized tab UI usually, but we can filter too
        }

        // 2. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(o =>
                o._id.toString().includes(query) ||
                o.orderItems?.some(item => item.name.toLowerCase().includes(query))
            );
        }

        // 3. Time Filter (Simplified local logic)
        if (timeFilter !== 'past 3 months') {
            result = result.filter(o => {
                const year = new Date(o.createdAt).getFullYear().toString();
                return year === timeFilter;
            });
        }

        return result;
    }, [orders, activeTab, searchQuery, timeFilter]);

    // Highlighting Logic
    const highlightText = (text, query) => {
        if (!query.trim()) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <span key={i} className="bg-yellow-200">{part}</span>
                : part
        );
    };

    return (
        <div className="bg-white min-h-screen text-[#111]">
            <div className="max-w-[1000px] mx-auto px-4 py-4 md:py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-1 text-[12px] text-[#565959] mb-4">
                    <Link to="/profile" className="hover:underline hover:text-[#c45500]">Your Account</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#c45500]">Your Orders</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-[28px] font-normal leading-tight">Your Orders</h1>

                    <div className="relative flex items-center max-w-[400px] w-full group">
                        <Search className="absolute left-3 h-4 w-4 text-gray-500 group-focus-within:text-amazon-orange" />
                        <input
                            type="text"
                            placeholder="Search all orders"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-24 py-1.5 border border-gray-300 rounded-[4px] text-[13px] outline-none focus:ring-[3px] focus:ring-[#c8f3fa] focus:border-[#007185] shadow-[0_1px_2px_rgba(0,0,0,0.1)_inset] transition-all"
                        />
                        <button className="absolute right-0 bg-[#333] hover:bg-[#222] text-white text-[13px] font-bold px-4 py-1.5 rounded-r-[4px] border border-[#333] active:bg-black">
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

                {/* Filter Control Section */}
                <div className="flex flex-wrap items-center text-[14px] mb-6 gap-y-2">
                    <span className="font-bold mr-2">{filteredOrders.length} orders</span>
                    <span className="text-[#565959]">placed in</span>

                    <div className="relative ml-2 group">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="appearance-none bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] pl-3 pr-8 py-1 rounded-[8px] shadow-sm cursor-pointer outline-none text-[13px] font-medium transition-colors"
                        >
                            {timeFilters.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amazon-orange mb-4"></div>
                        <p className="text-gray-500 font-medium">Finding your orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="border border-gray-200 rounded-lg p-12 text-center bg-gray-50">
                        <p className="text-[16px] text-[#111] font-medium mb-2">No orders found.</p>
                        <p className="text-[14px] text-[#565959] mb-6">We couldn't find any orders matching your search or filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setTimeFilter('past 3 months'); setActiveTab('Orders'); }}
                            className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline font-medium"
                        >
                            Reset all filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 pb-20">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="border border-[#d5d9d9] rounded-[8px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                {/* Order Card Header */}
                                <div className="bg-[#f0f2f2] px-4 py-3 flex flex-wrap items-center justify-between text-[12px] text-[#565959] border-b border-[#d5d9d9]">
                                    <div className="flex flex-wrap gap-x-12 gap-y-2">
                                        <div>
                                            <p className="uppercase font-normal tracking-tight">Order Placed</p>
                                            <p className="text-[13px] font-medium mt-0.5 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="uppercase font-normal tracking-tight">Total</p>
                                            <p className="text-[13px] font-medium mt-0.5">₹{Number(order.totalPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        </div>
                                        <div className="relative group/ship">
                                            <p className="uppercase font-normal tracking-tight">Ship To</p>
                                            <div className="flex items-center cursor-pointer hover:text-[#c45500] group-hover/ship:text-[#c45500] mt-0.5">
                                                <span className="text-[13px] font-medium text-[#007185] group-hover/ship:text-[#c45500]">{user.name}</span>
                                                <ChevronDown className="h-3 w-3 ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="uppercase font-normal tracking-tight">Order # {highlightText(order._id.toString(), searchQuery)}</p>
                                        <div className="flex space-x-2 text-[#007185] text-[13px] mt-0.5">
                                            <Link to={`/orders/${order._id}`} className="hover:text-[#c45500] hover:underline cursor-pointer">View order details</Link>
                                            <span className="text-gray-300">|</span>
                                            <span className="hover:text-[#c45500] hover:underline cursor-pointer" onClick={() => navigate(`/orders/${order._id}`)}>Invoice</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Card Content */}
                                <div className="p-4 flex flex-col md:flex-row gap-6">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-4">
                                            {order.isDelivered ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                                    <h2 className="text-[18px] font-bold text-[#111]">
                                                        Delivered {new Date(order.deliveredAt).toLocaleDateString()}
                                                    </h2>
                                                </>
                                            ) : (
                                                <>
                                                    <Truck className="h-5 w-5 text-amazon-orange" />
                                                    <h2 className="text-[18px] font-bold text-[#111]">
                                                        {order.isPaid ? 'Arriving Soon' : 'Preparing for shipment'}
                                                    </h2>
                                                </>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {(order.orderItems || []).map((item) => (
                                                <div key={item._id} className="flex gap-5 group/item">
                                                    <div className="w-[100px] h-[100px] flex-shrink-0 flex items-center justify-center cursor-pointer border border-transparent group-hover/item:border-gray-200 rounded-sm transition-all overflow-hidden p-1">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            onError={(e) => { e.target.src = "https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg"; }}
                                                            className="max-w-full max-h-full object-contain group-hover/item:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Link to={`/product/${item.product}`} className="text-[#007185] hover:text-[#c45500] hover:underline font-medium text-[14px] line-clamp-2 leading-tight">
                                                            {highlightText(item.name, searchQuery)}
                                                        </Link>
                                                        <div className="flex items-center mt-2 text-[#565959] text-[12px] space-x-2">
                                                            <Package className="h-3 w-3" />
                                                            <span>Return window closed on {new Date(order.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => navigate(`/product/${item.product}`)}
                                                                className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-[8px] px-4 py-1.5 text-[13px] h-[33px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all font-medium flex items-center active:scale-95"
                                                            >
                                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                                Buy it again
                                                            </button>
                                                            <button className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] px-4 py-1.5 text-[13px] h-[33px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all font-medium active:scale-95">
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
                                        <button
                                            onClick={() => handleAction('Package Tracking')}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.1)] transition-all font-normal hover:border-gray-400 active:bg-gray-100"
                                        >
                                            Track package
                                        </button>
                                        <button
                                            onClick={() => handleAction('Return/Replacement')}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.1)] transition-all font-normal hover:border-gray-400"
                                        >
                                            Return or replace items
                                        </button>
                                        <button
                                            onClick={() => handleAction('Gifting')}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.1)] transition-all font-normal hover:border-gray-400"
                                        >
                                            Share gift receipt
                                        </button>
                                        <button
                                            onClick={() => handleAction('Feedback')}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.1)] transition-all font-normal hover:border-gray-400 text-left pl-3"
                                        >
                                            Leave delivery feedback
                                        </button>
                                        <button
                                            onClick={() => navigate(`/product/${order.orderItems?.[0]?.product}`)}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.1)] transition-all font-normal hover:border-gray-400 text-left pl-3"
                                        >
                                            Write a product review
                                        </button>
                                        <button
                                            onClick={() => archiveOrder(order._id)}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] shadow-[0_2px_5px_rgba(213,217,217,0.1)] transition-all font-normal hover:border-gray-400 text-left pl-3 text-red-700"
                                        >
                                            Archive order
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-[#f0f2f2] px-4 py-2 border-t border-[#d5d9d9] flex justify-between items-center text-[12px]">
                                    <div className="flex space-x-4">
                                        <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Archive order</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Support</span>
                                    </div>
                                    <div className="flex items-center text-[#565959]">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        <span>Order Help</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Divider */}
            <div className="border-t border-gray-200 mt-10 py-10 flex flex-col items-center">
                <Link to="/">
                    <button className="button-white px-10 py-1.5 rounded-md text-[13px] font-bold shadow-sm">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default OrdersPage;
