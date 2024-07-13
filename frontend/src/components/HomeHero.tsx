import React from "react";
import { Link } from "react-router-dom";
// import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const HeroSection: React.FC = () => {
  return (
    <div
      className="relative h-[80vh] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://www.memphispropertymanagementinc.com/images/blog/Business-People-Handshake-Gree.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
      {/* Overlay for better text visibility */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          Rent or Add Your Products Easily
        </h1>
        <p className="mb-8 text-xl md:text-2xl">
          Join our community to rent or list your products for others to use.
        </p>
        <Link to="/addproduct">
          <button className="border-none bg-blue-600 px-4 py-3 font-bold text-white transition-transform hover:-translate-x-2 hover:translate-y-2 hover:bg-blue-700">
            <span className="text-xl">+</span> Add Product for Rent
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
