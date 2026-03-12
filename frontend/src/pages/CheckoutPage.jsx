import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';
import { useStateValue, getCartTotal } from '../StateProvider.jsx';

function CheckoutPage() {
    const [{ cart, user }, dispatch] = useStateValue();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('India');
    const [phone, setPhone] = useState('');

    const placeOrder = async (e) => {
        if (e) e.preventDefault();

        if (!address || !city || !postalCode || !country) {
            alert("Please fill in all shipping details.");
            return;
        }

        const subtotal = getCartTotal(cart);
        const tax = subtotal * 0.12;
        const shipping = subtotal > 1000 ? 0 : 40;
        const total = subtotal + tax + shipping;

        const orderData = {
            orderItems: cart,
            shippingAddress: {
                address,
                city,
                postalCode,
                country,
            },
            paymentMethod: 'Cash on Delivery',
            taxPrice: tax.toFixed(2),
            shippingPrice: shipping.toFixed(2),
            totalPrice: total.toFixed(2),
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('http://localhost:8000/api/orders/add/', orderData, config);
            dispatch({ type: 'EMPTY_CART' });
            navigate(`/confirmation/${data._id}`);
        } catch (error) {
            console.error("Error placing order", error);
            alert(error.response?.data?.detail || "Something went wrong. Please try again.");
        }
    };

    const subtotal = getCartTotal(cart);
    const tax = subtotal * 0.12;
    const shipping = subtotal > 1000 ? 0 : 40;
    const total = subtotal + tax + shipping;

    return (
        <div className="bg-[#f0f2f2] min-h-screen">
            {/* Simple Checkout Header */}
            <div className="bg-white border-b border-gray-200 py-3 px-4 md:px-10 lg:px-20 flex items-center justify-between sticky top-0 z-50">
                <Link to="/">
                    <div className="flex flex-col items-center pt-1">
                        <div className="flex items-baseline">
                            <span className="text-black font-black text-2xl tracking-tighter">amazon</span>
                            <span className="text-black text-xs ml-0.5">.in</span>
                        </div>
                    </div>
                </Link>
                <h1 className="text-2xl md:text-3xl font-normal text-[#111]">
                    Checkout (<span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">{(cart || []).length} items</span>)
                </h1>
                <Lock className="h-6 text-[#999]" />
            </div>

            <main className="max-w-screen-xl mx-auto flex flex-col lg:flex-row p-4 gap-6">
                {/* Left Column */}
                <div className="flex-grow space-y-4">
                    {/* Section 1: Address */}
                    <div className="bg-white p-6 border-b-2 border-transparent">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-[18px] font-bold text-[#b12704] flex items-center">
                                <span className="mr-4 text-[#555]">1</span>
                                Delivery address
                            </h2>
                        </div>
                        <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full">
                                <label className="block text-[13px] font-bold mb-1 ml-0.5">Full name (First and Last name)</label>
                                <input type="text" className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner" defaultValue="Praveen" />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-[13px] font-bold mb-1 ml-0.5">Address Line 1</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                                    placeholder="Street address, P.O. box, company name, c/o"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold mb-1 ml-0.5">Town/City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold mb-1 ml-0.5">Pincode</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className="w-full border border-gray-400 p-2 rounded-[3px] outline-none focus:ring-1 focus:ring-amazon-orange shadow-inner"
                                    placeholder="6 digits [0-9] PIN code"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Payment */}
                    <div className="bg-white p-6 opacity-80 border-t border-gray-200">
                        <h2 className="text-[18px] font-bold text-[#555] flex items-center">
                            <span className="mr-4">2</span>
                            Payment method
                        </h2>
                        <div className="ml-8 mt-2 p-2 border border-blue-400 bg-blue-50 rounded-md flex items-center space-x-2">
                            <input type="radio" checked readOnly className="h-4 w-4 accent-amazon-orange" />
                            <span className="text-[14px] font-bold">Cash on Delivery (COD)</span>
                        </div>
                    </div>

                    {/* Section 3: Review */}
                    <div className="bg-white p-6 border-t border-gray-200">
                        <h2 className="text-[18px] font-bold text-[#555] flex items-center mb-4">
                            <span className="mr-4">3</span>
                            Review items and delivery
                        </h2>
                        <div className="ml-8 space-y-4">
                            {(cart || []).map((item) => (
                                <div key={item.product} className="flex space-x-6 border border-gray-200 rounded-lg p-4">
                                    <img className="h-24 w-24 object-contain" src={item.image} alt={item.name} />
                                    <div className="flex-grow">
                                        <p className="font-bold text-[14px] text-[#0f1111] line-clamp-2">{item.name}</p>
                                        <p className="text-[#b12704] font-bold text-[14px] mt-1">₹{item.price.toFixed(2)}</p>
                                        <p className="text-[12px] mt-1 font-bold">Quantity: {item.qty}</p>
                                        <p className="text-[12px] text-gray-500 mt-2">Sold by: Amazon</p>
                                    </div>
                                    <div className="text-[12px] text-gray-600 hidden md:block">
                                        <p className="font-bold text-gray-900">Delivery date:</p>
                                        <p>Tomorrow</p>
                                        <p>If you order in the next 3 hours</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:w-[320px]">
                    <div className="bg-white p-4 border border-gray-300 rounded-lg sticky top-[80px] shadow-sm">
                        <button
                            onClick={placeOrder}
                            className="button w-full mb-3 py-2 text-[14px] font-bold rounded-lg shadow-sm"
                        >
                            Place your order
                        </button>
                        <p className="text-center text-[12px] text-gray-500 mb-4 pb-4 border-b">
                            By placing your order, you agree to Amazon's <span className="text-[#007185] hover:underline cursor-pointer">privacy notice</span> and <span className="text-[#007185] hover:underline cursor-pointer">conditions of use</span>.
                        </p>

                        <h3 className="font-bold text-[18px] mb-3 text-[#0f1111]">Order Summary</h3>
                        <div className="space-y-1.5 text-[12px] text-[#0f1111]">
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total:</span>
                                <span>₹{(subtotal + shipping).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pb-3 border-b border-gray-200 pt-1">
                                <span>Promotion Applied:</span>
                                <span>-₹0.00</span>
                            </div>
                            <div className="flex justify-between text-[18px] font-bold text-[#b12704] py-3">
                                <span>Order Total:</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="bg-[#f0f2f2] -mx-4 -mb-4 p-3 rounded-b-lg border-t border-gray-300">
                            <p className="text-[#007185] text-[12px] font-bold hover:underline cursor-pointer">How are delivery costs calculated?</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CheckoutPage;
