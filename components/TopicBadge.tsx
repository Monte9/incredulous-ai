import React from "react";
import { FACT_CATEGORIES } from "../shared/Constants";

function Badge() {
  return (
    <div className="bg-blue-500 text-white py-1 px-2 rounded-md">
      <p className="text-xs font-bold">
        {FACT_CATEGORIES[0].toLocaleUpperCase()}
      </p>
    </div>
  );
}

export default Badge;
