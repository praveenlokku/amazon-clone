import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider.jsx';

function LocationModal({ isOpen, onClose }) {
    const [{ user, location }, dispatch] = useStateValue();
    const [pincode, setPincode] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);

    const handleApplyPincode = async () => {
        if (pincode.length === 6) {
            try {
                // Fetching city details for India pincode
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();

                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    const city = postOffice.District || postOffice.Block || postOffice.Name;

                    dispatch({
                        type: 'SET_LOCATION',
                        location: { city: city, pincode: pincode }
                    });
                    onClose();
                } else {
                    alert('Invalid pincode. Please try again.');
                }
            } catch (error) {
                console.error("Pincode fetch error", error);
                // Fallback
                dispatch({
                    type: 'SET_LOCATION',
                    location: { city: 'Detected Location', pincode: pincode }
                });
                onClose();
            }
        } else {
            alert('Please enter a valid 6-digit pincode');
        }
    };

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // Using a free reverse geocoding API (Nominatim)
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                        const data = await response.json();

                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Detected Location';
                        const postCode = data.address.postcode?.split(',')[0] || data.address.postal_code || '';

                        if (postCode) {
                            dispatch({
                                type: 'SET_LOCATION',
                                location: { city, pincode: postCode }
                            });
                            onClose();
                        } else {
                            // If postcode is missing, try to fetch it using coordinates if possible or just use city
                            dispatch({
                                type: 'SET_LOCATION',
                                location: { city, pincode: 'Detecting...' }
                            });
                            onClose();
                        }
                        setIsDetecting(false);
                    } catch (error) {
                        console.error("Geocoding error", error);
                        // Fallback
                        dispatch({
                            type: 'SET_LOCATION',
                            location: { city: 'Bangalore', pincode: '560001' }
                        });
                        setIsDetecting(false);
                        onClose();
                    }
                },
                (error) => {
                    console.error("Geolocation error", error);
                    alert("Unable to detect location. Please enter manually.");
                    setIsDetecting(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
            setIsDetecting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-[375px] rounded-[8px] overflow-hidden shadow-2xl animate-fade-in-up">
                {/* Header */}
                <div className="bg-[#f0f2f2] px-6 py-4 border-b border-[#d5d9d9] flex items-center justify-between">
                    <h2 className="text-[17px] font-bold text-[#111]">Choose your location</h2>
                    <X
                        className="h-6 w-6 cursor-pointer text-[#565959] hover:text-black transition-colors"
                        onClick={onClose}
                    />
                </div>

                <div className="p-6">
                    <p className="text-[13px] text-[#565959] leading-relaxed mb-4">
                        Delivery options and delivery speeds may vary for different locations
                    </p>

                    {!user && (
                        <Link
                            to="/login"
                            className="block w-full text-center bg-amazon-yellow hover:bg-[#f3a847] py-2 rounded-md shadow-sm border border-[#a18a5a] text-[13px] font-bold mb-4 transition-all"
                            onClick={onClose}
                        >
                            Sign in to see your addresses
                        </Link>
                    )}

                    {/* Geolocation Trigger */}
                    <button
                        onClick={detectLocation}
                        disabled={isDetecting}
                        className="flex items-center text-[#007185] hover:text-[#c45500] hover:underline text-[14px] font-medium mb-4 disabled:text-gray-400"
                    >
                        <MapPin className="h-4 w-4 mr-2" />
                        {isDetecting ? 'Detecting...' : 'Use my current location'}
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-[#e7eaf3]"></div>
                        <span className="flex-shrink mx-2 text-[11px] text-[#767676] tracking-wide">or enter an Indian pincode</span>
                        <div className="flex-grow border-t border-[#e7eaf3]"></div>
                    </div>

                    {/* Pincode Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter pincode"
                            className="flex-grow border border-[#adb1b8] rounded-md px-3 py-1.5 text-[14px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                        />
                        <button
                            onClick={handleApplyPincode}
                            className="bg-white border border-[#adb1b8] hover:bg-[#f7fafa] px-6 py-1.5 rounded-md shadow-sm text-[13px] transition-all"
                        >
                            Apply
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-[#e7eaf3]"></div>
                        <span className="flex-shrink mx-2 text-[11px] text-[#767676] tracking-wide uppercase">or</span>
                        <div className="flex-grow border-t border-[#e7eaf3]"></div>
                    </div>

                    {/* Country/Region Dropdown */}
                    <div className="relative group">
                        <select
                            className="w-full bg-[#f0f2f2] border border-[#d5d9d9] rounded-md py-2 px-3 text-[13px] appearance-none cursor-pointer hover:bg-[#e3e6e6] transition-all outline-none"
                            defaultValue="India"
                        >
                            <option value="India">Ship outside India</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="DE">Germany</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#565959]">
                            ▼
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            className="bg-amazon-yellow hover:bg-[#f3a847] px-6 py-1.5 rounded-md shadow-sm border border-[#a18a5a] text-[13px] font-bold transition-all"
                            onClick={onClose}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationModal;
