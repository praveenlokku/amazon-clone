import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api.js';
import { useStateValue } from '../StateProvider.jsx';
import { ChevronRight, MapPin, CreditCard, ChevronDown, CheckCircle, Printer, RotateCcw, Package } from 'lucide-react';

function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [{ user }, dispatch] = useStateValue();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}/`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order details", error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user, navigate]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 bg-white min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amazon-orange mb-4"></div>
            <p className="text-gray-500 italic">Fetching your order summary...</p>
        </div>
    );

    if (!order) return (
        <div className="flex flex-col items-center justify-center py-20 bg-white min-h-screen">
            <p className="text-red-600 font-bold mb-4 text-xl">Order not found.</p>
            <Link to="/orders" className="text-amazon-orange hover:underline font-medium">Return to Your Orders</Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen text-[#111]">
            <div className="max-w-[1000px] mx-auto px-4 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-1 text-[12px] text-[#565959] mb-4">
                    <Link to="/profile" className="hover:underline">Your Account</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link to="/orders" className="hover:underline">Your Orders</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#c45500]">Order Details</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-[28px] font-normal leading-tight">Order Details</h1>
                </div>

                {/* Header Sub-bar */}
                <div className="flex flex-wrap items-center justify-between text-[14px] mb-6 border-b border-gray-200 pb-4 gap-y-2">
                    <div className="flex flex-wrap items-center gap-x-6">
                        <span>Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="text-gray-300">|</span>
                        <span>Order# {order._id}</span>
                    </div>
                    <div className="flex items-center text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer group" onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-1 text-gray-500 group-hover:text-[#c45500]" />
                        <span>View or Print invoice</span>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                    {/* Shipping Address */}
                    <div>
                        <h3 className="text-[14px] font-bold mb-4">Shipping Address</h3>
                        <p className="text-[14px] text-[#111] leading-relaxed">
                            {user.name}<br />
                            {order.shippingAddress?.address}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                            {order.shippingAddress?.country}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h3 className="text-[14px] font-bold mb-4">Payment Method</h3>
                        <div className="flex items-center space-x-2 text-[14px]">
                            <div className="bg-gray-100 p-1 rounded-sm">
                                <CreditCard className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="capitalize">{order.paymentMethod || 'Amazon Pay'} Balance</span>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <h3 className="text-[14px] font-bold mb-4">Order Summary</h3>
                        <div className="space-y-1 text-[13px]">
                            <div className="flex justify-between">
                                <span className="text-[#565959]">Item(s) Subtotal:</span>
                                <span>₹{(Number(order.totalPrice) - Number(order.taxPrice) - Number(order.shippingPrice)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#565959]">Shipping:</span>
                                <span>₹{Number(order.shippingPrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#565959]">Total before tax:</span>
                                <span>₹{(Number(order.totalPrice) - Number(order.taxPrice)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-[#565959]">Tax:</span>
                                <span>₹{Number(order.taxPrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[14px] font-bold border-t border-gray-200 pt-1">
                                <span>Grand Total:</span>
                                <span>₹{Number(order.totalPrice).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Item Card */}
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    {/* Status Banner */}
                    <div className="bg-[#f0f2f2] px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {order.isDelivered ? (
                                <>
                                    <CheckCircle className="h-6 w-6 text-green-700" />
                                    <span className="text-[18px] font-bold">Delivered</span>
                                </>
                            ) : (
                                <>
                                    <div className="bg-amazon-orange p-1 rounded-full">
                                        <Package className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-[18px] font-bold">Preparing for shipment</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="p-6 space-y-8">
                        {(order.orderItems || []).map((item) => (
                            <div key={item._id} className="flex gap-6 group">
                                <div className="w-[120px] h-[120px] flex-shrink-0 flex items-center justify-center p-2 border border-gray-100 rounded-md cursor-pointer hover:shadow-sm" onClick={() => navigate(`/product/${item.product}`)}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = "https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg"; }}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="flex-grow flex flex-col md:flex-row gap-6">
                                    <div className="flex-grow">
                                        <Link to={`/product/${item.product}`} className="text-[#007185] hover:text-[#c45500] hover:underline font-medium text-[15px] leading-tight line-clamp-2 mb-2">
                                            {item.name}
                                        </Link>
                                        <p className="text-[#b12704] font-medium text-[14px]">₹{Number(item.price).toFixed(2)}</p>
                                        <p className="text-[13px] text-[#565959] mt-2">Qty: {item.qty}</p>
                                        <div className="mt-4">
                                            <button
                                                onClick={() => navigate(`/product/${item.product}`)}
                                                className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-[8px] px-6 py-1.5 text-[13px] font-medium shadow-sm transition-all flex items-center active:scale-95"
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Buy it again
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2 md:w-[200px]">
                                        <button
                                            onClick={() => alert("Package Tracking functionality is coming soon!")}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] font-normal shadow-sm transition-all text-center active:scale-95"
                                        >
                                            Track package
                                        </button>
                                        <button
                                            onClick={() => navigate(`/product/${item.product}`)}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] font-normal shadow-sm transition-all text-center active:scale-95"
                                        >
                                            Write a product review
                                        </button>
                                        <button
                                            onClick={() => alert("Order successfully archived.")}
                                            className="bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-[8px] py-1.5 text-[13px] font-normal shadow-sm transition-all text-center text-red-700 active:scale-95"
                                        >
                                            Archive order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsPage;
