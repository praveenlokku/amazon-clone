import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api.js';
import { CheckCircle } from 'lucide-react';

function ConfirmationPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}/`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order", error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="text-center py-20 font-bold italic text-gray-500">Loading Order Details...</div>;

    return (
        <div className="bg-[#eaeded] min-h-screen flex flex-col items-center py-20 px-4">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200 max-w-[600px] w-full text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="h-20 w-20 text-[#007600] stroke-[1.5px]" />
                </div>

                <h1 className="text-3xl font-bold text-[#0f1111] mb-2">Order Placed, Thank You!</h1>
                <p className="text-[#565959] text-[16px] mb-8">
                    An email confirmation has been sent to you.
                </p>

                <div className="bg-[#f0f2f2] -mx-8 md:-mx-12 p-6 border-y border-gray-200 text-left mb-8">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[14px] font-bold text-[#0f1111]">Order #</span>
                        <span className="text-[14px] text-[#007185] hover:underline cursor-pointer">{id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] text-[#565959]">Estimated delivery:</span>
                        <span className="text-[14px] font-bold text-[#007600]">Tomorrow, March 12</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link to="/">
                        <button className="button w-full py-2 rounded-full font-medium shadow-sm transition-transform active:scale-95 border border-[#FF8F00]">
                            Continue shopping
                        </button>
                    </Link>
                    <p className="text-[12px] text-[#565959]">
                        You can view your order history in <Link to="/orders" className="text-[#007185] hover:underline cursor-pointer">Your Orders</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPage;
