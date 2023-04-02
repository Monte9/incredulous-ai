import React from "react";
import { FaLightbulb } from "react-icons/fa";

function IntroBanner() {
  return (
    <div className="bg-gray-800 rounded-lg p-2 text-center flex justify-center items-center mt-4">
      <div className="text-2xl mr-2">
        <FaLightbulb className="w-4 h-4" />
      </div>
      <p className="text-xs text-left">
        React with an emoji to see the next fact.
      </p>
    </div>
  );
}

export default IntroBanner;
