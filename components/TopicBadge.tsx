import React from "react";
import { FACT_CATEGORIES } from "../shared/Constants";

function Badge() {
  return (
    <div className="bg-primary-light dark:bg-primary-dark py-1 px-2 rounded-md">
      <p className="text-xs font-bold text-white">
        {FACT_CATEGORIES[0].toLocaleUpperCase()}
      </p>
    </div>
  );
}

export default Badge;
