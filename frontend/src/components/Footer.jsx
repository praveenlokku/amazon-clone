import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronUp, ChevronDown } from 'lucide-react';
import { useStateValue } from '../StateProvider.jsx';
import LanguageModal from './LanguageModal.jsx';

function Footer() {
    const [{ language }, dispatch] = useStateValue();
    const [isLanguageModalOpen, setIsLanguageModalOpen] = React.useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#232f3e] text-white overflow-hidden font-inter">
            {/* Back to Top */}
            <div
                onClick={scrollToTop}
                className="bg-[#37475a] hover:bg-[#485769] transition-colors py-4 text-center cursor-pointer text-[13px] font-medium"
            >
                Back to top
            </div>

            {/* Main Footer Links */}
            <div className="max-w-[1000px] mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-[14px]">
                <div className="space-y-3">
                    <h3 className="font-bold text-[16px] text-white">Get to Know Us</h3>
                    <ul className="space-y-2 text-[#DDD] text-[13px]">
                        <li className="hover:underline cursor-pointer"><a href="https://www.aboutamazon.in/" target="_blank" rel="noreferrer">About Amazon</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://amazon.jobs/" target="_blank" rel="noreferrer">Careers</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://press.aboutamazon.in/" target="_blank" rel="noreferrer">Press Releases</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://www.amazon.science/" target="_blank" rel="noreferrer">Amazon Science</a></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-[16px] text-white">Connect with Us</h3>
                    <ul className="space-y-2 text-[#DDD] text-[13px]">
                        <li className="hover:underline cursor-pointer"><a href="https://www.facebook.com/AmazonIN" target="_blank" rel="noreferrer">Facebook</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://twitter.com/AmazonIN" target="_blank" rel="noreferrer">Twitter</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://www.instagram.com/amazondotin" target="_blank" rel="noreferrer">Instagram</a></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-[16px] text-white">Make Money with Us</h3>
                    <ul className="space-y-2 text-[#DDD] text-[13px]">
                        <li className="hover:underline cursor-pointer"><a href="https://sell.amazon.in/" target="_blank" rel="noreferrer">Sell on Amazon</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://sell.amazon.in/grow-your-business/amazon-accelerator" target="_blank" rel="noreferrer">Sell under Amazon Accelerator</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://brandservices.amazon.in/" target="_blank" rel="noreferrer">Protect and Build Your Brand</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://sell.amazon.in/global-selling" target="_blank" rel="noreferrer">Amazon Global Selling</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://supply.amazon.in/" target="_blank" rel="noreferrer">Supply to Amazon</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://affiliate-program.amazon.in/" target="_blank" rel="noreferrer">Become an Affiliate</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://sell.amazon.in/fulfilment-by-amazon" target="_blank" rel="noreferrer">Fulfilment by Amazon</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://advertising.amazon.in/" target="_blank" rel="noreferrer">Advertise Your Products</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://amazonpay.amazon.in/merchant" target="_blank" rel="noreferrer">Amazon Pay on Merchants</a></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-[16px] text-white">Let Us Help You</h3>
                    <ul className="space-y-2 text-[#DDD] text-[13px]">
                        <li className="hover:underline cursor-pointer"><Link to="/orders">Your Account</Link></li>
                        <li className="hover:underline cursor-pointer"><Link to="/orders">Returns Centre</Link></li>
                        <li className="hover:underline cursor-pointer"><a href="https://www.amazon.in/gp/help/customer/display.html?nodeId=201080510" target="_blank" rel="noreferrer">Recalls and Product Safety Alerts</a></li>
                        <li className="hover:underline cursor-pointer"><Link to="/orders">100% Purchase Protection</Link></li>
                        <li className="hover:underline cursor-pointer"><a href="https://www.amazon.in/gp/browse.html?node=6967393031" target="_blank" rel="noreferrer">Amazon App Download</a></li>
                        <li className="hover:underline cursor-pointer"><a href="https://www.amazon.in/gp/help/customer/display.html" target="_blank" rel="noreferrer">Help</a></li>
                    </ul>
                </div>
            </div>

            {/* Middle Section: Logo and Selectors */}
            <div className="border-t border-[#3a4553] py-10 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
                <Link to="/" className="flex items-center pt-2">
                    <img
                        src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                        alt="Amazon Logo"
                        className="h-[32px] w-auto object-contain"
                    />
                </Link>

                <div className="flex space-x-4">
                    <div
                        onClick={() => setIsLanguageModalOpen(true)}
                        className="border border-[#848688] rounded-[3px] px-3 py-1.5 flex items-center space-x-2 text-[13px] text-[#DDD] cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                        <Globe className="h-4 w-4" />
                        <span>{language.name}</span>
                        <div className="flex flex-col ml-1">
                            <ChevronUp className="h-2 w-2 mb-[-2px] text-gray-500" />
                            <ChevronDown className="h-2 w-2 text-gray-500" />
                        </div>
                    </div>
                    <div className="border border-[#848688] rounded-[3px] px-3 py-1.5 flex items-center space-x-2 text-[13px] text-[#DDD] cursor-pointer hover:bg-gray-700 transition-colors">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/20px-Flag_of_India.svg.png" alt="India flag" className="h-[12px] w-[18px] object-cover" />
                        <span>India</span>
                    </div>
                </div>
            </div>

            <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />

            {/* Services Grid (Deep Footer) */}
            <div className="bg-[#131a22] py-12">
                <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 text-[11px] text-[#999]">
                    <a href="https://www.abebooks.com/" target="_blank" rel="noreferrer" className="cursor-pointer group block">
                        <h4 className="text-white text-[12px] group-hover:underline">AbeBooks</h4>
                        <p className="leading-tight group-hover:underline">Books, art<br />& collectibles</p>
                    </a>
                    <a href="https://aws.amazon.com/" target="_blank" rel="noreferrer" className="cursor-pointer group block">
                        <h4 className="text-white text-[12px] group-hover:underline">Amazon Web Services</h4>
                        <p className="leading-tight group-hover:underline">Scalable Cloud<br />Computing Services</p>
                    </a>
                    <a href="https://www.audible.in/" target="_blank" rel="noreferrer" className="cursor-pointer group block">
                        <h4 className="text-white text-[12px] group-hover:underline">Audible</h4>
                        <p className="leading-tight group-hover:underline">Download<br />Audio Books</p>
                    </a>
                    <a href="https://www.imdb.com/" target="_blank" rel="noreferrer" className="cursor-pointer group block">
                        <h4 className="text-white text-[12px] group-hover:underline">IMDb</h4>
                        <p className="leading-tight group-hover:underline">Movies, TV<br />& Celebrities</p>
                    </a>
                    <a href="https://www.shopbop.com/" target="_blank" rel="noreferrer" className="cursor-pointer group block">
                        <h4 className="text-white text-[12px] group-hover:underline">Shopbop</h4>
                        <p className="leading-tight group-hover:underline">Designer<br />Fashion Brands</p>
                    </a>
                    <a href="https://business.amazon.in/" target="_blank" rel="noreferrer" className="cursor-pointer group block">
                        <h4 className="text-white text-[12px] group-hover:underline">Amazon Business</h4>
                        <p className="leading-tight group-hover:underline">Everything For<br />Your Business</p>
                    </a>
                    <a href="https://music.amazon.in/" target="_blank" rel="noreferrer" className="cursor-pointer group block">
                        <h4 className="text-white text-[12px] group-hover:underline">Amazon Prime Music</h4>
                        <p className="leading-tight group-hover:underline">100 million songs, ad-free<br />Over 15 million podcast episodes</p>
                    </a>
                </div>

                <div className="mt-12 flex flex-col items-center">
                    <div className="flex space-x-4 text-[12px] text-[#DDD]">
                        <a href="https://www.amazon.in/gp/help/customer/display.html?nodeId=200545940" target="_blank" rel="noreferrer" className="hover:underline cursor-pointer">Conditions of Use & Sale</a>
                        <a href="https://www.amazon.in/gp/help/customer/display.html?nodeId=200534380" target="_blank" rel="noreferrer" className="hover:underline cursor-pointer">Privacy Notice</a>
                        <a href="https://www.amazon.in/gp/help/customer/display.html?nodeId=200541550" target="_blank" rel="noreferrer" className="hover:underline cursor-pointer">Interest-Based Ads</a>
                    </div>
                    <p className="text-[12px] text-[#DDD] mt-1 space-x-1 flex items-center">
                        <span>© 1996-2026, Amazon.com, Inc. or its affiliates</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
