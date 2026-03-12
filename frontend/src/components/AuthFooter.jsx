import React from 'react';

function AuthFooter() {
    return (
        <div className="mt-10 border-t border-gray-200 w-full flex flex-col items-center pt-8 bg-gradient-to-t from-[#fff] to-[#fafafa] flex-grow">
            <div className="flex space-x-10 text-[11px] text-[#0066c0]">
                <span className="hover:text-[#c45500] hover:underline cursor-pointer">Conditions of Use</span>
                <span className="hover:text-[#c45500] hover:underline cursor-pointer">Privacy Notice</span>
                <span className="hover:text-[#c45500] hover:underline cursor-pointer">Help</span>
            </div>
            <p className="text-[11px] text-[#555] mt-4 mb-4">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
        </div>
    );
}

export default AuthFooter;
