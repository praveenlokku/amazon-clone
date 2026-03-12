import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStateValue } from '../StateProvider.jsx';
import { useNavigate, Link } from 'react-router-dom';

function OrdersPage() {
    const [{ user }, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        <div className="bg-white min-h-screen p-4 md:p-10 max-w-[1000px] mx-auto">
            <h1 className="text-3xl font-light mb-6">Your Orders</h1>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon-orange"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
                    <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block font-bold">Continue shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="bg-[#f0f2f2] p-4 flex flex-wrap items-center justify-between text-[12px] text-gray-600 border-b border-gray-200">
                                <div className="flex space-x-12">
                                    <div>
                                        <p className="uppercase text-[11px] font-bold text-gray-500">Order Placed</p>
                                        <p className="text-[13px] text-[#111]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="uppercase text-[11px] font-bold text-gray-500">Total</p>
                                        <p className="text-[13px] text-[#111]">₹{order.totalPrice}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="uppercase text-[11px] font-bold text-gray-500">Ship To</p>
                                        <p className="text-[13px] text-blue-600 hover:text-[#c45500] hover:underline cursor-pointer">{user.name}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="uppercase text-[11px] font-bold text-gray-500">Order # {order._id}</p>
                                    <div className="flex space-x-2 text-blue-600">
                                        <span className="hover:text-[#c45500] hover:underline cursor-pointer">View order details</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="hover:text-[#c45500] hover:underline cursor-pointer">Invoice</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-4 flex flex-col md:flex-row justify-between">
                                <div className="flex flex-col space-y-4 flex-grow">
                                    <h2 className="text-lg font-bold text-[#111]">
                                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Arriving Soon' : 'Preparing for shipment'}
                                    </h2>

                                    {order.orderItems?.map((item) => (
                                        <div key={item._id} className="flex space-x-4">
                                            <img src={item.image} alt={item.name} className="h-20 w-20 object-contain" />
                                            <div className="flex flex-col">
                                                <Link to={`/product/${item.product}`} className="text-blue-600 hover:text-[#c45500] hover:underline font-medium text-[14px]">
                                                    {item.name}
                                                </Link>
                                                <p className="text-gray-500 text-[12px] mt-1 italic">Quantity: {item.qty}</p>
                                                <div className="mt-2 flex space-x-2">
                                                    <button className="bg-amazon-yellow hover:bg-[#f3a847] px-4 py-1 text-[13px] rounded-md shadow-sm border border-[#a88734]">
                                                        Buy it again
                                                    </button>
                                                    <button className="bg-white hover:bg-gray-100 px-4 py-1 text-[13px] border border-gray-300 rounded-md shadow-sm">
                                                        View your item
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2 w-full md:w-[200px]">
                                    <button className="button-white w-full py-1.5 text-[13px]">Track package</button>
                                    <button className="button-white w-full py-1.5 text-[13px]">Return or replace items</button>
                                    <button className="button-white w-full py-1.5 text-[13px]">Leave delivery feedback</button>
                                    <button className="button-white w-full py-1.5 text-[13px]">Write a product review</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrdersPage;
