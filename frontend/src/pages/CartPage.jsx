import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateValue, getCartTotal } from '../StateProvider.jsx';
import CartItem from '../components/CartItem';

function CartPage() {
    const [{ cart, user }, dispatch] = useStateValue();
    const navigate = useNavigate();

    return (
        <div className="bg-[#eaeded] min-h-screen pb-10">
            <main className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row p-4 gap-6">

                {/* Left Column: Cart Items */}
                <div className="flex-grow bg-white p-6 shadow-sm border border-gray-200">
                    <h1 className="text-[28px] font-medium border-b border-gray-100 pb-2 mb-4 text-[#0f1111]">
                        Shopping Cart
                    </h1>

                    {(!cart || cart.length === 0) ? (
                        <div className="py-10 text-center">
                            <h2 className="text-xl font-bold mb-4">Your Amazon Cart is empty.</h2>
                            <button
                                onClick={() => navigate('/')}
                                className="button px-10 py-2 rounded-full font-medium"
                            >
                                Shop today's deals
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(cart || []).map((item, i) => (
                                <CartItem
                                    key={i}
                                    id={item.product}
                                    title={item.name}
                                    price={item.price}
                                    rating={item.rating}
                                    image={item.image}
                                    qty={item.qty}
                                />
                            ))}

                            <div className="text-right pt-4 border-t border-gray-200">
                                <p className="text-[18px] text-[#0f1111]">
                                    Subtotal ({(cart || []).reduce((amount, item) => item.qty + amount, 0)} items):
                                    <span className="font-bold ml-1">₹{getCartTotal(cart).toFixed(2)}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Subtotal Sidebar */}
                {(cart || []).length > 0 && (
                    <div className="flex flex-col bg-white p-6 h-fit min-w-[300px] shadow-sm border border-gray-200">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-2 text-[#007600] text-[14px]">
                                <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center mt-0.5">
                                    <svg className="h-3 w-3 text-white fill-current" viewBox="0 0 20 20">
                                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                    </svg>
                                </div>
                                <div>
                                    <p>Your order is eligible for FREE Delivery.</p>
                                    <p className="text-gray-500 text-[12px]">Choose FREE Delivery option at checkout.</p>
                                </div>
                            </div>

                            <p className="text-[18px] text-[#0f1111]">
                                Subtotal ({(cart || []).reduce((amount, item) => item.qty + amount, 0)} items):
                                <span className="font-bold ml-1 text-[20px]">₹{getCartTotal(cart).toFixed(2)}</span>
                            </p>

                            <div className="flex items-center space-x-2 text-[14px]">
                                <input type="checkbox" className="h-4 w-4 accent-amazon-orange rounded" />
                                <span>This order contains a gift</span>
                            </div>

                            <button
                                onClick={() => user ? navigate('/checkout') : navigate('/login')}
                                className="button w-full py-2 text-[14px] font-medium rounded-lg shadow-sm mt-2 active:scale-95"
                            >
                                Proceed to Buy
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Recommended items placeholder */}
            {(cart || []).length > 0 && (
                <div className="max-w-screen-2xl mx-auto px-4 mt-6">
                    <div className="bg-white p-6 shadow-sm border border-gray-200">
                        <h3 className="text-[18px] font-bold mb-4 text-[#0f1111]">Recommendations for you</h3>
                        <div className="flex space-x-4 overflow-x-auto pb-4">
                            {/* Placeholder for recommendations */}
                            <div className="text-gray-400 italic text-[14px]">Based on your cart items...</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
