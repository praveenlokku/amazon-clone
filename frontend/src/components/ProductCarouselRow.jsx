import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProductCarouselRow({ title, products }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            if (direction === 'left') {
                current.scrollBy({ left: -600, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: 600, behavior: 'smooth' });
            }
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="bg-white m-4 p-5 shadow-sm border border-gray-200 relative group">
            <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-[21px] font-bold text-[#0f1111]">{title}</h2>
                <span className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline cursor-pointer font-medium mt-1">See all offers</span>
            </div>

            {/* Left Scroll Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 shadow-[0_1px_3px_rgb(0,0,0,0.3)] h-[100px] w-10 flex items-center justify-center rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            >
                <ChevronLeft className="h-8 w-8 text-[#555]" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto no-scrollbar space-x-6 pb-4 pt-2 px-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((item, i) => (
                    <Link to={`/product/${item._id || item.asin}`} key={i} className="flex-shrink-0 cursor-pointer w-[150px] md:w-[200px]">
                        <div className="h-[200px] bg-[#f7f8f8] flex items-center justify-center p-4 rounded-sm scale-100 hover:scale-105 transition-transform">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-[160px] max-w-full object-contain mix-blend-multiply"
                            />
                        </div>
                        <div className="mt-2 text-center md:text-left">
                            <div className="bg-[#cc0c39] text-white text-[12px] font-bold px-2 py-1 inline-block rounded-sm mb-1">Up to 60% off</div>
                            <span className="text-[#cc0c39] text-[12px] font-bold ml-2">Deal of the Day</span>
                            <p className="text-[14px] line-clamp-1 mt-1 text-[#0f1111]">{item.name}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Right Scroll Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 shadow-[0_1px_3px_rgb(0,0,0,0.3)] h-[100px] w-10 flex items-center justify-center rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
            >
                <ChevronRight className="h-8 w-8 text-[#555]" />
            </button>
        </div>
    );
}

export default ProductCarouselRow;
