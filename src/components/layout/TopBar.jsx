'use client';

import { Compass, Search, ChevronDown } from 'lucide-react';
import styles from './TopBar.module.css';

export default function TopBar({ showSearch = true }) {
  return (
    <header className={styles.topBar}>
      {/* Brand Lockup */}
      <div className={styles.brandLockup}>
        <div className={styles.compassMark}>
          <Compass size={24} color="rgb(242, 211, 141)" strokeWidth={1.8} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>DEAR PLACES</span>
          <span className={styles.brandSubline}>A Living Archive of Journeys</span>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search destinations, memories…"
            className={styles.searchInput}
          />
          <div className={styles.shortcutBadge}>
            <span className={styles.shortcutText}>⌘ K</span>
          </div>
        </div>
      )}

      {/* Profile Cluster */}
      <div className={styles.profileCluster}>
        <div className={styles.welcomeProfilePill}>
          <div className={styles.profileAvatar}>
            <svg stroke="rgb(231, 195, 125)" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className={styles.profileText}>
            <span className={styles.profileWelcome}>Welcome back,</span>
            <span className={styles.profileName}>Eshaa</span>
          </div>
          <ChevronDown size={16} className={styles.chevronIcon} />
        </div>
      </div>
    </header>
  );
}
