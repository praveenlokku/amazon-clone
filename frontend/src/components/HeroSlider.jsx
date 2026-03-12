import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sliderImages = [
    "https://m.media-amazon.com/images/I/61G+G9-vAUL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/81KkrQWEHIL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/61Pca7f3SfL._SX3000_.jpg"
];

function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? sliderImages.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === sliderImages.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px] w-full max-w-screen-2xl mx-auto group">
            <div
                className="w-full h-full bg-center bg-cover duration-500 ease-in-out cursor-pointer"
                style={{ backgroundImage: `url(${sliderImages[currentIndex]})` }}
            ></div>

            {/* Left Arrow */}
            <div
                className="absolute top-[20%] lg:top-[30%] -translate-y-1/2 left-0 text-2xl p-2 md:p-10 cursor-pointer focus:outline-none focus:ring-4 ring-white"
                onClick={goToPrevious}
            >
                <div className="bg-transparent group-hover:bg-transparent h-20 w-10 flex items-center justify-center rounded-sm">
                    <ChevronLeft className="text-[#333] hover:text-[#111] stroke-[1] h-12 w-12 drop-shadow-md hidden group-hover:block" />
                </div>
            </div>

            {/* Right Arrow */}
            <div
                className="absolute top-[20%] lg:top-[30%] -translate-y-1/2 right-0 text-2xl p-2 md:p-10 cursor-pointer focus:outline-none focus:ring-4 ring-white"
                onClick={goToNext}
            >
                <div className="bg-transparent group-hover:bg-transparent h-20 w-10 flex items-center justify-center rounded-sm">
                    <ChevronRight className="text-[#333] hover:text-[#111] stroke-[1] h-12 w-12 drop-shadow-md hidden group-hover:block" />
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute w-full h-[30%] bottom-0 z-20 bg-gradient-to-t from-[#eaeded] to-transparent pointer-events-none" />
        </div>
    );
}

export default HeroSlider;
