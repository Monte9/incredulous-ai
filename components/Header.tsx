import React from "react";
import { GoSettings } from "react-icons/go";

type Props = {
  setShowPreferencesModal: (boolean) => void;
};

function Header(props: Props) {
  const { setShowPreferencesModal } = props;

  return (
    <header className="header flex justify-between items-center h-16 py-8 px-5 bg-background-light dark:bg-background-dark text-bright-light dark:text-bright-dark sticky top-0 left-0 right-0">
      <div className="header_title text-2xl font-bold text-left flex-1 sm:text-center">
        Incredulous AI
      </div>
      <div className="header_settings text-2xl flex-0 sm:absolute sm:right-5 sm:text-xl text-bright-light dark:text-bright-dark">
        <button onClick={() => setShowPreferencesModal(true)}>
          <GoSettings />
        </button>
      </div>
    </header>
  );
}

export default Header;
