import * as React from 'react';

interface EmailTemplateProps {
  OTP_CODE: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    OTP_CODE,
}) => (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 my-8">
    <h2 className="text-xl font-bold text-center text-gray-700">Your OTP Code</h2>
    <p className="text-center text-gray-600 mt-2">Use the OTP code below to verify your account:</p>
    
    <div className="my-6">
      <p className="text-center text-3xl font-semibold text-green-500">{OTP_CODE}</p>
    </div>
    
    <p className="text-gray-600 text-sm text-center">This OTP is valid for the next 15 minutes. If you didn’t request this code, you can safely ignore this email.</p>
    
    <div className="mt-6 text-center">
      <a href="https://quickcapture.vercel.app" className="bg-green-500 text-white py-2 px-4 rounded-md font-medium inline-block">Visit our Website</a>
    </div>

    <p className="text-gray-400 text-xs text-center mt-6">&copy; 2024 Your Company. All rights reserved.</p>
  </div>
);
