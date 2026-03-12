import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, MapPin, Menu, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';
import Sidebar from './Sidebar.jsx';
import LocationModal from './LocationModal.jsx';
import LanguageModal from './LanguageModal.jsx';
import AccountDropdown from './AccountDropdown.jsx';
import { getTranslation } from '../utils/translations.js';

function Header() {
    const [{ cart, user, location, language }, dispatch] = useStateValue();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [searchCategory, setSearchCategory] = useState('search-alias=aps');
    const [showBottomNav, setShowBottomNav] = useState(true);

    const t = getTranslation(language.code);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 10) {
                // Scrolled down
                setShowBottomNav(false);
            } else {
                // At top
                setShowBottomNav(true);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAuthentication = () => {
        if (user) {
            dispatch({
                type: 'USER_LOGOUT'
            });
            navigate('/');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?s=${searchTerm.trim()}`);
        } else {
            navigate('/');
        }
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Top Nav */}
            {/* Top Nav */}
            <div className="flex flex-col bg-amazon-blue px-2 py-1">
                <div className="flex items-center w-full justify-between sm:gap-4">
                    {/* Logo */}
                    <Link to="/" className="border border-transparent hover:border-white px-2 py-1 rounded-[1px] ml-1 transition-all flex items-center h-[50px]">
                        <img
                            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                            alt="Amazon Logo"
                            className="h-[28px] w-auto object-contain mt-2"
                        />
                    </Link>

                    {/* Deliver to */}
                    <div
                        className="text-white hidden lg:flex items-center cursor-pointer border border-transparent hover:border-white px-2 rounded-[1px] h-[50px] transition-all ml-2"
                        onClick={() => setIsLocationModalOpen(true)}
                    >
                        <MapPin className="h-[18px] mt-3 mr-0.5" />
                        <div className="flex flex-col justify-center mt-2">
                            <p className="text-[#ccc] text-[12px] leading-tight font-normal">{t.deliverTo} {user ? user.name?.split(' ')[0] : ''}</p>
                            <p className="font-bold leading-tight text-[14px]">{(location.city || location.pincode) ? `${location.city} ${location.pincode}` : 'Select your address'}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="hidden sm:flex items-center h-[40px] rounded-[4px] flex-grow cursor-pointer bg-white overflow-hidden focus-within:ring-[3px] focus-within:ring-amazon-orange mx-2">
                        <select
                            className="h-full px-2 bg-[#f3f3f3] hover:bg-[#d4d4d4] text-[#555] text-[12px] border-r border-[#cdcdcd] transition-colors outline-none cursor-pointer w-[52px] md:w-[auto] md:max-w-[70px] rounded-l-[4px] appearance-none"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23555%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .5em top 50%', backgroundSize: '.65em auto', paddingRight: '1.2em' }}
                        >
                            <option value="search-alias=aps">{t.all} Departments</option>
                            <option value="search-alias=alexa-skills">{t.alexaSkills}</option>
                            <option value="search-alias=amazon-devices">{t.amazonDevices}</option>
                            <option value="search-alias=fashion">{t.amazonFashion}</option>
                            <option value="search-alias=nowstore">{t.amazonFresh}</option>
                            <option value="search-alias=amazon-pharmacy">{t.amazonPharmacy}</option>
                            <option value="search-alias=appliances">{t.appliances}</option>
                            <option value="search-alias=mobile-apps">{t.appsGames}</option>
                            <option value="search-alias=audible">{t.audible}</option>
                            <option value="search-alias=baby">{t.baby}</option>
                            <option value="search-alias=beauty">{t.beauty}</option>
                            <option value="search-alias=stripbooks">{t.books}</option>
                            <option value="search-alias=automotive">{t.carMotorbike}</option>
                            <option value="search-alias=apparel">{t.clothingAccessories}</option>
                            <option value="search-alias=collectibles">{t.collectibles}</option>
                            <option value="search-alias=computers">{t.computersAccessories}</option>
                            <option value="search-alias=electronics">{t.electronics}</option>
                            <option value="search-alias=furniture">{t.furniture}</option>
                            <option value="search-alias=lawngarden">{t.gardenOutdoors}</option>
                            <option value="search-alias=gift-cards">{t.giftCards}</option>
                            <option value="search-alias=grocery">{t.groceryGourmet}</option>
                            <option value="search-alias=hpc">{t.healthPersonalCare}</option>
                            <option value="search-alias=kitchen">{t.homeKitchen}</option>
                            <option value="search-alias=industrial">{t.industrialScientific}</option>
                            <option value="search-alias=jewelry">{t.jewellery}</option>
                            <option value="search-alias=digital-text">{t.kindleStore}</option>
                            <option value="search-alias=luggage">{t.luggageBags}</option>
                            <option value="search-alias=luxury-beauty">{t.luxuryBeauty}</option>
                            <option value="search-alias=dvd">{t.moviesTv}</option>
                            <option value="search-alias=popular">{t.music}</option>
                            <option value="search-alias=mi">{t.musicalInstruments}</option>
                            <option value="search-alias=office-products">{t.officeProducts}</option>
                            <option value="search-alias=pets">{t.petSupplies}</option>
                            <option value="search-alias=prime-video">{t.primeVideo}</option>
                            <option value="search-alias=shoes">{t.shoesHandbags}</option>
                            <option value="search-alias=software">{t.software}</option>
                            <option value="search-alias=sporting">{t.sportsFitness}</option>
                            <option value="search-alias=home-improvement">{t.toolsHome}</option>
                            <option value="search-alias=toys">{t.toysGames}</option>
                            <option value="search-alias=under-ten-dollars">{t.under500}</option>
                            <option value="search-alias=videogames">{t.videoGames}</option>
                            <option value="search-alias=watches">{t.watches}</option>
                        </select>
                        <input
                            className="p-2 h-full flex-grow flex-shrink outline-none px-3 text-black text-[15px]"
                            type="search"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="h-full w-[45px] bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center border-none cursor-pointer transition-colors">
                            <Search className="h-6 w-6 text-[#333] stroke-[2.5px]" />
                        </button>
                    </form>

                    {/* Right Nav */}
                    <div className="text-white flex items-center text-[13px] whitespace-nowrap ml-2">
                        {/* Language Selector */}
                        <div
                            onClick={() => setIsLanguageModalOpen(true)}
                            className="hidden lg:flex items-center cursor-pointer border border-transparent hover:border-white px-2 rounded-[1px] h-[50px] transition-all font-bold group pt-2"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/20px-Flag_of_India.svg.png" alt="India flag" className="h-[14px] w-[20px] mr-1 object-cover mt-1" />
                            <span className="text-[14px] align-middle mt-1">{language.code}</span>
                            <ChevronDown className="h-3 ml-0.5 mt-2 text-gray-400 group-hover:text-white" />
                        </div>

                        <div className="relative group">
                            <Link to={!user ? '/login' : '#'}>
                                <div className="cursor-pointer border border-transparent hover:border-white px-2 rounded-[1px] h-[50px] flex flex-col justify-center transition-all pt-1">
                                    <p className="leading-tight text-[12px] text-white font-normal">{t.hello}, {user ? (user.name || user.email?.split('@')[0]) : t.signIn}</p>
                                    <p className="font-bold text-[14px] leading-tight flex items-center -mt-0.5">
                                        {t.accountLists} <ChevronDown className="h-3 ml-0.5 mt-0.5 text-gray-400" />
                                    </p>
                                </div>
                            </Link>
                            <AccountDropdown handleAuthentication={handleAuthentication} />
                        </div>

                        <Link to="/orders">
                            <div className="hidden md:flex flex-col justify-center cursor-pointer border border-transparent hover:border-white px-2 h-[50px] transition-all pt-1">
                                <p className="leading-tight text-[12px] text-white font-normal">{t.returns}</p>
                                <p className="font-bold text-[14px] leading-tight -mt-0.5">{t.orders}</p>
                            </div>
                        </Link>

                        <Link to="/cart" className="flex items-center cursor-pointer border border-transparent hover:border-white px-2 rounded-[1px] h-[50px] transition-all pt-1">
                            <div className="relative flex items-center">
                                <ShoppingCart className="h-9 w-10 text-white stroke-[1.5px]" />
                                <span className="absolute top-0 left-[19px] py-[2px] px-[6px] text-[#f08804] font-bold text-[15px] rounded-full">
                                    {cart?.length || 0}
                                </span>
                            </div>
                            <p className="font-bold text-[14px] mt-4 ml-1 hidden md:block">{t.cart}</p>
                        </Link>
                    </div>
                </div>

                {/* Search - Mobile */}
                <form onSubmit={handleSearch} className="flex sm:hidden items-center h-[40px] rounded-[4px] w-full cursor-pointer bg-white overflow-hidden focus-within:ring-[3px] focus-within:ring-amazon-orange mt-1.5 mb-1">
                    <input
                        className="p-2 h-full flex-grow flex-shrink outline-none px-3 text-black text-[15px]"
                        type="search"
                        placeholder="Search Amazon.in"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="h-full w-12 bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center border-none cursor-pointer">
                        <Search className="h-6 w-6 text-[#333] stroke-[2.5px]" />
                    </button>
                </form>
            </div>

            {/* Bottom Nav */}
            <div className={`flex items-center bg-amazon-blue-light text-[13px] text-white px-3 flex-nowrap overflow-x-auto no-scrollbar whitespace-nowrap transition-all duration-300 ease-in-out ${showBottomNav ? 'max-h-[50px] py-[6px] opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}>
                <div className="flex items-center cursor-pointer border border-transparent hover:border-white px-1.5 py-[5px] rounded-[1px] h-[32px] transition-all mr-1" onClick={() => setIsSidebarOpen(true)}>
                    <Menu className="h-5 w-5 mr-1 stroke-[2px]" />
                    <span>{t.all}</span>
                </div>
                <div className="flex items-center cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.fresh} <ChevronDown className="h-4 w-4 ml-0.5 mt-0.5 text-gray-400" /></div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.mxPlayer}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.sell}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.bestSellers}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.mobiles}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.customerService}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.todaysDeals}</div>
                <div className="flex items-center cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.prime} <ChevronDown className="h-4 w-4 ml-0.5 mt-0.5 text-gray-400" /></div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.newReleases}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.fashion}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.amazonPay}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.electronics}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.homeKitchen}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.toysGames}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.computers}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.books}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.giftCards}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all">{t.beautyPersonalCare}</div>
                <div className="cursor-pointer border border-transparent hover:border-white px-2 py-[5px] rounded-[1px] h-[32px] transition-all pr-4">{t.carMotorbike}</div>
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
            <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
        </header>
    );
}

export default Header;
