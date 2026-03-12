import React from 'react';
import { Star } from 'lucide-react';
import { useStateValue } from '../StateProvider.jsx';

function CartItem({ id, title, price, rating, image, qty }) {
    const [{ }, dispatch] = useStateValue();

    const removeFromCart = () => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            product: id,
        });
    };

    const updateQty = (newQty) => {
        dispatch({
            type: 'UPDATE_QTY',
            product: id,
            qty: Number(newQty),
        });
    };

    return (
        <div className="flex border-b border-gray-200 py-6 last:border-0 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex-shrink-0">
                <img className="h-44 w-44 object-contain mr-6" src={image} alt={title} />
            </div>

            <div className="flex-grow pr-4">
                <h4 className="text-[18px] font-medium leading-tight text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer line-clamp-2 mb-1">{title}</h4>
                <p className="text-[#007600] text-[12px] font-medium mb-1">In stock</p>
                <p className="text-[12px] text-[#565959] mb-2">Eligible for FREE Shipping</p>

                <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-[#F0F2F2] px-2 py-0.5 shadow-sm hover:bg-gray-200 cursor-pointer">
                        <span className="text-[13px] mr-1 text-[#0f1111]">Qty:</span>
                        <select
                            value={qty}
                            onChange={(e) => updateQty(e.target.value)}
                            className="bg-transparent text-[13px] outline-none cursor-pointer font-medium"
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div className="h-4 w-[1px] bg-gray-300" />

                    <button
                        onClick={removeFromCart}
                        className="text-[12px] text-[#007185] hover:underline cursor-pointer"
                    >
                        Delete
                    </button>

                    <div className="h-4 w-[1px] bg-gray-300" />

                    <button className="text-[12px] text-[#007185] hover:underline cursor-pointer">
                        Save for later
                    </button>

                    <div className="h-4 w-[1px] bg-gray-300" />

                    <button className="text-[12px] text-[#007185] hover:underline cursor-pointer">
                        See more like this
                    </button>
                </div>
            </div>

            <div className="flex-shrink-0 text-right">
                <p className="text-[18px] font-bold text-[#0f1111]">₹{Number(price || 0).toFixed(2)}</p>
            </div>
        </div>
    );
}

export default CartItem;
