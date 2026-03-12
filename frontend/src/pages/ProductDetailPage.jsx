import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, ChevronRight, Lock, User, CheckCircle, Info } from 'lucide-react';
import { useStateValue } from '../StateProvider.jsx';
import ProductCarouselRow from '../components/ProductCarouselRow';

const PrimeBadge = () => (
    <div className="flex items-center scale-75 origin-left">
        <span className="text-[#00a8e1] font-black italic text-[14px] leading-none tracking-tighter mr-0.5">prime</span>
        <div className="w-4 h-3 bg-[#00a8e1] rounded-[2px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute -left-1 w-4 h-4 bg-white rotate-45 translate-x-1"></div>
            <CheckCircle className="h-2 w-2 text-white z-10" />
        </div>
    </div>
);

const RatingBar = ({ star, percentage }) => (
    <div className="flex items-center space-x-4 group cursor-pointer">
        <span className="text-[14px] text-[#007185] group-hover:underline group-hover:text-[#c45500] whitespace-nowrap min-w-[50px]">{star} star</span>
        <div className="flex-grow h-5 bg-gray-100 rounded-sm border border-gray-200 overflow-hidden shadow-inner">
            <div
                className="h-full bg-[#ffa41c] border-r border-[#de7921]"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
        <span className="text-[14px] text-[#007185] group-hover:underline group-hover:text-[#c45500] min-w-[35px] text-right">{percentage}%</span>
    </div>
);

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [selectedVariants, setSelectedVariants] = useState({});
    const [activeTab, setActiveTab] = useState('description');

    const [{ user, cart }, dispatch] = useStateValue();
    const isInCart = cart?.some(item => item.product === product?._id || (product?.asin && item.product === product.asin));

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                // First try fetching from local DB
                const { data } = await axios.get(`http://localhost:8000/api/products/${id}/`);
                setProduct(data);
                setActiveImage(data.image);
                setLoading(false);
            } catch (error) {
                // If not in local DB, it might be a REAL Amazon product from our search
                try {
                    const { data: realData } = await axios.get(`http://localhost:8000/api/amazon/product/${id}/`);
                    setProduct(realData);
                    setActiveImage(realData.image);
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
                product: product._id || product.asin,
                name: product.name,
                image: product.image,
                price: Number(product.price),
                rating: Number(product.rating),
                qty: Number(qty),
            },
        });
    };

    const handleAddToCart = () => {
        if (isInCart) {
            navigate('/cart');
        } else {
            addToCart();
            // navigate('/cart'); // Removed redirection to cart after adding to match Amazon behavior
        }
    };

    const buyNow = () => {
        if (!isInCart) {
            addToCart();
        }
        navigate('/checkout');
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

    const handleVariantClick = (type, value) => {
        setSelectedVariants(prev => ({ ...prev, [type]: value }));
        // In a real app, this might change the price or images
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
                {/* Left: Image Gallery */}
                <div className="lg:w-1/2 flex flex-row gap-4 sticky top-24 self-start bg-white p-4">
                    {/* Thumbnails Sidebar */}
                    <div className="flex flex-col space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {(Array.isArray(product.additional_images) && product.additional_images.length > 0
                            ? product.additional_images
                            : [product.image]
                        ).map((img, idx) => (
                            <div
                                key={idx}
                                onMouseEnter={() => setActiveImage(img)}
                                className={`w-12 h-12 min-w-[48px] border-2 rounded-sm cursor-pointer overflow-hidden p-1 transition-all ${activeImage === img ? 'border-amazon-orange shadow-[0_0_5px_rgba(230,126,34,0.5)]' : 'border-gray-200 hover:border-gray-400'}`}
                            >
                                <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>

                    {/* Main Image with Zoom */}
                    <div
                        className="flex-grow flex justify-center relative bg-white cursor-crosshair group pr-10 border border-gray-100 rounded-md h-[500px]"
                        onMouseMove={(e) => {
                            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                            const x = e.pageX - left - window.scrollX;
                            const y = e.pageY - top - window.scrollY;

                            // Lens size
                            const lensSize = 150;
                            // Clamp lens within boundaries
                            const lensX = Math.max(0, Math.min(x - lensSize / 2, width - lensSize));
                            const lensY = Math.max(0, Math.min(y - lensSize / 2, height - lensSize));

                            const percentX = (lensX / (width - lensSize)) * 100;
                            const percentY = (lensY / (height - lensSize)) * 100;

                            setZoomPos({ x: lensX, y: lensY, percentX, percentY });
                        }}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        <img
                            src={activeImage || product.image}
                            alt={product.name}
                            className="max-h-full w-full object-contain transition-opacity duration-300"
                        />

                        {isZoomed && (
                            <>
                                {/* Lens */}
                                <div
                                    className="absolute border border-gray-400 bg-white/30 pointer-events-none z-20"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        left: `${zoomPos.x}px`,
                                        top: `${zoomPos.y}px`,
                                    }}
                                />
                                {/* External Zoom Panel */}
                                <div
                                    className="fixed top-24 left-[50%] ml-[20px] w-[600px] h-[600px] bg-white border border-gray-300 z-[100] shadow-2xl pointer-events-none overflow-hidden hidden lg:block"
                                    style={{
                                        backgroundImage: `url(${activeImage || product.image})`,
                                        backgroundPosition: `${zoomPos.percentX}% ${zoomPos.percentY}%`,
                                        backgroundSize: '200%',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                />
                            </>
                        )}

                        {!isZoomed && (
                            <div className="absolute bottom-2 right-12 text-gray-400 text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
                                Roll over image to zoom in
                            </div>
                        )}
                    </div>
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
                        <div className="mt-2 flex items-center space-x-2">
                            <span className="text-[14px] text-[#565959]">Choice</span>
                            <span className="bg-[#232f3e] text-white text-[12px] px-2 py-0.5 rounded-sm">Amazon's <span className="text-amazon-orange font-bold">Choice</span></span>
                            <span className="text-[14px] text-[#565959]">for "bestsellers"</span>
                        </div>
                    </div>

                    <div className="space-y-1 py-2">
                        {product.isDeal && (
                            <div className="bg-[#CC0C39] text-white text-[12px] font-bold px-2 py-1 rounded-sm w-fit mb-2 animate-pulse">
                                Limited time deal
                            </div>
                        )}
                        <div className="flex items-start">
                            {product.isDeal && (
                                <span className="text-[#CC0C39] text-3xl font-light mr-2">-{product.discountPercentage || 12}%</span>
                            )}
                            <div className="flex items-start text-[#0f1111]">
                                <span className="text-[14px] font-medium mt-1">₹</span>
                                <span className="text-4xl font-medium tracking-tight">{Math.floor(product.price || 0)}</span>
                                <span className="text-[14px] font-medium mt-1">{((product.price || 0) % 1).toFixed(2).substring(2) || '00'}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[13px] text-[#565959]">M.R.P.: <span className="line-through">₹{((product.price || 0) * (1 + (product.discountPercentage || 0) / 100)).toFixed(0)}</span></span>
                        </div>
                        <div className="flex items-center mt-1">
                            <PrimeBadge />
                            <span className="text-[14px] text-[#565959] ml-1">Verified Purchase</span>
                        </div>
                        <p className="text-[13px] text-[#565959]">Inclusive of all taxes</p>
                    </div>

                    {/* Variant Selectors */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="py-4 space-y-4 border-t border-gray-200">
                            {product.variants.map((variant, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h4 className="text-[14px] font-bold">{variant.type}: <span className="font-normal">{selectedVariants[variant.type] || variant.values[0]}</span></h4>
                                    <div className="flex flex-wrap gap-2">
                                        {variant.values.map((val, vIdx) => (
                                            <button
                                                key={vIdx}
                                                onClick={() => handleVariantClick(variant.type, val)}
                                                className={`px-4 py-2 border rounded-md text-[13px] transition-all hover:bg-gray-50 ${(selectedVariants[variant.type] || variant.values[0]) === val
                                                    ? 'border-amazon-orange bg-[#fef8f2] ring-1 ring-amazon-orange'
                                                    : 'border-gray-300'
                                                    }`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 pb-2">
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
                {/* Right: Buy Column */}
                <div className="lg:w-[260px] border border-gray-300 rounded-xl p-5 h-fit bg-white sticky top-24 shadow-[0_2px_5px_rgba(213,217,217,0.5)] border-t-[1.5px] border-t-gray-200">
                    <div className="relative">
                        <div className="flex items-baseline text-[#0f1111]">
                            <span className="text-[14px] align-top mt-1 font-medium">₹</span>
                            <span className="text-3xl font-bold tracking-tight">{Math.floor(product.price || 0)}</span>
                            <span className="text-[14px] align-top mt-1 font-medium">{((product.price || 0) % 1).toFixed(2).substring(2) || '00'}</span>
                        </div>
                        <div className="flex items-center mt-1">
                            <PrimeBadge />
                            <span className="text-[13px] text-[#565959] hover:underline cursor-pointer">FREE Returns</span>
                        </div>
                    </div>

                    <div className="mt-4 text-[14px] space-y-1">
                        <p className="text-[#007185] hover:underline cursor-pointer">FREE delivery <span className="font-bold text-[#0f1111]">Tomorrow, March 12</span>.</p>
                        <p className="text-[#565959] text-[13px]">Order within <span className="text-green-700 font-medium">6 hrs 42 mins</span>.</p>
                    </div>

                    <div className="flex items-center text-[#007185] text-[13px] mt-4 hover:underline cursor-pointer group">
                        <MapPin className="h-4 mr-2 text-[#333] group-hover:text-amazon-orange" />
                        <span className="line-clamp-1">Deliver to Praveen - Bangalore 560001</span>
                    </div>

                    <div className="mt-4">
                        <p className="text-[#007600] text-[18px] font-medium">In stock</p>
                        <p className="text-[13px] text-[#0f1111] mt-1 italic">Usually dispatched in 2 days</p>
                    </div>

                    <div className="mt-6 flex flex-col space-y-3">
                        <div className="flex items-center justify-between border border-[#d5d9d9] rounded-lg bg-[#F0F2F2] px-3 py-1.5 shadow-[0_2px_5px_rgba(15,17,17,0.15)] hover:bg-[#e3e6e6] cursor-pointer w-full transition-colors active:shadow-inner">
                            <span className="text-[13px]">Quantity:</span>
                            <select
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                className="bg-transparent text-[14px] font-bold focus:outline-none cursor-pointer pr-1"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-2.5 rounded-full font-medium text-[14px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] active:scale-95 transition-all border ${isInCart
                                ? 'bg-[#f0f2f2] hover:bg-[#e3e6e6] border-[#d5d9d9] text-[#0f1111]'
                                : 'bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200] text-[#0f1111]'
                                }`}
                        >
                            {isInCart ? 'Go to Cart' : 'Add to Cart'}
                        </button>
                        <button
                            onClick={buyNow}
                            className="w-full bg-[#FFA41C] hover:bg-[#FF8F00] py-2.5 rounded-full font-medium text-[14px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] active:scale-95 transition-all border border-[#FF8F00] text-[#0f1111]"
                        >
                            Buy Now
                        </button>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center text-[12px] text-[#007185] hover:underline cursor-pointer group">
                            <Lock className="h-3 text-gray-500 mr-2 group-hover:text-gray-700" />
                            <span>Secure transaction</span>
                        </div>
                        <div className="flex items-center text-[12px] text-[#0f1111]">
                            <input type="checkbox" className="mr-2 rounded-sm" />
                            <span>Add a gift receipt for easy returns</span>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-white hover:bg-[#f7f8fa] border border-[#d5d9d9] rounded-lg py-1.5 text-[13px] shadow-sm transition-all font-medium active:scale-95">
                        Add to Wish List
                    </button>
                </div>
            </main>

            {/* Premium Tabbed Navigation for Product Info/Reviews */}
            <div className="max-w-screen-2xl mx-auto border-t border-gray-200 mt-12">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`px-8 py-4 text-[15px] font-bold transition-all border-b-2 ${activeTab === 'description' ? 'border-amazon-orange text-amazon-orange' : 'border-transparent text-gray-600 hover:text-black'}`}
                    >
                        Product Description
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`px-8 py-4 text-[15px] font-bold transition-all border-b-2 ${activeTab === 'specs' ? 'border-amazon-orange text-amazon-orange' : 'border-transparent text-gray-600 hover:text-black'}`}
                    >
                        Specifications
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-8 py-4 text-[15px] font-bold transition-all border-b-2 ${activeTab === 'reviews' ? 'border-amazon-orange text-amazon-orange' : 'border-transparent text-gray-600 hover:text-black'}`}
                    >
                        Reviews ({product.numReviews})
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'description' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-xl font-bold mb-4">From the manufacturer</h2>
                            <p className="text-[15px] text-gray-800 leading-relaxed max-w-4xl">{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'specs' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-xl font-bold mb-6">Technical Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                                {Object.entries(product.specifications || {}).map(([key, value], idx) => (
                                    <div key={idx} className={`flex py-2 px-3 ${idx % 4 < 2 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <span className="w-1/3 font-bold text-[13px] text-gray-700">{key}</span>
                                        <span className="w-2/3 text-[13px] text-gray-800">{value}</span>
                                    </div>
                                ))}
                                {!Object.keys(product.specifications || {}).length && (
                                    <p className="text-gray-500 italic">No technical specifications available for this product.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="animate-fadeIn">
                            <div className="flex flex-col lg:flex-row gap-12">
                                <div className="lg:w-1/3 space-y-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-amazon-orange fill-amazon-orange' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span className="text-lg font-bold">{Number(product.rating).toFixed(1)} out of 5</span>
                                    </div>
                                    <div className="space-y-3">
                                        <RatingBar star={5} percentage={67} />
                                        <RatingBar star={4} percentage={18} />
                                        <RatingBar star={3} percentage={9} />
                                        <RatingBar star={2} percentage={4} />
                                        <RatingBar star={1} percentage={2} />
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
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg mb-6">Top reviews from India</h3>
                                    {!(product.reviews || []).length ? (
                                        <p className="text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                                    ) : (
                                        <div className="space-y-8">
                                            {(product.reviews || []).map((review) => (
                                                <div key={review._id} className="space-y-2 border-b border-gray-100 pb-6">
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
                                                        <button className="button-white px-6 py-1 shadow-sm hover:bg-gray-50">Helpful</button>
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
                    )}
                </div>
            </div>

            <div className="pb-20"></div>
        </div>
    );
}

export default ProductDetailPage;
