import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, ChevronRight, Lock, User } from 'lucide-react';
import { useStateValue } from '../StateProvider.jsx';
import ProductCarouselRow from '../components/ProductCarouselRow';

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [{ user }, dispatch] = useStateValue();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                // First try fetching from local DB
                const { data } = await axios.get(`http://localhost:8000/api/products/${id}/`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                // If not in local DB, it might be a REAL Amazon product from our search
                try {
                    const { data: realData } = await axios.get(`http://localhost:8000/api/amazon/product/${id}/`);
                    setProduct(realData);
                    setLoading(false);
                } catch (realError) {
                    console.error("Error fetching real product", realError);
                    setLoading(false);
                }
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return;
        const fetchRecommendations = async () => {
            let keyword = 'bestsellers';
            if (product.category?.name && product.category.name !== 'General' && product.category.name !== 'Real Amazon Item') {
                keyword = product.category.name;
            } else if (product.brand && product.brand !== 'Amazon Vendor' && product.brand !== 'Amazon') {
                keyword = product.brand;
            }
            try {
                const { data } = await axios.get(`http://localhost:8000/api/amazon/search/?keyword=${keyword}`);
                if (Array.isArray(data)) {
                    setRecommendations(data.filter(p => p._id !== product._id && p.asin !== (product.asin || id)).slice(0, 15));
                }
            } catch (error) {
                console.error("Error fetching recommendations", error);
            }
        };
        fetchRecommendations();
    }, [product, id]);

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            item: {
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                rating: product.rating,
                qty: Number(qty),
            },
        });
        navigate('/cart');
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post(
                `http://localhost:8000/api/products/${product._id}/reviews/`,
                { rating, comment },
                config
            );
            alert("Review submitted successfully!");
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.detail || "Review submission failed.");
        }
    };

    if (loading) return <div className="text-center py-20 font-bold italic text-gray-500">Loading Product Details...</div>;
    if (!product) return <div className="text-center py-20 font-bold text-red-600">Product Not Found.</div>;

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center space-x-1 text-[12px] text-[#555]">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight className="h-3" />
                <span className="hover:underline cursor-pointer">{product.category?.name || 'General'}</span>
                <ChevronRight className="h-3" />
                <span className="text-[#c45500] font-medium">{product.name}</span>
            </div>

            <main className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row p-4 gap-8">
                {/* Left: Image */}
                <div className="lg:w-2/5 flex justify-center sticky top-24 self-start bg-white p-4">
                    <img src={product.image} alt={product.name} className="max-h-[500px] object-contain hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Center: Info */}
                <div className="flex-grow space-y-4">
                    <div className="border-b border-gray-200 pb-2">
                        <h1 className="text-[24px] font-medium leading-tight text-[#0f1111]">{product.name}</h1>
                        <p className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer text-[14px] mt-1">Visit the Store</p>
                        <div className="flex items-center mt-2 space-x-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-amazon-orange fill-amazon-orange' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer text-[14px]">842 ratings</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer text-[14px]">Search this page</span>
                        </div>
                    </div>

                    <div className="space-y-1 py-2">
                        <div className="flex items-baseline text-[#b12704]">
                            <span className="text-[14px] font-medium align-top mt-1">₹</span>
                            <span className="text-3xl font-medium">{Math.floor(product.price || 0)}</span>
                            <span className="text-[14px] font-medium align-top mt-1">{((product.price || 0) % 1).toFixed(2).substring(2) || '00'}</span>
                        </div>
                        <p className="text-[13px] text-[#565959]">Inclusive of all taxes</p>
                        <p className="text-[14px] mt-4">
                            <span className="font-bold">EMI</span> starts at ₹{Math.floor((product.price || 0) / 12)}. No Cost EMI available <span className="text-[#007185] hover:underline cursor-pointer">EMI options</span>
                        </p>
                    </div>

                    <div className="border-y border-gray-200 py-6">
                        <h3 className="text-[16px] font-bold text-[#0f1111] mb-2">About this item</h3>
                        <ul className="list-disc list-outside ml-4 text-[14px] text-[#0f1111] space-y-2">
                            {(product.description || 'No description available for this item.')
                                .split('.')
                                .map((sentence, i) => (
                                    sentence.trim() && <li key={i} className="leading-tight">{sentence.trim()}.</li>
                                ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Buy Column */}
                <div className="lg:w-[250px] border border-gray-300 rounded-lg p-4 shadow-sm h-fit bg-white">
                    <div className="flex items-baseline text-[#b12704]">
                        <span className="text-[13px] align-top mt-1 font-medium">₹</span>
                        <span className="text-2xl font-bold">{Math.floor(product.price || 0)}</span>
                        <span className="text-[13px] align-top mt-1 font-medium">{((product.price || 0) % 1).toFixed(2).substring(2) || '00'}</span>
                    </div>

                    <div className="mt-4 text-[14px]">
                        <p className="text-[#007185] hover:underline cursor-pointer">FREE delivery</p>
                        <p className="font-bold">Tomorrow, March 12.</p>
                        <p className="text-[#565959] text-[12px]">Order within <span className="text-green-700">6 hrs 42 mins</span>.</p>
                    </div>

                    <div className="flex items-center text-[#007185] text-[12px] mt-4 hover:underline cursor-pointer">
                        <MapPin className="h-4 mr-1 text-gray-600" />
                        Deliver to Praveen - Bangalore 560001
                    </div>

                    <p className="text-green-700 text-[18px] mt-4 font-medium">In stock</p>
                    <p className="text-[12px] text-[#565959] mt-1">Ships from and sold by Amazon.in</p>

                    <div className="mt-6 flex flex-col space-y-3">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-[#F0F2F2] px-2 py-1 shadow-sm hover:bg-gray-200 cursor-pointer w-fit">
                            <span className="text-[13px] mr-1">Qty:</span>
                            <select
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                className="bg-transparent text-[13px] font-bold focus:outline-none cursor-pointer"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={addToCart}
                            className="button py-2 rounded-full font-medium text-[14px] shadow-sm active:scale-95 transition-transform"
                        >
                            Add to Cart
                        </button>
                        <button className="bg-[#ffa41c] hover:bg-[#ffb446] py-2 rounded-full font-medium text-[14px] shadow-sm active:scale-95 transition-transform border border-[#FF8F00]">
                            Buy Now
                        </button>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4 text-[12px] flex items-center justify-center space-x-1 text-[#007185] hover:underline cursor-pointer group">
                        <Lock className="h-3 text-gray-500 group-hover:text-gray-700" />
                        <span>Secure transaction</span>
                    </div>
                </div>
            </main>

            {/* Recommendations Section */}
            {recommendations && recommendations.length > 0 && (
                <div className="max-w-screen-2xl mx-auto mt-8 mb-4">
                    <ProductCarouselRow title="Customers who viewed this item also viewed" products={recommendations} />
                </div>
            )}

            {/* Reviews Section */}
            <div className="max-w-screen-2xl mx-auto p-4 border-t border-gray-200 lg:mt-6 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Review Stats & Form */}
                    <div className="lg:w-1/3 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Customer reviews</h2>
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-amazon-orange fill-amazon-orange' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="font-bold text-[18px]">{(Number(product.rating) || 0).toFixed(1)} out of 5</span>
                            </div>
                            <p className="text-gray-500 text-[14px]">{product.numReviews} global ratings</p>
                        </div>

                        <div className="border-t border-gray-200 pt-8">
                            <h3 className="text-lg font-bold">Review this product</h3>
                            <p className="text-[14px] mt-1 mb-4">Share your thoughts with other customers</p>

                            {user ? (
                                <form onSubmit={submitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-[14px] font-bold mb-1">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 text-[14px] bg-gray-50"
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="1">1 - Poor</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="3">3 - Good</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="5">5 - Excellent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-bold mb-1">Comment</label>
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 text-[14px] focus:ring-1 focus:ring-amazon-orange outline-none"
                                            placeholder="What did you like or dislike? What did you use this product for?"
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="button-white px-10 py-1.5 text-[13px] font-medium shadow-sm">
                                        Write a product review
                                    </button>
                                </form>
                            ) : (
                                <Link to="/login">
                                    <button className="button-white px-10 py-1.5 text-[13px] font-medium shadow-sm">
                                        Sign in to write a review
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right: Reviews List */}
                    <div className="flex-grow">
                        <h2 className="text-xl font-bold mb-6">Top reviews from India</h2>
                        {!(product.reviews || []).length ? (
                            <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                        ) : (
                            <div className="space-y-8">
                                {(product.reviews || []).map((review) => (
                                    <div key={review._id} className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-gray-200 rounded-full p-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <span className="text-[13px] font-medium">{review.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < review.rating ? 'text-amazon-orange fill-amazon-orange' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-bold text-[13px]">Verified Purchase</span>
                                        </div>
                                        <p className="text-gray-500 text-[12px]">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[14px] leading-tight text-[#111]">{review.comment}</p>
                                        <div className="flex space-x-4 text-[12px] pt-2">
                                            <button className="button-white px-6 py-1 shadow-sm">Helpful</button>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-gray-500 hover:underline cursor-pointer">Report abuse</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
