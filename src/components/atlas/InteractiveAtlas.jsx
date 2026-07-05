'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Mail, Map, ArrowRight, X, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './InteractiveAtlas.module.css';
import { images } from '@/data/images';
import { destinations, globeMarkers, recentChapters } from '@/data/destinations';

// Filter out New York from the globe markers
const filteredGlobeMarkers = globeMarkers.filter(m => m.slug !== 'new-york');

export default function InteractiveAtlas() {
  const [selectedDest, setSelectedDest] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 1440, height: 900 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [customMemoryLink, setCustomMemoryLink] = useState('/letter/write?city=custom-city&landmark=custom-general');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setCustomMemoryLink(`/letter/write?city=custom-city&landmark=custom-${Date.now()}`);
  }, []);

  // Filter destinations based on search query
  const searchResults = searchQuery.trim()
    ? destinations.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // ⌘K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setSearchQuery('');
        setSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSelect = useCallback((dest) => {
    setSelectedDest(dest);
    setSearchQuery('');
    setSearchFocused(false);
    searchInputRef.current?.blur();
    localStorage.setItem('lastSelectedCity', dest.slug);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMarkerClick = (destSlug, e) => {
    e.stopPropagation();
    const dest = destinations.find((d) => d.slug === destSlug);
    if (selectedDest?.slug === destSlug) {
      setSelectedDest(null);
    } else {
      setSelectedDest(dest);
      localStorage.setItem('lastSelectedCity', destSlug);
    }
  };

  const handleCanvasClick = () => {
    setSelectedDest(null);
  };

  // Coordinates of markers in canvas space (1440x1140)
  // Fine-tuned to match the printed globe dots on the background image exactly
  const getCoordinates = (slug) => {
    switch (slug) {
      case 'new-delhi': return { left: 870, top: 490 }; // On the bright Indian subcontinent
      case 'paris': return { left: 430, top: 364 };
      case 'tokyo': return { left: 1020, top: 400 };    // Japan — far east on the globe's right edge
      case 'iceland': return { left: 556, top: 198 };
      case 'new-york': return { left: 266, top: 556 }; // Kept for zoom target if searched
      case 'cape-town': return { left: 488, top: 792 };
      case 'bali': return { left: 960, top: 650 };      // Indonesia — SE Asia archipelago
      default: return { left: 720, top: 570 };
    }
  };

  // Calculate pan-and-zoom transformation matrix
  const getTransform = () => {
    if (!selectedDest) {
      // Default state: scale down to 0.58 so the globe looks smaller and fits the screen nicely
      return 'scale(0.58) translate(0px, 20px)';
    }

    const { left: targetX, top: targetY } = getCoordinates(selectedDest.slug);

    // Zoom in state: scale to 1.15 and center on target coordinate
    const scale = 1.15;
    const dx = (720 - targetX) * scale;
    const dy = (570 - targetY) * scale;

    return `scale(${scale}) translate(${dx}px, ${dy}px)`;
  };

  return (
    <div className={styles.atlasViewport} onClick={handleCanvasClick}>
      {/* Search Bar */}
      <div className={styles.atlasSearchWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.atlasSearchBar} ${searchFocused ? styles.searchActive : ''}`}>
          <Search size={18} className={styles.atlasSearchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search destinations, memories…"
            className={styles.atlasSearchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
          <div className={styles.atlasShortcutBadge}>
            <span className={styles.atlasShortcutText}>⌘ K</span>
          </div>
        </div>
        {/* Search Results Dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div className={styles.searchDropdown}>
            {searchResults.map((dest) => (
              <button
                key={dest.slug}
                className={styles.searchResultItem}
                onMouseDown={() => handleSearchSelect(dest)}
              >
                <div className={styles.searchResultDot} />
                <div className={styles.searchResultInfo}>
                  <span className={styles.searchResultName}>{dest.fullName}</span>
                  <span className={styles.searchResultDate}>{dest.dates}</span>
                </div>
                <ArrowRight size={14} className={styles.searchResultArrow} />
              </button>
            ))}
          </div>
        )}
        {searchFocused && searchQuery.trim() && searchResults.length === 0 && (
          <div className={styles.searchDropdown}>
            <div className={styles.searchNoResults}>No destinations found</div>
          </div>
        )}
      </div>

      {/* Interactive virtual canvas wrapper */}
      <div
        ref={containerRef}
        className={styles.canvasContainer}
        style={{ transform: getTransform() }}
      >
        {/* Background Globe Image */}
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${images.backgrounds.atlasGlobeScene})` }}
        />
        <div className={styles.radialVignette} />

        {/* Pinned Destination Markers */}
        {filteredGlobeMarkers.map((marker) => {
          const isSelected = selectedDest?.slug === marker.slug;
          const isDimmed = selectedDest && selectedDest.slug !== marker.slug;
          const { left, top } = getCoordinates(marker.slug);

          return (
            <div
              key={marker.slug}
              className={`${styles.marker} ${isSelected ? styles.selected : ''} ${isDimmed ? styles.dimmed : ''}`}
              style={{ left: `${left}px`, top: `${top}px` }}
              onClick={(e) => handleMarkerClick(marker.slug, e)}
            >
              <div className={styles.markerDot} />
              {/* Labels visible by default showing name and date */}
              <div className={styles.markerLabel}>
                <span className={styles.markerName}>{marker.name}</span>
                <span className={styles.markerDate}>{marker.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Destination Detail Card Popup (Rendered outside canvas for crisp readability) */}
      <div
        className={`${styles.detailCard} ${selectedDest ? styles.active : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {selectedDest && (
          <>
            {/* Close button to reset viewport and hide card */}
            <button className={styles.closeCardButton} onClick={handleCanvasClick}>
              <X size={18} />
            </button>

            <div className={styles.cardHeading}>
              <h3 className={styles.cardTitle}>{selectedDest.fullName}</h3>
              <span className={styles.cardDates}>{selectedDest.dates}</span>
            </div>
            <div className={styles.cardStats}>
              <div className={styles.cardStat}>
                <div className={styles.statIcon}>
                  <Camera size={18} strokeWidth={2} />
                </div>
                <span className={styles.statValue}>{selectedDest.memories}</span>
                <span className={styles.statLabel}>Memories</span>
              </div>
              <div className={styles.cardStat}>
                <div className={styles.statIcon}>
                  <Mail size={18} strokeWidth={2} />
                </div>
                <span className={styles.statValue}>{selectedDest.letters}</span>
                <span className={styles.statLabel}>Letters</span>
              </div>
              <div className={styles.cardStat}>
                <div className={styles.statIcon}>
                  <Map size={18} strokeWidth={2} />
                </div>
                <span className={styles.statValue}>{selectedDest.postcards}</span>
                <span className={styles.statLabel}>Postcards</span>
              </div>
            </div>
            <Link href={`/city/${selectedDest.slug}`} className={styles.exploreButton}>
              <span>Explore City</span>
              <ArrowRight size={18} />
            </Link>
          </>
        )}
      </div>

      {/* Recent Chapters Panel (Right side) */}
      <aside className={styles.recentPanel} onClick={(e) => e.stopPropagation()}>
        <h4 className={styles.panelHeader}>Recent Chapters</h4>
        <div className={styles.chaptersList}>
          {recentChapters.map((chapter) => (
            <Link href={`/city/${chapter.slug}`} key={chapter.name} className={styles.chapterRow}>
              <div
                className={styles.chapterThumb}
                style={{ backgroundImage: `url(${chapter.thumb})` }}
              />
              <div className={styles.chapterMeta}>
                <span className={styles.chapterName}>{chapter.name}</span>
                <span className={styles.chapterDate}>{chapter.date}</span>
                <div className={styles.chapterContinue}>
                  <span className={styles.continueText}>Continue</span>
                  <div className={styles.continueIcon}>
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href={customMemoryLink}
          className={styles.viewAllButton}
          style={{ height: '36px', background: 'linear-gradient(135deg, rgb(123, 109, 255) 0%, rgb(150, 120, 255) 100%)', border: 'none', boxShadow: '0px 10px 24px rgba(123, 109, 255, 0.3)', color: '#fff', gap: '8px', cursor: 'pointer' }}
        >
          <span>Create Custom Memory</span>
          <Camera size={14} />
        </Link>
      </aside>

      {/* Ambient Quote (Bottom Right, stays fixed to screen) */}
      <div
        className={styles.quoteContainer}
        style={{
          left: 'calc(100vw - 340px)',
          top: 'calc(100vh - 150px)',
        }}
      >
        <span className={styles.quoteLine}>“The world is full of places</span>
        <div className={styles.quoteRowTwo}>
          <span className={styles.quoteLine}>that remembers you.”</span>
          <div className={styles.quoteIcon}>
            <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
              <path d="M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z" />
            </svg>
          </div>
        </div>
        <div className={styles.quoteFlourish} />
      </div>
    </div>
  );
}
