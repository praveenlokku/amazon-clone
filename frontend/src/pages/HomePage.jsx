import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api.js';
import ProductCard from '../components/ProductCard';
import HomeCard from '../components/HomeCard';
import HeroSlider from '../components/HeroSlider';
import ProductCarouselRow from '../components/ProductCarouselRow';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false); // Changed to false by default for better initial render
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const query = new URLSearchParams(location.search);
            const searchTerm = query.get('s');
            const category = query.get('c');

            try {
                let url = `${API_BASE_URL}/api/amazon/search/?keyword=bestsellers`;

                // If there's a search term, use the new REAL Amazon API endpoint
                if (searchTerm) {
                    url = `${API_BASE_URL}/api/amazon/search/?keyword=${searchTerm}`;
                    if (category) url += `&category=${category}`;
                } else if (category) {
                    url = `${API_BASE_URL}/api/amazon/search/?keyword=${category}`;
                }

                const { data } = await axios.get(url);

                if (searchTerm) {
                    setFilteredProducts(data);
                } else {
                    setProducts(data);
                    setFilteredProducts(data);
                }
                setCurrentPage(1);
                setLoading(false);
                setIsInitialLoad(false);
            } catch (error) {
                console.error("Error fetching products", error);
                setLoading(false);
                setIsInitialLoad(false);
                // Fallback for local testing if API fails or search is empty
                setFilteredProducts([]);
                setCurrentPage(1);
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
                { name: "Air conditioners", image: "https://m.media-amazon.com/images/I/61Pca7f3SfL._AC_UY218_.jpg" },
                { name: "Refrigerators", image: "https://m.media-amazon.com/images/I/616XlmzI0zL._AC_UY218_.jpg" },
                { name: "Microwaves", image: "https://m.media-amazon.com/images/I/71eosSc0pfL._AC_UY218_.jpg" },
                { name: "Washing machines", image: "https://m.media-amazon.com/images/I/614WPs7pU5L._AC_UY218_.jpg" }
            ],
            linkText: "See more"
        },
        {
            title: "Bulk order discounts + Up to 18% GST savings",
            items: [
                { name: "Up to 45% off | Laptops", image: "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SY170_.jpg" },
                { name: "Up to 60% off | Kitchen appliances", image: "https://m.media-amazon.com/images/I/61oIvQ2+kQL._AC_UY218_.jpg" },
                { name: "Min. 50% off | Office furniture", image: "https://m.media-amazon.com/images/I/71pc7uwiJbL._AC_UL320_.jpg" },
                { name: "Register using GST, Udyam, FSSAI or BPAN", image: "https://m.media-amazon.com/images/I/71XEsXS5RlL._AC_UY218_.jpg" }
            ],
            linkText: "Create a free account"
        },
        {
            title: "Starting ₹49 | Deals on home essentials",
            items: [
                { name: "Cleaning supplies", image: "https://m.media-amazon.com/images/I/61nCEDQ-ESL._AC_UL320_.jpg" },
                { name: "Bathroom accessories", image: "https://m.media-amazon.com/images/I/61-rAmHxihL._AC_UL320_.jpg" },
                { name: "Home tools", image: "https://m.media-amazon.com/images/I/61lmMgNvOIL._AC_UL320_.jpg" },
                { name: "Wallpapers", image: "https://m.media-amazon.com/images/I/817D24SQA9L._AC_UL320_.jpg" }
            ],
            linkText: "Explore all"
        },
        {
            title: "Automotive essentials | Up to 60% off",
            items: [
                { name: "Cleaning accessories", image: "https://m.media-amazon.com/images/I/71M7SEcsDpL._AC_UL320_.jpg" },
                { name: "Tyre & rim care", image: "https://m.media-amazon.com/images/I/61AH4tlY50L._AC_UL320_.jpg" },
                { name: "Helmets", image: "https://m.media-amazon.com/images/I/61TvZbOnniL._AC_UL320_.jpg" },
                { name: "Vacuum cleaner", image: "https://m.media-amazon.com/images/I/41jxlxiTnGL._AC_UY218_.jpg" }
            ],
            linkText: "See more"
        },
        {
            title: "Customers' Most-Loved Fashion for you",
            items: [
                { name: "Men's T-shirts", image: "https://m.media-amazon.com/images/I/713n+TxyfCL._AC_UL320_.jpg" },
                { name: "Women's Clothing", image: "https://m.media-amazon.com/images/I/71v+2pfje5L._AC_UL320_.jpg" },
                { name: "Footwear", image: "https://m.media-amazon.com/images/I/71kZwI4bP2L._AC_UL320_.jpg" },
                { name: "Accessories", image: "https://m.media-amazon.com/images/I/61Bi0rMcNgL._AC_UL320_.jpg" }
            ],
            linkText: "Explore more"
        },
        {
            title: "Up to 50% off | International brands",
            items: [
                { name: "Smartphones", image: "https://m.media-amazon.com/images/I/41-lS7+xM4L._AC_SY170_.jpg" },
                { name: "Laptops", image: "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SY170_.jpg" },
                { name: "Headphones", image: "https://m.media-amazon.com/images/I/51oyBaXOGbL._AC_UY218_.jpg" },
                { name: "Smartwatches", image: "https://m.media-amazon.com/images/I/61sFBIcJAqL._AC_UY218_.jpg" }
            ],
            linkText: "See all offers"
        },
        {
            title: "Best Sellers in Computers & Accessories",
            items: [
                { name: "Cables", image: "https://m.media-amazon.com/images/I/61K3e5X2vDL._AC_UY218_.jpg" },
                { name: "Backpacks", image: "https://m.media-amazon.com/images/I/518UUg7HMKL._AC_UY218_.jpg" },
                { name: "Monitors", image: "https://m.media-amazon.com/images/I/81axMs7CDOL._AC_UY218_.jpg" },
                { name: "Mice", image: "https://m.media-amazon.com/images/I/51u8Mrj1CML._AC_UY218_.jpg" }
            ],
            linkText: "See more"
        },
        {
            title: "Best Sellers in Beauty",
            items: [
                { name: "Sunscreen", image: "https://m.media-amazon.com/images/I/61-t4YS+0iL._AC_UL320_.jpg" },
                { name: "Facewash", image: "https://m.media-amazon.com/images/I/51ixwpTYK7L._AC_UL320_.jpg" },
                { name: "Moisturizer", image: "https://m.media-amazon.com/images/I/41nFzsxYbvL._AC_UL320_.jpg" },
                { name: "Skin Care", image: "https://m.media-amazon.com/images/I/41gnNJo3ynL._AC_UL320_.jpg" }
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

                {(loading || isInitialLoad) ? (
                    <div className={`grid ${isSearching ? 'grid-cols-1' : 'grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4 pb-10`}>
                        {Array(itemsPerPage).fill().map((_, i) => (
                            <div key={i} className={`bg-white p-5 rounded-sm border border-gray-100 ${isSearching ? 'flex space-x-4 h-44' : 'h-[380px] flex flex-col'}`}>
                                <div className={`${isSearching ? 'w-[220px] h-full' : 'w-full h-52'} bg-gray-200 animate-pulse rounded-md mb-4`}></div>
                                <div className="flex-grow flex flex-col space-y-3">
                                    <div className="h-4 bg-gray-200 animate-pulse w-3/4 rounded"></div>
                                    <div className="h-4 bg-gray-200 animate-pulse w-1/2 rounded"></div>
                                    <div className="mt-auto h-8 bg-gray-200 animate-pulse w-full rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className={`grid ${isSearching ? 'grid-cols-1' : 'grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4 pb-10 min-h-[400px]`}>
                            {(filteredProducts || []).length > 0 ? (
                                (() => {
                                    const totalPages = Math.ceil((filteredProducts || []).length / itemsPerPage);
                                    const startIndex = (currentPage - 1) * itemsPerPage;
                                    const currentItems = (filteredProducts || []).slice(startIndex, startIndex + itemsPerPage);
                                    return currentItems.map((product) => (
                                        <div key={product._id} className={isSearching ? "border-b border-gray-200 pb-4" : ""}>
                                            <ProductCard
                                                id={product._id}
                                                title={product.name}
                                                price={product.price}
                                                rating={product.rating}
                                                image={product.image}
                                                category={product.category?.name}
                                                horizontal={isSearching}
                                            />
                                        </div>
                                    ));
                                })()
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white shadow-sm border border-gray-200 rounded-sm">
                                    <h2 className="text-2xl font-bold text-gray-800">No results found for your search.</h2>
                                    <p className="text-gray-500 mt-2">Try checking your spelling or use more general terms.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {filteredProducts && filteredProducts.length > itemsPerPage && (
                            <div className="flex justify-center items-center space-x-2 mt-2 mb-12">
                                <button
                                    onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700 border-[#cdcdcd]'}`}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 0); }}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium shadow-sm ${currentPage === i + 1 ? 'bg-[#f3a847] text-white border-[#a88734]' : 'bg-white hover:bg-gray-50 text-gray-700 border-[#cdcdcd]'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => { setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage))); window.scrollTo(0, 0); }}
                                    disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                                    className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700 border-[#cdcdcd]'}`}
                                >
                                    Next
                                </button>
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
