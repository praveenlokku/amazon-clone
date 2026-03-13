import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';

function ProductCard({ id, title, price, rating, image, category, horizontal }) {
    const [{ cart }, dispatch] = useStateValue();
    const navigate = useNavigate();

    const isInCart = (cart || []).some((item) => item.product === id);

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            item: {
                product: id,
                name: title,
                image,
                price,
                rating,
                qty: 1
            },
        });
    };

    if (horizontal) {
        return (
            <div className="flex bg-white p-4 hover:bg-gray-50 transition-colors group cursor-pointer max-w-5xl mx-auto">
                <Link to={`/product/${id}`} className="min-w-[150px] md:min-w-[220px] h-44 flex items-center justify-center p-2">
                    <img
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        src={image}
                        alt={title}
                        onError={(e) => { e.target.src = "https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg"; }}
                    />
                </Link>
                <div className="flex-grow pl-4 md:pl-8 py-2">
                    <Link to={`/product/${id}`}>
                        <h4 className="text-[17px] md:text-[19px] font-medium text-[#0f1111] hover:text-[#c45500] line-clamp-2 leading-tight mb-1">{title}</h4>
                    </Link>
                    <div className="flex items-center space-x-1 mb-1">
                        <div className="flex">
                            {Array(5).fill().map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating || 0) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="text-blue-600 text-[13px] hover:text-amazon-orange ml-1">
                            {id ? (id.toString().charCodeAt(0) * 7 + 120) : '450'} 
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                        <div className="flex items-start text-[#0f1111]">
                            <span className="text-[13px] mt-1 pr-0.5 font-medium">₹</span>
                            <span className="text-2xl font-bold tracking-tight">{Math.floor(price || 0)}</span>
                            <span className="text-[14px] mt-1 pl-0.5 font-medium">{((price || 0) % 1).toFixed(2).substring(2) || '00'}</span>
                        </div>
                        <p className="text-[13px] text-gray-500 line-through">M.R.P: ₹{(price * 1.5).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center scale-90 origin-left">
                            <span className="text-[#00a8e1] font-black italic text-[14px] leading-none tracking-tighter mr-0.5">prime</span>
                            <div className="w-4 h-3 bg-[#00a8e1] rounded-[2px] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute -left-1 w-4 h-4 bg-white rotate-45 translate-x-1"></div>
                                <CheckCircle className="h-2 w-2 text-white z-10" />
                            </div>
                        </div>
                        <p className="text-[13px] text-gray-600">FREE Delivery by <span className="font-bold">Amazon</span></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col m-2 bg-white z-30 p-5 hover:shadow-2xl transition-all duration-300 rounded-sm group h-full">
            {rating > 4.5 && (
                <div className="absolute top-0 left-0 bg-[#e67e22] text-white text-[10px] px-2 py-1 font-bold rounded-br-md shadow-sm z-40">
                    BESTSELLER
                </div>
            )}
            <p className="absolute top-2 right-2 text-[11px] italic text-gray-400 uppercase tracking-wider">{category}</p>

            <Link to={`/product/${id}`} className="flex justify-center h-52">
                <img
                    className="max-h-full max-w-full object-contain mb-4 cursor-pointer group-hover:scale-105 transition-transform duration-300"
                    src={image}
                    alt={title}
                    onError={(e) => { e.target.src = "https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg"; }}
                />
            </Link>

            <div className="flex-grow flex flex-col">
                <h4 className="my-2 text-[15px] font-medium line-clamp-2 hover:text-amazon-orange cursor-pointer leading-tight min-h-[40px]">
                    <Link to={`/product/${id}`}>{title}</Link>
                </h4>

                <div className="flex items-center space-x-1 mb-1">
                    <div className="flex">
                        {Array(5).fill().map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating || 0) ? 'text-[#ffa41c] fill-[#ffa41c]' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-blue-600 text-[12px] hover:underline hover:text-amazon-orange cursor-pointer">
                        {id ? (id.toString().charCodeAt(0) * 5 + 85) : '120'}
                    </span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-baseline">
                        <span className="text-[13px] self-start mt-1 mr-0.5">₹</span>
                        <span className="text-2xl font-bold">{Math.floor(price || 0)}</span>
                        <span className="text-[13px] self-start mt-1 ml-0.5">{((price || 0) % 1).toFixed(2).substring(2) || '00'}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 line-through">₹{((price || 0) * 1.2).toFixed(0)}</p>
                </div>

                <div className="flex items-center space-x-1 mb-4">
                    {/* CSS-based Prime Badge for 100% Uptime */}
                    <div className="flex items-center scale-75 origin-left">
                        <span className="text-[#00a8e1] font-black italic text-[14px] leading-none tracking-tighter mr-0.5">prime</span>
                        <div className="w-4 h-3 bg-[#00a8e1] rounded-[2px] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute -left-1 w-4 h-4 bg-white rotate-45 translate-x-1"></div>
                            <CheckCircle className="h-2 w-2 text-white z-10" />
                        </div>
                    </div>
                    <p className="text-[12px] text-gray-600">FREE Delivery by Amazon</p>
                </div>
            </div>

            {isInCart ? (
                <button
                    onClick={() => navigate('/cart')}
                    className="w-full mt-auto py-1.5 shadow-sm active:scale-95 text-[13px] font-bold rounded-full bg-[#f3a847] hover:bg-[#e3962e] border border-[#a88734] transition-colors"
                >
                    Go to Cart
                </button>
            ) : (
                <button onClick={addToCart} className="button mt-auto py-1.5 shadow-sm active:scale-95">Add to Cart</button>
            )}
        </div>
    );
}

export default ProductCard;
