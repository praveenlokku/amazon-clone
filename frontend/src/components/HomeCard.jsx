import React from 'react';

function HomeCard({ title, items, linkText }) {
    return (
        <div className="flex flex-col bg-white z-30 p-[20px] shadow-md border border-gray-100 h-full">
            <h2 className="text-[21px] font-bold mb-[15px] text-[#0f1111] leading-tight">{title}</h2>

            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[10px] flex-grow cursor-pointer">
                {items.map((item, i) => (
                    <div key={i} className="flex flex-col mb-4 group">
                        <div className="overflow-hidden bg-white h-[120px] flex items-center justify-center">
                            <img
                                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                src={item.image}
                                alt={item.name}
                            />
                        </div>
                        <p className="text-[12px] text-[#0f1111] mt-1 group-hover:text-amazon-orange transition-colors truncate">{item.name}</p>
                    </div>
                ))}
            </div>

            <p className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer mt-auto pt-2">{linkText || 'See more'}</p>
        </div>
    );
}

export default HomeCard;
