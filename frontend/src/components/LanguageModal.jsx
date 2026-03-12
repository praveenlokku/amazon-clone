import React from 'react';
import { X } from 'lucide-react';
import { useStateValue } from '../StateProvider.jsx';

const languages = [
    { code: 'EN', name: 'English', native: 'English' },
    { code: 'HI', name: 'Hindi', native: 'हिन्दी' },
    { code: 'TA', name: 'Tamil', native: 'தமிழ்' },
    { code: 'TE', name: 'Telugu', native: 'తెలుగు' },
    { code: 'KN', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ML', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'BN', name: 'Bengali', native: 'বাংলা' },
    { code: 'MR', name: 'Marathi', native: 'मराठी' },
];

function LanguageModal({ isOpen, onClose }) {
    const [{ language }, dispatch] = useStateValue();

    const handleSelect = (lang) => {
        dispatch({
            type: 'SET_LANGUAGE',
            language: lang
        });
        onClose();
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
            <div className="relative bg-white w-[500px] rounded-[8px] overflow-hidden shadow-2xl animate-fade-in-up">
                {/* Header */}
                <div className="bg-[#f0f2f2] px-6 py-4 border-b border-[#d5d9d9] flex items-center justify-between">
                    <h2 className="text-[17px] font-bold text-[#111]">Language Settings</h2>
                    <X
                        className="h-6 w-6 cursor-pointer text-[#565959] hover:text-black transition-colors"
                        onClick={onClose}
                    />
                </div>

                <div className="p-6">
                    <p className="text-[14px] font-bold text-[#111] mb-2">Select the language you prefer for browsing, shopping, and communications.</p>
                    <p className="text-[13px] text-[#555] mb-6 border-b border-[#e7eaf3] pb-4">
                        Changing your language will update your browsing experience. However, please note that some features or communications may still be in English.
                    </p>

                    <div className="grid grid-cols-2 gap-y-4">
                        {languages.map((lang) => (
                            <div
                                key={lang.code}
                                className="flex items-center space-x-3 cursor-pointer group"
                                onClick={() => handleSelect(lang)}
                            >
                                <div className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center transition-all ${language.code === lang.code
                                    ? 'border-amazon-orange border-[6px]'
                                    : 'border-[#888c8c] group-hover:border-amazon-orange'
                                    }`}>
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[14px] ${language.code === lang.code ? 'font-bold' : ''}`}>
                                        {lang.name} - {lang.code}
                                    </span>
                                    <span className="text-[12px] text-[#565959] -mt-0.5">{lang.native}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#e7eaf3] flex justify-end space-x-3">
                        <button
                            className="bg-[#f0f2f2] border border-[#d5d9d9] hover:bg-[#e3e6e6] px-6 py-2 rounded-[8px] shadow-sm text-[16px] text-[#111] font-normal transition-all"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-[#f7b055] hover:bg-[#f3a847] px-8 py-2 rounded-[8px] shadow-sm border border-[#cea06c] text-[16px] text-white font-bold transition-all"
                            onClick={onClose}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LanguageModal;
