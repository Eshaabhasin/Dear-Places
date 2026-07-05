'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Mail, BookOpen, Camera, Ticket, FileText, X, Edit3, Lock, Unlock, Trash2 } from 'lucide-react';
import styles from './MemoryTreeArchive.module.css';
import { images } from '@/data/images';
import { recentJourneys } from '@/data/destinations';
import GlassNavRail from '@/components/layout/GlassNavRail';

// Hardcoded default presets for the 5 interactive spots on the tree
const countryPresets = {
  india: {
    key: 'india-gate',
    citySlug: 'new-delhi',
    countryName: 'India',
    title: 'India Gate',
    location: 'New Delhi, India',
    dateShort: 'New Delhi · 16 April 2025',
    greeting: 'Dear Delhi,',
    body: 'You surprised me in ways I never expected. From the buzzing streets to the quiet sunsets, you gave me memories I will keep forever.\n\nI still remember the chai at dawn, the echo of footsteps near India Gate, and the way the whole city glowed at golden hour.\n\nUntil we meet again, dear Delhi.',
    signature: 'Eshaa',
    photo: images.polaroids.indiaGateGoldenHour,
    caption: 'Golden hour at India Gate',
    ticketBrand: 'DELHI METRO',
    ticketType: 'SINGLE JOURNEY',
    ticketRoute: 'Central Secretariat → India Gate',
    ticketDate: '16 APR 2025',
    ticketFare: '₹40',
    receiptBrand: 'INDIA GATE CAFÉ',
    receiptItem1: 'Filter Coffee',
    receiptPrice1: '₹120',
    receiptItem2: 'Samosa Plate',
    receiptPrice2: '₹80',
    receiptTotal: '₹200',
    stamps: [images.stamps.indiaGate, images.stamps.qutubMinar, images.stamps.redFort]
  },
  japan: {
    key: 'tokyo-tower', // mapped to default tokyo/kyoto
    citySlug: 'tokyo',
    countryName: 'Japan',
    title: 'Yasaka Pagoda',
    location: 'Higashiyama, Kyoto',
    dateShort: 'Kyoto · 10 November 2025',
    greeting: 'Dear Kyoto,',
    body: 'Wandering through the narrow wooden streets of Higashiyama as the lanterns flickered on felt like crossing into another era. The towering silhouette of the Yasaka Pagoda against the sunset sky is a memory I will hold forever.\n\nThank you for the peace, the matcha, and the whispering autumn leaves.',
    signature: 'Eshaa',
    photo: images.chapters.kyoto,
    caption: 'Sunset at Yasaka Pagoda',
    ticketBrand: 'KYOTO CITY BUS',
    ticketType: 'ONE-DAY PASS',
    ticketRoute: 'Kyoto Station → Gion',
    ticketDate: '10 NOV 2025',
    ticketFare: '¥700',
    receiptBrand: 'GION MATCHAHOUSE',
    receiptItem1: 'Matcha Parfait',
    receiptPrice1: '¥1,200',
    receiptItem2: 'Hojicha Tea',
    receiptPrice2: '¥450',
    receiptTotal: '¥1,650',
    stamps: []
  },
  france: {
    key: 'eiffel-tower',
    citySlug: 'paris',
    countryName: 'France',
    title: 'Eiffel Tower',
    location: 'Champ de Mars, Paris',
    dateShort: 'Paris · 12 June 2025',
    greeting: 'Dear Paris,',
    body: 'Watching the iron lady sparkle at night from the grassy lawns of Champ de Mars was magic. The cool summer breeze, the accordion music playing in the distance, and the soft golden glow of the tower reflecting in our eyes. Paris feels like a dream I never want to wake up from.',
    signature: 'Eshaa',
    photo: images.backgrounds.parisMiniature,
    caption: 'Sparkling Eiffel Tower',
    ticketBrand: 'RATP METRO',
    ticketType: 'T+ TICKET',
    ticketRoute: 'Châtelet → Bir-Hakeim',
    ticketDate: '12 JUN 2025',
    ticketFare: '€2.15',
    receiptBrand: 'CAFÉ DE FLORE',
    receiptItem1: 'Chocolat Chaud',
    receiptPrice1: '€9.00',
    receiptItem2: 'Croissant',
    receiptPrice2: '€3.50',
    receiptTotal: '€12.50',
    stamps: [images.chapters.paris]
  },
  italy: {
    key: 'florence-duomo',
    citySlug: 'florence', // reuse
    countryName: 'Italy',
    title: 'Venice Canals',
    location: 'Venice, Italy',
    dateShort: 'Venice · 18 June 2025',
    greeting: 'Dear Venice,',
    body: 'Gliding along the quiet back canals in a wooden gondola, hearing only the lap of the water against old stone walls, was purely ethereal. The gothic arches of the palaces rising from the canals made Venice feel floating and timeless.',
    signature: 'Eshaa',
    photo: images.journeyCards.florence,
    caption: 'Gondola ride at dusk',
    ticketBrand: 'ACTV VAPORETTO',
    ticketType: 'SINGLE TICKET',
    ticketRoute: 'Piazzale Roma → San Marco',
    ticketDate: '18 JUN 2025',
    ticketFare: '€9.50',
    receiptBrand: 'GELATERIA NICO',
    receiptItem1: 'Coppa Pistacchio',
    receiptPrice1: '€8.50',
    receiptItem2: 'Espresso Macchiato',
    receiptPrice2: '€2.00',
    receiptTotal: '€10.50',
    stamps: []
  },
  iceland: {
    key: 'aurora-borealis',
    citySlug: 'iceland',
    countryName: 'Iceland',
    title: 'Aurora Borealis',
    location: 'Reykjavik, Iceland',
    dateShort: 'Iceland · 24 February 2026',
    greeting: 'Dear North,',
    body: 'Standing in the biting cold fields outside Reykjavik, waiting. Suddenly, the sky ignited in ribbons of green fire. The Northern Lights danced over the snow-covered volcanic peaks, silent and awe-inspiring. I have never felt so small yet so connected to the cosmos.',
    signature: 'Eshaa',
    photo: images.chapters.iceland,
    caption: 'Northern Lights dancing',
    ticketBrand: 'STRÆTÓ BUS',
    ticketType: 'SINGLE ZONE',
    ticketRoute: 'Hlemmur → Grótta',
    ticketDate: '24 FEB 2026',
    ticketFare: 'kr490',
    receiptBrand: 'SANDHOLT BAKERY',
    receiptItem1: 'Sourdough Pastry',
    receiptPrice1: 'kr850',
    receiptItem2: 'Hot Cocoa',
    receiptPrice2: 'kr650',
    receiptTotal: 'kr1,500',
    stamps: [images.chapters.iceland]
  }
};

