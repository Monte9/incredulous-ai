import React from "react";
import styles from "./Header.module.css";
import { GoSettings } from "react-icons/go";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header_title}>Incredulous AI</div>
      <div className={styles.header_settings}>
        <GoSettings />
      </div>
    </header>
  );
}

export default Header;
