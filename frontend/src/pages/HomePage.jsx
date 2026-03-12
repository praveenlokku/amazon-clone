import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import HomeCard from '../components/HomeCard';
import HeroSlider from '../components/HeroSlider';
import ProductCarouselRow from '../components/ProductCarouselRow';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const query = new URLSearchParams(location.search);
            const searchTerm = query.get('s');
            const category = query.get('c');

            try {
                let url = 'http://localhost:8000/api/amazon/search/?keyword=bestsellers';

                // If there's a search term, use the new REAL Amazon API endpoint
                if (searchTerm) {
                    url = `http://localhost:8000/api/amazon/search/?keyword=${searchTerm}`;
                    if (category) url += `&category=${category}`;
                } else if (category) {
                    url = `http://localhost:8000/api/amazon/search/?keyword=${category}`;
                }

                const { data } = await axios.get(url);

                if (searchTerm) {
                    setFilteredProducts(data);
                } else {
                    setProducts(data);
                    setFilteredProducts(data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products", error);
                setLoading(false);
                // Fallback for local testing if API fails or search is empty
                setFilteredProducts([]);
            }
        };

        fetchProducts();
    }, [location.search, products.length]);

    const query = new URLSearchParams(location.search);
    const isSearching = query.has('s') || query.has('c');

    // Multi-card grid data - Exact Fidelity from User Images
    const gridCards = [
        {
            title: "Appliances for your home | Up to 55% off",
            items: [
                { name: "Air conditioners", image: "https://m.media-amazon.com/images/I/31S1FhL7OUL._AC_SY170_.jpg" },
                { name: "Refrigerators", image: "https://m.media-amazon.com/images/I/31WjD-pW8WL._AC_SY170_.jpg" },
                { name: "Microwaves", image: "https://m.media-amazon.com/images/I/31uQO-X3PFL._AC_SY170_.jpg" },
                { name: "Washing machines", image: "https://m.media-amazon.com/images/I/41X8-E-pURL._AC_SY170_.jpg" }
            ],
            linkText: "See more"
        },
        {
            title: "Bulk order discounts + Up to 18% GST savings",
            items: [
                { name: "Up to 45% off | Laptops", image: "https://m.media-amazon.com/images/I/41-lS7+xM4L._AC_SY170_.jpg" },
                { name: "Up to 60% off | Kitchen appliances", image: "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SY170_.jpg" },
                { name: "Min. 50% off | Office furniture", image: "https://m.media-amazon.com/images/I/41-qX8Y-eUL._AC_SY170_.jpg" },
                { name: "Register using GST, Udyam, FSSAI or BPAN", image: "https://m.media-amazon.com/images/I/41uS8IovmHL._AC_SY170_.jpg" }
            ],
            linkText: "Create a free account"
        },
        {
            title: "Starting ₹49 | Deals on home essentials",
            items: [
                { name: "Cleaning supplies", image: "https://m.media-amazon.com/images/I/41rT2uS1rDL._AC_SY170_.jpg" },
                { name: "Bathroom accessories", image: "https://m.media-amazon.com/images/I/41vK2S-xXKL._AC_SY170_.jpg" },
                { name: "Home tools", image: "https://m.media-amazon.com/images/I/41wR2uS-rPL._AC_SY170_.jpg" },
                { name: "Wallpapers", image: "https://m.media-amazon.com/images/I/41X8-E-pURL._AC_SY170_.jpg" }
            ],
            linkText: "Explore all"
        },
        {
            title: "Automotive essentials | Up to 60% off",
            items: [
                { name: "Cleaning accessories", image: "https://m.media-amazon.com/images/I/41-lS7+xM4L._AC_SY170_.jpg" },
                { name: "Tyre & rim care", image: "https://m.media-amazon.com/images/I/41uS8IovmHL._AC_SY170_.jpg" },
                { name: "Helmets", image: "https://m.media-amazon.com/images/I/41-qX8Y-eUL._AC_SY170_.jpg" },
                { name: "Vacuum cleaner", image: "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SY170_.jpg" }
            ],
            linkText: "See more"
        },
        {
            title: "Customers' Most-Loved Fashion for you",
            items: [
                { name: "Men's T-shirts", image: "https://m.media-amazon.com/images/I/41-lS7+xM4L._AC_SY170_.jpg" },
                { name: "Women's Clothing", image: "https://m.media-amazon.com/images/I/41uS8IovmHL._AC_SY170_.jpg" },
                { name: "Footwear", image: "https://m.media-amazon.com/images/I/41-qX8Y-eUL._AC_SY170_.jpg" },
                { name: "Accessories", image: "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SY170_.jpg" }
            ],
            linkText: "Explore more"
        },
        {
            title: "Up to 50% off | International brands",
            items: [
                { name: "Smartphones", image: "https://m.media-amazon.com/images/I/41rT2uS1rDL._AC_SY170_.jpg" },
                { name: "Laptops", image: "https://m.media-amazon.com/images/I/41vK2S-xXKL._AC_SY170_.jpg" },
                { name: "Headphones", image: "https://m.media-amazon.com/images/I/41wR2uS-rPL._AC_SY170_.jpg" },
                { name: "Smartwatches", image: "https://m.media-amazon.com/images/I/41X8-E-pURL._AC_SY170_.jpg" }
            ],
            linkText: "See all offers"
        },
        {
            title: "Best Sellers in Computers & Accessories",
            items: [
                { name: "Cables", image: "https://m.media-amazon.com/images/I/41-lS7+xM4L._AC_SY170_.jpg" },
                { name: "Backpacks", image: "https://m.media-amazon.com/images/I/41uS8IovmHL._AC_SY170_.jpg" },
                { name: "Monitors", image: "https://m.media-amazon.com/images/I/41-qX8Y-eUL._AC_SY170_.jpg" },
                { name: "Mice", image: "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SY170_.jpg" }
            ],
            linkText: "See more"
        },
        {
            title: "Best Sellers in Beauty",
            items: [
                { name: "Sunscreen", image: "https://m.media-amazon.com/images/I/41rT2uS1rDL._AC_SY170_.jpg" },
                { name: "Facewash", image: "https://m.media-amazon.com/images/I/41vK2S-xXKL._AC_SY170_.jpg" },
                { name: "Moisturizer", image: "https://m.media-amazon.com/images/I/41wR2uS-rPL._AC_SY170_.jpg" },
                { name: "Skin Care", image: "https://m.media-amazon.com/images/I/41X8-E-pURL._AC_SY170_.jpg" }
            ],
            linkText: "See more"
        }
    ];

    return (
        <div className="mx-auto max-w-screen-2xl bg-[#eaeded] min-h-screen">
            {!isSearching && (
                <HeroSlider />
            )}

            <div className={`relative z-30 mx-auto px-4 ${!isSearching ? '-mt-[100px] md:-mt-[150px] lg:-mt-[250px]' : 'pt-6'}`}>
                {isSearching && (
                    <div className="bg-white p-4 mb-4 shadow-sm rounded-sm border border-gray-200">
                        <h1 className="text-[18px] text-[#565959]">
                            {(filteredProducts || []).length} results for <span className="text-[#c45500] font-bold italic">"{query.get('s') || query.get('c')}"</span>
                        </h1>
                    </div>
                )}

                {!isSearching && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {gridCards.map((card, i) => (
                                <HomeCard key={i} title={card.title} items={card.items} linkText={card.linkText} />
                            ))}
                        </div>

                        {/* Horizontal Scrolling Rows */}
                        <div className="-mx-4 sm:mx-0">
                            <ProductCarouselRow title="Today's Deals" products={(products || []).slice(0, 10)} />
                            <ProductCarouselRow title="Best Sellers in Electronics" products={(products || []).slice(4, 14)} />
                        </div>
                    </>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl font-bold animate-pulse text-gray-500 italic">Finding best deals for you...</p>
                    </div>
                ) : (
                    <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                        {(filteredProducts || []).length > 0 ? (
                            (filteredProducts || []).map((product) => (
                                <ProductCard
                                    key={product._id}
                                    id={product._id}
                                    title={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    image={product.image}
                                    category={product.category?.name}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white shadow-sm border border-gray-200 rounded-sm">
                                <h2 className="text-2xl font-bold text-gray-800">No results found for your search.</h2>
                                <p className="text-gray-500 mt-2">Try checking your spelling or use more general terms.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Personalized Recommendations Section */}
                {!isSearching && (
                    <div className="bg-white border-y border-[#ddd] mt-10 py-[40px] flex flex-col items-center">
                        <p className="text-[13px] font-bold mb-[5px] text-[#0f1111]">See personalized recommendations</p>
                        <Link to="/login" className="w-[30%] min-w-[200px] max-w-[240px]">
                            <button className="w-full bg-[#f7b055] hover:bg-[#f5a642] py-[6px] rounded-[8px] border border-[#cea06c] font-bold text-[13px] shadow-sm mb-1 text-[#111] transition-all">
                                Sign in
                            </button>
                        </Link>
                        <p className="text-[11px] mt-[10px] text-[#0f1111]">
                            New customer? <Link to="/signup" className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Start here.</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