const customCoordinates = [
  { top: '290px', left: '520px', lineH: '45px' },
  { top: '110px', left: '490px', lineH: '50px' },
  { top: '80px', left: '720px', lineH: '40px' },
  { top: '280px', left: '210px', lineH: '60px' },
  { top: '230px', left: '850px', lineH: '45px' },
  { top: '320px', left: '630px', lineH: '55px' }
];

function extractLocationFromGreeting(greeting, defaultVal) {
  if (!greeting) return defaultVal;
  let name = greeting.replace(/^dear\s+/i, '').trim();
  name = name.replace(/[,\.!]+$/, '').trim();
  return name || defaultVal;
}

export default function MemoryTreeArchive() {
  const [memories, setMemories] = useState(countryPresets);
  const [selectedCountryKey, setSelectedCountryKey] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [unsealed, setUnsealed] = useState(false);
  const [customMemories, setCustomMemories] = useState([]);

  // Load custom data from localStorage if available
  useEffect(() => {
    const updatedMemories = { ...countryPresets };
    Object.keys(countryPresets).forEach((key) => {
      const preset = countryPresets[key];
      const savedSealed = localStorage.getItem(`sealed_memory_${preset.key}`);
      const savedGreeting = localStorage.getItem(`memory_greeting_${preset.key}`);
      const savedBody = localStorage.getItem(`memory_body_${preset.key}`);
      const savedSig = localStorage.getItem(`memory_sig_${preset.key}`);
      const savedPositions = localStorage.getItem(`memory_positions_${preset.key}`);

      let photo = preset.photo;
      let caption = preset.caption;
      let canvasItems = null;

      if (savedPositions) {
        try {
          const items = JSON.parse(savedPositions);
          canvasItems = items;

          // Filter out expired/temporary blob: URLs
          const photoItems = items.filter(i => i.type === 'photo' && i.photo && !i.photo.startsWith('blob:'));
          const postcardItems = items.filter(i => i.type === 'postcard' && i.stamp && !i.stamp.startsWith('blob:'));

          // Use custom uploaded photo if available
          const customUploaded = photoItems.find(i => i.id.startsWith('polaroid-custom-'));
          if (customUploaded) {
            photo = customUploaded.photo;
            caption = customUploaded.caption;
          } else if (photoItems.length > 0) {
            photo = photoItems[0].photo;
            caption = photoItems[0].caption;
          } else if (postcardItems.length > 0) {
            photo = postcardItems[0].stamp;
            caption = postcardItems[0].text;
          }
        } catch (e) {
          console.error('Error parsing memory positions', e);
        }
      }

      // If there is customized state saved
      updatedMemories[key] = {
        ...preset,
        isSealed: savedSealed === 'true',
        greeting: savedGreeting !== null ? savedGreeting : preset.greeting,
        body: savedBody !== null ? savedBody : preset.body,
        signature: savedSig !== null ? savedSig : preset.signature,
        photo: photo,
        caption: caption,
        canvasItems: canvasItems,
        // If it was explicitly sealed or edited, keep track of status
        hasMemory: savedGreeting !== null || savedBody !== null || savedSealed !== null
      };

      // By default, India-Gate starts sealed, Eiffel-Tower starts sealed
      if (savedSealed === null) {
        if (key === 'india' || key === 'france') {
          updatedMemories[key].isSealed = true;
          updatedMemories[key].hasMemory = true;
        } else {
          updatedMemories[key].isSealed = false;
        }
      }
    });
    setMemories(updatedMemories);

    // Scan for custom memories in localStorage
    const customMemList = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sealed_memory_')) {
          const presetKey = key.replace('sealed_memory_', '');

          // Check if this is a standard preset key
          const isStandard = Object.values(countryPresets).some(p => p.key === presetKey);
          if (!isStandard) {
            const savedGreeting = localStorage.getItem(`memory_greeting_${presetKey}`) || 'Dear Place,';
            const savedBody = localStorage.getItem(`memory_body_${presetKey}`) || '';
            const savedSig = localStorage.getItem(`memory_sig_${presetKey}`) || 'Explorer';
            const savedLocationHeader = localStorage.getItem(`memory_location_header_${presetKey}`) || 'Custom Destination';
            const savedPositions = localStorage.getItem(`memory_positions_${presetKey}`);

            // Skip empty/untouched custom memories to prevent cluttering and duplicates
            const isDefaultGreeting = !savedGreeting || savedGreeting === 'Dear Place,';
            const isDefaultBody = !savedBody || savedBody.includes('Write your general travel memory here...') || savedBody.trim() === '';
            if (isDefaultGreeting && isDefaultBody) {
              continue;
            }

            let photo = images.backgrounds.landingGlobeDesk; // Neutral default thumbnail
            let caption = 'Captured moment';
            let canvasItems = null;

            if (savedPositions) {
              try {
                const items = JSON.parse(savedPositions);
                canvasItems = items;

                const photoItems = items.filter(item => item.type === 'photo' && item.photo && !item.photo.startsWith('blob:'));
                const customUploaded = photoItems.find(item => item.id.startsWith('polaroid-custom-'));
                if (customUploaded) {
                  photo = customUploaded.photo;
                  caption = customUploaded.caption;
                } else if (photoItems.length > 0) {
                  photo = photoItems[0].photo;
                  caption = photoItems[0].caption;
                }
              } catch (e) {
                console.error(e);
              }
            }

            const placeName = extractLocationFromGreeting(savedGreeting, savedLocationHeader.split('-')[0].trim());

            customMemList.push({
              key: presetKey,
              citySlug: 'custom-city',
              countryName: 'Adventure',
              title: placeName,
              location: savedLocationHeader,
              dateShort: savedLocationHeader,
              greeting: savedGreeting,
              body: savedBody,
              signature: savedSig,
              photo: photo,
              caption: caption,
              canvasItems: canvasItems,
              isSealed: true,
              hasMemory: true,
              isCustom: true
            });
          }
        }
      }
    } catch (err) {
      console.error('Error loading custom memories', err);
    }
    setCustomMemories(customMemList);
  }, [modalOpen]);

  const handleOpenCustomMemory = (key) => {
    const foundCustom = customMemories.find(m => m.key === key);
    if (foundCustom) {
      setSelectedCountryKey(null);
      setSelectedMemory(foundCustom);
      setUnsealed(false);
      setModalOpen(true);
    }
  };

  const handleOpenMemory = (key) => {
    const mem = memories[key];
    setSelectedCountryKey(key);
    setSelectedMemory(mem);
    setUnsealed(!mem.isSealed); // If it's not sealed, open it immediately
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMemory(null);
    setSelectedCountryKey(null);
  };

  const handleToggleSeal = () => {
    if (!selectedMemory) return;
    const nextSealed = !selectedMemory.isSealed;

    // Save to localStorage
    if (nextSealed) {
      localStorage.setItem(`sealed_memory_${selectedMemory.key}`, 'true');
    } else {
      localStorage.removeItem(`sealed_memory_${selectedMemory.key}`);
    }

    // Update state
    if (selectedCountryKey) {
      setMemories((prev) => ({
        ...prev,
        [selectedCountryKey]: {
          ...prev[selectedCountryKey],
          isSealed: nextSealed
        }
      }));
    } else {
      setCustomMemories((prev) =>
        prev.map(m => m.key === selectedMemory.key ? { ...m, isSealed: nextSealed } : m)
      );
    }

    setSelectedMemory((prev) => ({
      ...prev,
      isSealed: nextSealed
    }));

    if (!nextSealed) {
      setUnsealed(true);
    } else {
      setUnsealed(false);
    }
  };

  const handleDeleteCustomMemory = (key) => {
    if (window.confirm('Are you sure you want to permanently delete this custom memory? This cannot be undone.')) {
      // Remove all localStorage items for this custom key
      localStorage.removeItem(`sealed_memory_${key}`);
      localStorage.removeItem(`memory_greeting_${key}`);
      localStorage.removeItem(`memory_body_${key}`);
      localStorage.removeItem(`memory_sig_${key}`);
      localStorage.removeItem(`memory_location_header_${key}`);
      localStorage.removeItem(`memory_positions_${key}`);

      // Close modal and update state
      setModalOpen(false);
      setSelectedMemory(null);
      setCustomMemories((prev) => prev.filter(m => m.key !== key));
    }
  };

  const handleClearAllCustomMemories = () => {
    if (window.confirm('Delete all custom memories? Standard presets like India and France will not be affected.')) {
      customMemories.forEach(mem => {
        const key = mem.key;
        localStorage.removeItem(`sealed_memory_${key}`);
        localStorage.removeItem(`memory_greeting_${key}`);
        localStorage.removeItem(`memory_body_${key}`);
        localStorage.removeItem(`memory_sig_${key}`);
        localStorage.removeItem(`memory_location_header_${key}`);
        localStorage.removeItem(`memory_positions_${key}`);
      });
      // Also clear legacy keys
      localStorage.removeItem('sealed_memory_custom-general');
      localStorage.removeItem('memory_greeting_custom-general');
      localStorage.removeItem('memory_body_custom-general');
      localStorage.removeItem('memory_sig_custom-general');
      localStorage.removeItem('memory_location_header_custom-general');
      localStorage.removeItem('memory_positions_custom-general');

      localStorage.removeItem('sealed_memory_general');
      localStorage.removeItem('memory_greeting_general');
      localStorage.removeItem('memory_body_general');
      localStorage.removeItem('memory_sig_general');
      localStorage.removeItem('memory_location_header_general');
      localStorage.removeItem('memory_positions_general');

      setCustomMemories([]);
    }
  };

  return (
    <main className={styles.viewport}>
      {/* 3D-wash cinematic tree background */}
      <div
        className={styles.backgroundLayer}
        style={{ backgroundImage: `url("${images.backgrounds.memoryTree}")` }}
      />

      {/* Atmospheric overlays */}
      <div className={styles.sideVignette} />
      <div className={styles.treeToneDeepen} />
      <div className={styles.goldenBloomGlow} />
      <div className={styles.ambientScrim} />

      {/* Glass Nav Rail */}
      <GlassNavRail activeId="letters" />

      {/* Top Bar Row */}
      <header className={styles.topBar}>
        <Link href="/" className={styles.brandRow}>
          <div className={styles.compassMark}>
            <Compass size={20} color="rgb(242, 211, 141)" strokeWidth={1.8} />
          </div>
          <div className={styles.brandTextColumn}>
            <span className={styles.brandName}>DEAR PLACES</span>
            <span className={styles.brandSubline}>A Living Archive of Journeys</span>
          </div>
        </Link>

        <div className={styles.welcomePill}>
          <div className={styles.welcomeAvatar}>
            <svg stroke="rgb(242, 211, 141)" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className={styles.welcomeTextBlock}>
            <span className={styles.welcomeGreeting}>Welcome back,</span>
            <span className={styles.welcomeName}>Traveller</span>
          </div>
        </div>
      </header>

      {/* Hero Title Block */}
      <div className={styles.heroTitleBlock}>
        <h1 className={styles.heroHeadline}>The Memory Tree</h1>
        <p className={styles.heroSubtitle}>Every place you loved still grows here.</p>
        {customMemories.length > 0 && (
          <button
            onClick={handleClearAllCustomMemories}
            style={{ marginTop: '12px', background: 'rgba(255, 69, 58, 0.12)', border: '1px solid rgba(255, 69, 58, 0.25)', color: '#ff453a', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontFamily: 'var(--font-body)', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            Clear All Custom Memories
          </button>
        )}
      </div>

      {/* Interactive Swaying Tree Hotspots */}
      <div className={styles.hotspotContainer}>
        {/* Japan Spot */}
        <div
          className={styles.hotspot}
          style={{ top: '225px', left: '370px' }}
          onClick={() => handleOpenMemory('japan')}
          title="Explore Japan Memory"
        >
          <div className={styles.hangingLine} style={{ height: '55px' }} />
          <div className={styles.hangingSign}>Japan</div>
          <div className={styles.hangingPolaroid}>
            <div
              className={styles.polaroidPhotoThumb}
              style={{ backgroundImage: `url("${memories.japan.photo}")` }}
            />
            <div className={styles.polaroidPhotoCaption}>{memories.japan.caption}</div>
          </div>
          {memories.japan.isSealed ? (
            <div className={styles.attachedSeal} />
          ) : (
            <div className={styles.draftTag}>Draft</div>
          )}
        </div>

        {/* India Spot */}
        <div
          className={styles.hotspot}
          style={{ top: '215px', left: '685px' }}
          onClick={() => handleOpenMemory('india')}
          title="Explore India Memory"
        >
          <div className={styles.hangingLine} style={{ height: '40px' }} />
          <div className={styles.hangingSign}>India</div>
          <div className={styles.hangingPolaroid}>
            <div
              className={styles.polaroidPhotoThumb}
              style={{ backgroundImage: `url("${memories.india.photo}")` }}
            />
            <div className={styles.polaroidPhotoCaption}>{memories.india.caption}</div>
          </div>
          {memories.india.isSealed ? (
            <div className={styles.attachedSeal} />
          ) : (
            <div className={styles.draftTag}>Draft</div>
          )}
        </div>

        {/* Italy Spot */}
        <div
          className={styles.hotspot}
          style={{ top: '75px', left: '945px' }}
          onClick={() => handleOpenMemory('italy')}
          title="Explore Italy Memory"
        >
          <div className={styles.hangingLine} style={{ height: '45px' }} />
          <div className={styles.hangingSign}>Italy</div>
          <div className={styles.hangingPolaroid}>
            <div
              className={styles.polaroidPhotoThumb}
              style={{ backgroundImage: `url("${memories.italy.photo}")` }}
            />
            <div className={styles.polaroidPhotoCaption}>{memories.italy.caption}</div>
          </div>
          {memories.italy.isSealed ? (
            <div className={styles.attachedSeal} />
          ) : (
            <div className={styles.draftTag}>Draft</div>
          )}
        </div>

        {/* France Spot */}
        <div
          className={styles.hotspot}
          style={{ top: '265px', left: '935px' }}
          onClick={() => handleOpenMemory('france')}
          title="Explore France Memory"
        >
          <div className={styles.hangingLine} style={{ height: '50px' }} />
          <div className={styles.hangingSign}>France</div>
          <div className={styles.hangingPolaroid}>
            <div
              className={styles.polaroidPhotoThumb}
              style={{ backgroundImage: `url("${memories.france.photo}")` }}
            />
            <div className={styles.polaroidPhotoCaption}>{memories.france.caption}</div>
          </div>
          {memories.france.isSealed ? (
            <div className={styles.attachedSeal} />
          ) : (
            <div className={styles.draftTag}>Draft</div>
          )}
        </div>

        {/* Iceland Spot */}
        <div
          className={styles.hotspot}
          style={{ top: '265px', left: '1095px' }}
          onClick={() => handleOpenMemory('iceland')}
          title="Explore Iceland Memory"
        >
          <div className={styles.hangingLine} style={{ height: '45px' }} />
          <div className={styles.hangingSign}>Iceland</div>
          <div className={styles.hangingPolaroid}>
            <div
              className={styles.polaroidPhotoThumb}
              style={{ backgroundImage: `url("${memories.iceland.photo}")` }}
            />
            <div className={styles.polaroidPhotoCaption}>{memories.iceland.caption}</div>
          </div>
          {memories.iceland.isSealed ? (
            <div className={styles.attachedSeal} />
          ) : (
            <div className={styles.draftTag}>Draft</div>
          )}
        </div>

        {/* Custom Memories Hotspots */}
        {customMemories.map((mem, index) => {
          const coords = customCoordinates[index % customCoordinates.length];
          return (
            <div
              key={mem.key}
              className={styles.hotspot}
              style={{ top: coords.top, left: coords.left }}
              onClick={() => handleOpenCustomMemory(mem.key)}
              title={`Explore ${mem.title} Memory`}
            >
              <div className={styles.hangingLine} style={{ height: coords.lineH }} />
              <div className={styles.hangingSign}>{mem.title}</div>
              <div className={styles.hangingPolaroid}>
                <div
                  className={styles.polaroidPhotoThumb}
                  style={{ backgroundImage: `url("${mem.photo}")` }}
                />
                <div className={styles.polaroidPhotoCaption}>{mem.caption}</div>
              </div>
              {mem.isSealed ? (
                <div className={styles.attachedSeal} />
              ) : (
                <div className={styles.draftTag}>Draft</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Recent Journeys Strip */}
      <div className={styles.recentJourneysStrip}>
        <div className={styles.recentJourneysHeading}>
          <span className={styles.recentJourneysTitle}>Recent Journeys</span>
          <div className={styles.headingRule} />
        </div>
        <div className={styles.collectibleCardsRow}>
          {[
            ...recentJourneys,
            ...customMemories.map(m => ({
              name: m.title || 'Custom Place',
              meta: m.dateShort || 'My Custom Journey',
              image: m.photo,
              isCustom: true,
              memoryKey: m.key
            }))
          ].map((journey, idx) => {
            if (journey.isCustom) {
              return (
                <div
                  key={journey.name + idx}
                  className={styles.collectibleCard}
                  onClick={() => handleOpenCustomMemory(journey.memoryKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={styles.cardImage}
                    style={{ backgroundImage: `url("${journey.image}")` }}
                  />
                  <div className={styles.cardScrim} />
                  <div className={styles.cardCaption}>
                    <span className={styles.cardName}>{journey.name}</span>
                    <span className={styles.cardMeta}>{journey.meta}</span>
                  </div>
                </div>
              );
            }

            // Find if we have a slug mapping
            let slug = 'new-delhi';
            if (journey.name.toLowerCase().includes('delhi')) slug = 'new-delhi';
            else if (journey.name.toLowerCase().includes('kyoto')) slug = 'tokyo';
            else if (journey.name.toLowerCase().includes('paris')) slug = 'paris';
            else if (journey.name.toLowerCase().includes('reykjavik')) slug = 'iceland';
            else if (journey.name.toLowerCase().includes('bali')) slug = 'bali';
            else if (journey.name.toLowerCase().includes('marrakech')) slug = 'cape-town'; // reuse

            return (
              <Link
                key={journey.name + idx}
                href={`/city/${slug}`}
                className={styles.collectibleCard}
              >
                <div
                  className={styles.cardImage}
                  style={{ backgroundImage: `url("${journey.image}")` }}
                />
                <div className={styles.cardScrim} />
                <div className={styles.cardCaption}>
                  <span className={styles.cardName}>{journey.name}</span>
                  <span className={styles.cardMeta}>{journey.meta}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Immersive vintage memory reading modal */}
      {modalOpen && selectedMemory && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Close Cross */}
            <button className={styles.closeButton} onClick={handleCloseModal} title="Return to Tree">
              <X size={18} />
            </button>

            {/* Left Column (Ephemera stack) */}
            <div className={styles.modalLeftColumn}>
              {selectedMemory.canvasItems && selectedMemory.canvasItems.length > 0 ? (
                selectedMemory.canvasItems
                  .filter(item => item.type !== 'letter' && item.type !== 'stamps-panel')
                  .filter(item => {
                    if (item.type === 'photo' && item.photo && item.photo.startsWith('blob:')) return false;
                    if (item.type === 'postcard' && item.stamp && item.stamp.startsWith('blob:')) return false;
                    return true;
                  })
                  .map((item) => {
                    if (item.type === 'photo') {
                      return (
                        <div key={item.id} className={styles.polaroidCard}>
                          <div
                            className={styles.polaroidPhoto}
                            style={{ backgroundImage: `url("${item.photo}")` }}
                          />
                          <div className={styles.polaroidCaption}>{item.caption}</div>
                        </div>
                      );
                    }
                    if (item.type === 'ticket') {
                      return (
                        <div key={item.id} className={styles.ticketCard}>
                          <span className={styles.ticketBrand}>{item.brand}</span>
                          <span className={styles.ticketType}>{item.ticketType}</span>
                          <div className={styles.ticketRoute}>{item.route}</div>
                          <div className={styles.ticketDetails}>
                            <span>DATE: {item.date}</span>
                            <span>FARE: {item.fare}</span>
                          </div>
                        </div>
                      );
                    }
                    if (item.type === 'receipt') {
                      return (
                        <div key={item.id} className={styles.receiptCard}>
                          <div className={styles.receiptBrand}>{item.brand}</div>
                          <div className={styles.receiptRow}>
                            <span>1x {item.item1}</span>
                            <span>{item.price1}</span>
                          </div>
                          <div className={styles.receiptRow}>
                            <span>1x {item.item2}</span>
                            <span>{item.price2}</span>
                          </div>
                          <div className={styles.receiptTotalRow}>
                            <span>TOTAL</span>
                            <span>{item.total}</span>
                          </div>
                          <div className={styles.receiptThanks}>Thank you!</div>
                        </div>
                      );
                    }
                    if (item.type === 'postcard') {
                      return (
                        <div key={item.id} className={styles.postcardCard}>
                          <div className={styles.postcardLeft}>
                            <span className={styles.postcardText}>{item.text}</span>
                          </div>
                          <div className={styles.postcardRight}>
                            <div className={styles.postcardStampBox}>
                              <div
                                className={styles.postcardStampImage}
                                style={{ backgroundImage: `url("${item.stamp}")` }}
                              />
                            </div>
                            <div className={styles.postcardAddressLines}>
                              <div className={styles.postcardLine} />
                              <div className={styles.postcardLine} />
                              <div className={styles.postcardLine} />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
              ) : (
                <>
                  {/* Polaroid card */}
                  <div className={styles.polaroidCard}>
                    <div
                      className={styles.polaroidPhoto}
                      style={{ backgroundImage: `url("${selectedMemory.photo}")` }}
                    />
                    <div className={styles.polaroidCaption}>{selectedMemory.caption}</div>
                  </div>

                  {/* Transit Ticket */}
                  <div className={styles.ticketCard}>
                    <span className={styles.ticketBrand}>{selectedMemory.ticketBrand}</span>
                    <span className={styles.ticketType}>{selectedMemory.ticketType}</span>
                    <div className={styles.ticketRoute}>{selectedMemory.ticketRoute}</div>
                    <div className={styles.ticketDetails}>
                      <span>DATE: {selectedMemory.ticketDate}</span>
                      <span>FARE: {selectedMemory.ticketFare}</span>
                    </div>
                  </div>

                  {/* Shop Receipt */}
                  <div className={styles.receiptCard}>
                    <div className={styles.receiptBrand}>{selectedMemory.receiptBrand}</div>
                    <div className={styles.receiptRow}>
                      <span>1x {selectedMemory.receiptItem1}</span>
                      <span>{selectedMemory.receiptPrice1}</span>
                    </div>
                    <div className={styles.receiptRow}>
                      <span>1x {selectedMemory.receiptItem2}</span>
                      <span>{selectedMemory.receiptPrice2}</span>
                    </div>
                    <div className={styles.receiptTotalRow}>
                      <span>TOTAL</span>
                      <span>{selectedMemory.receiptTotal}</span>
                    </div>
                    <div className={styles.receiptThanks}>Thank you!</div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column (Letter paper or sealed envelope) */}
            <div className={styles.modalRightColumn}>
              {selectedMemory.isSealed && !unsealed ? (
                /* SEALED ENVELOPE FRONT */
                <div className={styles.sealedEnvelope} onClick={() => setUnsealed(true)} title="Break Wax Seal & Read">
                  <div className={styles.envelopeFlap} />
                  <div className={styles.envelopePocket} />
                  <div className={styles.envelopeSealedCaption}>
                    <span className={styles.envelopeCaptionLabel}>Sealed</span>
                    <span className={styles.envelopeCaptionDate}>{selectedMemory.dateShort}</span>
                  </div>
                  <div className={styles.envelopeWaxSeal}>
                    <div className={styles.envelopeWaxSealRing}>
                      <svg viewBox="0 0 512 512" fill="currentColor" className={styles.envelopeWaxSealIcon}>
                        <path d="M281.31 21.217L239.997 127.13l76.01 103.673 97.135-7.532-3.1-79.284-78.2-12.468-1.61 41.535 29.11 7.568-.766-14.1 18.662-1.012 2.15 39.635-68.41-17.788 3.004-77.61 68.65 10.946-2.456-86.044-98.863-13.43zM243.63 66.39l-73.702 39.917L195.885 243.7l141.306 80.704 154.447-80.037-11.252-142.205-79.617-.988.642 22.512 26.705 4.257 4.403 112.57-125.436 9.727-88.227-120.338 24.774-63.51zm-93.107 88.706c-2.992-.017-6.01.004-9.054.06-9.456.174-19.425.853-29.44 1.594 9.427 13.32 18.694 26.165 30.157 35.938 7.894 6.73 16.835 12.308 28.075 16.056l-10.1-53.453c-3.184-.11-6.396-.176-9.64-.194zm25.57 84.51c-14.278 5.27-27.16 13.25-39.437 23.55-17.875 14.995-34.273 35.22-50.625 58.47 56.9 2.6 100.16-6.41 147.316-35.01l-54.223-30.966-3.03-16.045zm270.854 48.968l-50.64 26.244c27.874 20.83 54.865 27.206 90.162 28.557-8.76-21.213-22.617-39.484-39.523-54.8zm-189.853 4.895c-14.566 9.75-28.84 17.8-43.156 24.342.37 10.843 2.813 19.703 6.968 26.47-29.49 37.69-61.714 72.017-96.78 102.843-17.584-1.215-24.577-19.137-17.845-37.344-22.758 18.074-30.427 42.166-20 68.376-6.832 5.23-13.75 10.354-20.78 15.344h45.344c25.65-20.11 49.915-41.82 72.844-65.094 29.485 9.192 54.05-1.51 69.625-27.97-14.975 8.052-31.217 5.627-37.438-6.686 9.653-11.06 19.037-22.436 28.156-34.125 7.25 1.21 15.586.57 24.72-2.03-8.863-17.974-13.326-39.19-11.656-64.126zm18.133 17.065c1.205 25.213 10.463 44.01 24.648 60.12 17.914 20.346 44.73 35.942 73.625 50.814 7.79-33.575 9.555-62.664-2.05-93.77l-34.692 17.978-61.53-35.143z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                /* OPEN WRITTEN LETTER PAPER */
                <div className={styles.letterPaper}>
                  <span className={styles.letterDateLine}>{selectedMemory.dateShort}</span>
                  <div className={styles.letterGreeting}>{selectedMemory.greeting}</div>
                  <div className={styles.letterBody}>{selectedMemory.body}</div>
                  <div className={styles.letterSignature}>
                    <span className={styles.signatureYours}>Yours,</span>
                    <span className={styles.signatureInput}>{selectedMemory.signature}</span>
                  </div>

                  {/* Render stamps collected on the letter */}
                  <div className={styles.placedStampsContainer}>
                    {selectedMemory.stamps?.map((stampImg, sidx) => (
                      <div
                        key={sidx}
                        className={styles.placedStamp}
                        style={{ backgroundImage: `url("${stampImg}")` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className={styles.modalActions}>
              <Link
                href={`/letter/write?city=${selectedMemory.citySlug}&landmark=${selectedMemory.key}`}
                className={styles.editButton}
              >
                <Edit3 size={14} />
                <span>Edit Workspace</span>
              </Link>

              <button className={styles.unsealButton} onClick={handleToggleSeal}>
                {selectedMemory.isSealed ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Unlock size={14} />
                    <span>Unseal</span>
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={14} />
                    <span>Seal Envelope</span>
                  </span>
                )}
              </button>

              {selectedMemory.isCustom && (
                <button
                  className={styles.unsealButton}
                  onClick={() => handleDeleteCustomMemory(selectedMemory.key)}
                  style={{ backgroundColor: 'rgba(255, 69, 58, 0.15)', borderColor: 'rgba(255, 69, 58, 0.3)', color: '#ff453a' }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
