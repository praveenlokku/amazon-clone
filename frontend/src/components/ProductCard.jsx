import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';

function ProductCard({ id, title, price, rating, image, category }) {
    const [{ }, dispatch] = useStateValue();

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

    return (
        <div className="relative flex flex-col m-2 bg-white z-30 p-5 hover:shadow-2xl transition-all duration-300 rounded-sm group">
            <p className="absolute top-2 right-2 text-[11px] italic text-gray-400 uppercase tracking-wider">{category}</p>

            <Link to={`/product/${id}`} className="flex justify-center">
                <img className="h-52 w-52 object-contain mb-4 cursor-pointer group-hover:scale-105 transition-transform duration-300" src={image} alt={title} />
            </Link>

            <div className="flex-grow">
                <h4 className="my-2 text-[15px] font-medium line-clamp-2 hover:text-amazon-orange cursor-pointer leading-tight">
                    <Link to={`/product/${id}`}>{title}</Link>
                </h4>

                <div className="flex items-center space-x-1 mb-1">
                    <div className="flex">
                        {Array(Math.floor(rating))
                            .fill()
                            .map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-[#ffa41c] fill-current" />
                            ))}
                        {rating % 1 !== 0 && <Star className="h-4 w-4 text-[#ffa41c] fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
                    </div>
                    <span className="text-blue-600 text-[12px] hover:underline hover:text-amazon-orange cursor-pointer">820</span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-baseline">
                        <span className="text-[13px] self-start mt-1 mr-0.5">₹</span>
                        <span className="text-2xl font-bold">{Math.floor(price)}</span>
                        <span className="text-[13px] self-start mt-1 ml-0.5">{(price % 1).toFixed(2).substring(2) || '00'}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 line-through">₹{(price * 1.2).toFixed(0)}</p>
                </div>

                <div className="flex items-center space-x-1 mb-4">
                    <img className="h-4" src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18._CB485936079_.png" alt="Prime" />
                    <p className="text-[12px] text-gray-600">FREE Delivery by Amazon</p>
                </div>
            </div>

            <button onClick={addToCart} className="button mt-2 py-1.5 shadow-sm active:scale-95">Add to Cart</button>
        </div>
    );
}

export default ProductCard;
