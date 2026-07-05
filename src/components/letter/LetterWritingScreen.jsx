'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MapPin, Calendar, Camera, Mail, Bookmark, ChevronLeft,
  ArrowRight, Check, Trash2, Undo2, Redo2, RotateCcw,
  Type, Edit3, Palette, AlignLeft, Plus,
  Image as ImageIcon, Tag, Award, FileText, X
} from 'lucide-react';
import Link from 'next/link';
import styles from './LetterWritingScreen.module.css';
import { images } from '@/data/images';
import { destinations } from '@/data/destinations';

// Preset memory contents for landmarks
const memoryPresets = {
  'india-gate': {
    title: 'India Gate',
    location: 'India Gate, New Delhi',
    date: 'April 16, 2025 · 6:10 PM',
    dateShort: 'New Delhi · 16 April 2025',
    greeting: 'Dear Delhi,',
    body: 'You surprised me in ways I never expected. From the buzzing streets to the quiet sunsets, you gave me memories I will keep forever.\n\nI still remember the chai at dawn, the echo of footsteps near India Gate, and the way the whole city glowed at golden hour.\n\nUntil we meet again, dear Delhi.',
    signature: 'Eshaa',
    polaroidPhoto: images.polaroids.indiaGateGoldenHour,
    polaroidCaption: 'Golden hour at India Gate',
    ticketBrand: 'DELHI METRO',
    ticketType: 'SINGLE JOURNEY',
    ticketRoute: 'Central Secretariat → India Gate',
    ticketDate: '16 APR 2025',
    ticketFare: '₹40',
    receiptBrand: 'INDIA GATE CAFÉ',
    receiptItem1: 'Cappuccino',
    receiptPrice1: '₹180',
    receiptItem2: 'Veg Sandwich',
    receiptPrice2: '₹220',
    receiptTotal: '₹400',
    stampsCount: '6 / 24',
    stampsList: [
      { name: 'INDIA GATE', image: images.stamps.indiaGate },
      { name: 'RED FORT', image: images.stamps.redFort },
      { name: 'HUMAYUN\'S TOMB', image: images.stamps.humayunsTomb },
      { name: 'QUTUB MINAR', image: images.stamps.qutubMinar },
      { name: 'LOTUS TEMPLE', image: images.stamps.lotusTemple },
      { name: 'AKSHARDHAM', image: images.stamps.akshardham }
    ]
  },
  'humayuns-tomb': {
    title: "Humayun's Tomb",
    location: "Humayun's Tomb, New Delhi",
    date: 'April 18, 2025 · 4:30 PM',
    dateShort: 'New Delhi · 18 April 2025',
    greeting: 'Dear Delhi,',
    body: 'The symmetry and grandeur of Humayun’s Tomb took my breath away. Wandering around the red sandstone corridors felt like traveling back in time. The quiet gardens surrounding the tomb provided a peaceful sanctuary from the energetic city rush outside. I could have spent all day sitting by the water channels.',
    signature: 'Eshaa',
    polaroidPhoto: images.backgrounds.newDelhiMiniature,
    polaroidCaption: 'Gardens of Humayun’s Tomb',
    ticketBrand: 'DELHI METRO',
    ticketType: 'SINGLE JOURNEY',
    ticketRoute: 'Jor Bagh → JLN Stadium',
    ticketDate: '18 APR 2025',
    ticketFare: '₹30',
    receiptBrand: 'TOMB SOUVENIRS',
    receiptItem1: 'Postcard Set',
    receiptPrice1: '₹150',
    receiptItem2: 'Cold Water',
    receiptPrice2: '₹40',
    receiptTotal: '₹190',
    stampsCount: '3 / 24',
    stampsList: [
      { name: 'HUMAYUN\'S TOMB', image: images.stamps.humayunsTomb },
      { name: 'QUTUB MINAR', image: images.stamps.qutubMinar },
      { name: 'RED FORT', image: images.stamps.redFort }
    ]
  },
  'red-fort': {
    title: 'Red Fort',
    location: 'Red Fort, New Delhi',
    date: 'April 15, 2025 · 11:15 AM',
    dateShort: 'New Delhi · 15 April 2025',
    greeting: 'Dear Delhi,',
    body: 'Standing before the massive red walls of Lal Qila was inspiring. Walking through the Chatta Chowk bazaar inside felt so lively, just as it must have centuries ago. Learning about the history and walking around the beautiful marble pavilions of the Diwan-i-Khas made for an unforgettable morning.',
    signature: 'Eshaa',
    polaroidPhoto: images.backgrounds.newDelhiMiniature,
    polaroidCaption: 'Red Fort walls',
    ticketBrand: 'DELHI METRO',
    ticketType: 'SINGLE JOURNEY',
    ticketRoute: 'Chandni Chowk → Lal Qila',
    ticketDate: '15 APR 2025',
    ticketFare: '₹20',
    receiptBrand: 'HALDIRAM LAL QILA',
    receiptItem1: 'Chole Bhature',
    receiptPrice1: '₹160',
    receiptItem2: 'Sweet Lassi',
    receiptPrice2: '₹90',
    receiptTotal: '₹250',
    stampsCount: '4 / 24',
    stampsList: [
      { name: 'RED FORT', image: images.stamps.redFort },
      { name: 'INDIA GATE', image: images.stamps.indiaGate },
      { name: 'LOTUS TEMPLE', image: images.stamps.lotusTemple },
      { name: 'AKSHARDHAM', image: images.stamps.akshardham }
    ]
  },
  'eiffel-tower': {
    title: 'Eiffel Tower',
    location: 'Champ de Mars, Paris',
    date: 'June 12, 2025 · 9:30 PM',
    dateShort: 'Paris · 12 June 2025',
    greeting: 'Dear Paris,',
    body: 'Watching the iron lady sparkle at night from the grassy lawns of Champ de Mars was magic. The cool summer breeze, the accordion music playing in the distance, and the soft golden glow of the tower reflecting in our eyes. Paris feels like a dream I never want to wake up from.',
    signature: 'Eshaa',
    polaroidPhoto: images.backgrounds.parisMiniature,
    polaroidCaption: 'Sparkling Eiffel Tower',
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
    stampsCount: '2 / 24',
    stampsList: [
      { name: 'EIFFEL TOWER', image: images.chapters.paris }
    ]
  }
};

const defaultPreset = {
  title: 'New Memory',
  location: 'Custom Location',
  date: 'July 4, 2026 · 7:50 PM',
  dateShort: 'Travel Archive · 4 July 2026',
  greeting: 'Dear Travel Diary,',
  body: 'Start writing your memory here. Click on the text to change it, add photos, notes, and stamps below, then seal the letter when you are done to save it in your archive.',
  signature: 'Explorer',
  polaroidPhoto: images.backgrounds.landingGlobeDesk,
  polaroidCaption: 'Capturing memories',
  ticketBrand: 'TRAVEL TICKET',
  ticketType: 'JOURNEY PASS',
  ticketRoute: 'Departure → Destination',
  ticketDate: '04 JUL 2026',
  ticketFare: 'Free',
  receiptBrand: 'TRAVEL SOUVENIRS',
  receiptItem1: 'Postcard Pack',
  receiptPrice1: '€5.00',
  receiptItem2: 'Warm Coffee',
  receiptPrice2: '€3.00',
  receiptTotal: '€8.00',
  stampsCount: '1 / 24',
  stampsList: [
    { name: 'GLOBE MARKER', image: images.chapters.iceland }
  ]
};

export default function LetterWritingScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const landmarkParam = searchParams.get('landmark');
  const cityParam = searchParams.get('city');

  const presetKey = landmarkParam || cityParam || 'general';
  
  // Get preset dynamically based on landmark or city slug to avoid defaulting to Delhi
  const preset = useMemo(() => {
    if (presetKey && memoryPresets[presetKey]) {
      return memoryPresets[presetKey];
    }
    
    // Find matching destination to construct a premium placeholder letter
    const destination = destinations.find(d => d.slug === cityParam || d.slug === presetKey?.split('-')?.[0]);
    if (destination) {
      return {
        title: `New Memory of ${destination.name}`,
        location: destination.fullName,
        date: 'July 5, 2026 · 5:30 PM',
        dateShort: `${destination.name} · July 2026`,
        greeting: `Dear ${destination.name},`,
        body: `Watching the streets of ${destination.name} glow as the day fades into night was pure magic. Wandering through the corridors of its historic landmarks left an imprint on my soul. I still remember the local flavors, the friendly faces, and the soft whispers of wind that greeted us. ${destination.name} feels like a place I never want to forget.`,
        signature: 'Explorer',
        polaroidPhoto: destination.background || images.backgrounds.landingGlobeDesk,
        polaroidCaption: `Memories in ${destination.name}`,
        ticketBrand: `${destination.name.toUpperCase()} TRAVEL`,
        ticketType: 'EXPLORER PASS',
        ticketRoute: 'Arrival → Destination',
        ticketDate: '05 JUL 2026',
        ticketFare: 'Free Entry',
        receiptBrand: `${destination.name.toUpperCase()} SOUVENIRS`,
        receiptItem1: 'Artisan Keepsake',
        receiptPrice1: '€5.00',
        receiptItem2: 'Spiced Coffee',
        receiptPrice2: '€3.50',
        receiptTotal: '€8.50',
        stampsCount: '1 / 24',
        stampsList: destination.landmarks && destination.landmarks.length > 0 
          ? destination.landmarks.map(l => ({ name: l.name.toUpperCase(), image: destination.background }))
          : [{ name: 'EXPLORE', image: destination.background || images.chapters.iceland }]
      };
    }
    return defaultPreset;
  }, [presetKey, cityParam]);

  const [isSealed, setIsSealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFolding, setIsFolding] = useState(false); // Triggers 3D folding animations

  // Form states
  const [greeting, setGreeting] = useState('');
  const [body, setBody] = useState('');
  const [signature, setSignature] = useState('');
  const [locationHeader, setLocationHeader] = useState('');

  // Draggable items state
  const [canvasItems, setCanvasItems] = useState([]);
  const [maxZIndex, setMaxZIndex] = useState(10);

  const fileInputRef = useRef(null);
  const workspaceRef = useRef(null);
  const letterGreetingRef = useRef(null);

  // Load preset or saved state and positions
  useEffect(() => {
    const savedSealed = localStorage.getItem(`sealed_memory_${presetKey}`);
    setIsSealed(savedSealed === 'true');

    const savedGreeting = localStorage.getItem(`memory_greeting_${presetKey}`);
    const savedBody = localStorage.getItem(`memory_body_${presetKey}`);
    const savedSig = localStorage.getItem(`memory_sig_${presetKey}`);
    const savedLocationHeader = localStorage.getItem(`memory_location_header_${presetKey}`);

    setGreeting(savedGreeting !== null ? savedGreeting : preset.greeting);
    setBody(savedBody !== null ? savedBody : preset.body);
    setSignature(savedSig !== null ? savedSig : preset.signature);
    setLocationHeader(savedLocationHeader !== null ? savedLocationHeader : preset.dateShort);

    // Initialize desk/canvas items from presets or localStorage if saved
    const savedPositions = localStorage.getItem(`memory_positions_${presetKey}`);
    if (savedPositions) {
      try {
        const items = JSON.parse(savedPositions);
        const cleanedItems = items.filter(item => {
          if (item.type === 'photo' && item.photo && item.photo.startsWith('blob:')) return false;
          if (item.type === 'postcard' && item.stamp && item.stamp.startsWith('blob:')) return false;
          return true;
        });
        setCanvasItems(cleanedItems);
      } catch (e) {
        console.error('Error parsing loaded positions', e);
        try {
          setCanvasItems(JSON.parse(savedPositions));
        } catch (_) {}
      }
    } else {
      // Default layouts with compact coordinates to guarantee they fit in 729px screen height
      const initialItems = [
        {
          id: 'letter',
          type: 'letter',
          x: 390,
          y: 20,
          rotation: -1,
          zIndex: 5
        },
        {
          id: 'stamps-panel',
          type: 'stamps-panel',
          x: 980,
          y: 20,
          rotation: 1,
          zIndex: 1
        },
        {
          id: 'polaroid',
          type: 'photo',
          x: 110,
          y: 20,
          rotation: -3,
          zIndex: 4,
          photo: preset.polaroidPhoto,
          caption: preset.polaroidCaption
        },
        {
          id: 'ticket',
          type: 'ticket',
          x: 110,
          y: 240,
          rotation: 2,
          zIndex: 3,
          brand: preset.ticketBrand,
          ticketType: preset.ticketType,
          route: preset.ticketRoute,
          date: preset.ticketDate,
          fare: preset.ticketFare
        },
        {
          id: 'receipt',
          type: 'receipt',
          x: 110,
          y: 420,
          rotation: -2,
          zIndex: 2,
          brand: preset.receiptBrand,
          item1: preset.receiptItem1,
          price1: preset.receiptPrice1,
          item2: preset.receiptItem2,
          price2: preset.receiptPrice2,
          total: preset.receiptTotal
        }
      ];
      setCanvasItems(initialItems);
    }
  }, [presetKey, preset]);

  // Drag and drop event handlers
  const handleDragStart = (id, e) => {
    // If click is inside editable elements, don't drag to allow typing
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
      return;
    }

    e.preventDefault();
    const workspaceRect = workspaceRef.current?.getBoundingClientRect();
    if (!workspaceRect) return;

    // Bring clicked item to front
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    setCanvasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, zIndex: nextZ } : item))
    );

    const activeItem = canvasItems.find((i) => i.id === id);
    if (!activeItem) return;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startItemX = activeItem.x;
    const startItemY = activeItem.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startMouseX;
      const dy = moveEvent.clientY - startMouseY;

      setCanvasItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, x: startItemX + dx, y: startItemY + dy } : item
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSealClick = () => {
    if (isSealed || isFolding) return;
    
    // Start folding animation sequence
    setIsFolding(true);
    setIsTransitioning(true);

    // Save state details
    localStorage.setItem(`memory_greeting_${presetKey}`, greeting);
    localStorage.setItem(`memory_body_${presetKey}`, body);
    localStorage.setItem(`memory_sig_${presetKey}`, signature);
    localStorage.setItem(`memory_location_header_${presetKey}`, locationHeader);
    localStorage.setItem(`sealed_memory_${presetKey}`, 'true');
    localStorage.setItem(`memory_positions_${presetKey}`, JSON.stringify(canvasItems));

    // Time matching the folding flap animations (600ms fold + envelope morph)
    setTimeout(() => {
      setIsSealed(true);
      setIsFolding(false);
      setIsTransitioning(false);
    }, 1100);
  };

  const handleUnsealClick = () => {
    if (!isSealed) return;
    setIsTransitioning(true);

    localStorage.removeItem(`sealed_memory_${presetKey}`);

    setTimeout(() => {
      setIsSealed(false);
      setIsTransitioning(false);
    }, 850);
  };

  const handleResetClick = () => {
    if (window.confirm('Reset this memory letter back to its original preset? All custom edits and positions will be lost.')) {
      localStorage.removeItem(`memory_greeting_${presetKey}`);
      localStorage.removeItem(`memory_body_${presetKey}`);
      localStorage.removeItem(`memory_sig_${presetKey}`);
      localStorage.removeItem(`memory_location_header_${presetKey}`);
      localStorage.removeItem(`sealed_memory_${presetKey}`);
      localStorage.removeItem(`memory_positions_${presetKey}`);

      setGreeting(preset.greeting);
      setBody(preset.body);
      setSignature(preset.signature);
      setLocationHeader(preset.dateShort);
      setIsSealed(false);

      const initialItems = [
        {
          id: 'letter',
          type: 'letter',
          x: 390,
          y: 20,
          rotation: -1,
          zIndex: 5
        },
        {
          id: 'stamps-panel',
          type: 'stamps-panel',
          x: 980,
          y: 20,
          rotation: 1,
          zIndex: 1
        },
        {
          id: 'polaroid',
          type: 'photo',
          x: 110,
          y: 20,
          rotation: -3,
          zIndex: 4,
          photo: preset.polaroidPhoto,
          caption: preset.polaroidCaption
        },
        {
          id: 'ticket',
          type: 'ticket',
          x: 110,
          y: 240,
          rotation: 2,
          zIndex: 3,
          brand: preset.ticketBrand,
          ticketType: preset.ticketType,
          route: preset.ticketRoute,
          date: preset.ticketDate,
          fare: preset.ticketFare
        },
        {
          id: 'receipt',
          type: 'receipt',
          x: 110,
          y: 420,
          rotation: -2,
          zIndex: 2,
          brand: preset.receiptBrand,
          item1: preset.receiptItem1,
          price1: preset.receiptPrice1,
          item2: preset.receiptItem2,
          price2: preset.receiptPrice2,
          total: preset.receiptTotal
        }
      ];
      setCanvasItems(initialItems);
      setMaxZIndex(10);
    }
  };

  // Add custom items
  const handleAddStamp = (stampName, stampImage) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    const newStampItem = {
      id: `stamp-item-${Date.now()}`,
      type: 'stamp-item',
      x: 500 + Math.random() * 80,
      y: 180 + Math.random() * 80,
      rotation: -10 + Math.random() * 20,
      zIndex: nextZ,
      name: stampName,
      image: stampImage
    };

    setCanvasItems((prev) => [...prev, newStampItem]);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);

          const caption = prompt('Enter a caption for your Polaroid:', 'Captured moment') || 'Captured moment';
          const nextZ = maxZIndex + 1;
          setMaxZIndex(nextZ);

          const newPhotoItem = {
            id: `polaroid-custom-${Date.now()}`,
            type: 'photo',
            x: 320 + Math.random() * 100,
            y: 120 + Math.random() * 100,
            rotation: -8 + Math.random() * 16,
            zIndex: nextZ,
            photo: compressedUrl,
            caption: caption
          };

          setCanvasItems((prev) => [...prev, newPhotoItem]);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Spawns a draggable vintage Postcard
  const handleAddPostcard = () => {
    const text = prompt('Enter your postcard message:', 'Wish you were here!') || 'Wish you were here!';
    const stampImage = preset.stampsList?.[0]?.image || images.stamps.indiaGate;

    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    const newPostcardItem = {
      id: `postcard-custom-${Date.now()}`,
      type: 'postcard',
      x: 340 + Math.random() * 100,
      y: 160 + Math.random() * 100,
      rotation: -5 + Math.random() * 10,
      zIndex: nextZ,
      text: text,
      stamp: stampImage
    };

    setCanvasItems((prev) => [...prev, newPostcardItem]);
  };

  const handleWriteLetterClick = () => {
    if (isSealed) {
      handleUnsealClick();
    }
    // Set focus to the letter greeting field
    setTimeout(() => {
      letterGreetingRef.current?.focus();
    }, 100);
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    setCanvasItems((prev) => prev.filter((item) => item.id !== id));
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  // Find original destination for the Back button
  const matchingDest = destinations.find(
    (d) => d.slug === cityParam || d.slug === 'new-delhi'
  );

  return (
    <div className={styles.viewport}>
      {/* Background layer */}
      <div
        className={styles.backgroundLayer}
        style={{ backgroundImage: `url(${images.backgrounds.letterWriting})` }}
      />
      <div className={styles.sceneVignette} />

      {/* Hidden file input for polaroid custom upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />

      {/* Header Block */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          {isSealed ? 'Memory Sealed' : 'Share your Memory'}
        </h2>
        <div className={styles.headerMetaRow}>
          <div className={styles.metaItem}>
            <MapPin size={14} className={styles.metaIcon} />
            <span>{preset.location}</span>
          </div>
          <div className={styles.metaItem}>
            <Calendar size={14} className={styles.metaIcon} />
            <span>{preset.date}</span>
          </div>
        </div>
      </div>

      {/* Interactive Free-form Desk Canvas Container */}
      <div className={styles.mainContent} ref={workspaceRef}>
        {canvasItems.map((item) => {
          const isDraggable = (!isSealed && !isFolding) || item.type !== 'letter';

          // Render item types dynamically
          return (
            <div
              key={item.id}
              className={styles.draggableItem}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: `rotate(${item.rotation}deg)`,
                zIndex: item.zIndex,
              }}
              onMouseDown={(e) => isDraggable && handleDragStart(item.id, e)}
            >
              {/* Optional Delete Button for custom items */}
              {!isSealed && item.id.includes('-custom-') && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  title="Remove from desk"
                >
                  <X size={12} />
                </button>
              )}

              {/* POLAROID CARD */}
              {item.type === 'photo' && (
                <div className={styles.polaroidCard}>
                  <div
                    className={styles.polaroidPhoto}
                    style={{ backgroundImage: `url(${item.photo})` }}
                  />
                  <div className={styles.polaroidCaption}>{item.caption}</div>
                </div>
              )}

              {/* METRO TICKET */}
              {item.type === 'ticket' && (
                <div className={styles.ticketCard}>
                  <span className={styles.ticketBrand}>{item.brand}</span>
                  <span className={styles.ticketType}>{item.ticketType}</span>
                  <span className={styles.ticketRoute}>{item.route}</span>
                  <div className={styles.ticketFooter}>
                    <span className={styles.ticketDate}>{item.date}</span>
                    <span className={styles.ticketFare}>{item.fare}</span>
                  </div>
                </div>
              )}

              {/* CAFÉ RECEIPT */}
              {item.type === 'receipt' && (
                <div className={styles.receiptCard}>
                  <span className={styles.receiptName}>{item.brand}</span>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptItem}>{item.item1}</span>
                    <span className={styles.receiptPrice}>{item.price1}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptItem}>{item.item2}</span>
                    <span className={styles.receiptPrice}>{item.price2}</span>
                  </div>
                  <div className={styles.receiptDivider} />
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptTotalLabel}>Total</span>
                    <span className={styles.receiptTotalValue}>{item.total}</span>
                  </div>
                  <span className={styles.receiptThanks}>Thank you!</span>
                </div>
              )}

              {/* VINTAGE POSTCARD (Custom Added) */}
              {item.type === 'postcard' && (
                <div 
                  className={styles.postcardCard}
                  onDoubleClick={(e) => handleDeleteItem(item.id, e)}
                >
                  <div className={styles.postcardLeft}>
                    <span className={styles.postcardText}>{item.text}</span>
                  </div>
                  <div className={styles.postcardRight}>
                    <div className={styles.postcardStampBox}>
                      <div 
                        className={styles.postcardStampImage}
                        style={{ backgroundImage: `url(${item.stamp})` }}
                      />
                    </div>
                    <div className={styles.postcardAddressLines}>
                      <div className={styles.postcardLine} />
                      <div className={styles.postcardLine} />
                      <div className={styles.postcardLine} />
                    </div>
                  </div>
                </div>
              )}

              {/* SINGLE STAMP */}
              {item.type === 'stamp-item' && (
                <div 
                  className={styles.stampItem} 
                  style={{ width: '90px', padding: '4px 4px 5px 4px', transform: 'none', margin: '0' }}
                  title="Double click to remove"
                  onDoubleClick={(e) => handleDeleteItem(item.id, e)}
                >
                  <div
                    className={styles.stampPhoto}
                    style={{ backgroundImage: `url(${item.image})`, height: '64px' }}
                  />
                  <span className={styles.stampName} style={{ fontSize: '7.5px' }}>{item.name}</span>
                </div>
              )}

              {/* STAMPS COLLECTION PANEL */}
              {item.type === 'stamps-panel' && (
                <div className={styles.stampsPanel} onMouseDown={(e) => e.stopPropagation()}>
                  {/* Outer container keeps mouse events down for stamps drag inside */}
                  <div 
                    className={styles.stampsDragHeader} 
                    onMouseDown={(e) => handleDragStart(item.id, e)}
                  >
                    <span className={styles.stampsTitle}>Stamps Collection</span>
                  </div>
                  <div className={styles.stampsGrid} style={{ marginTop: '8px' }}>
                    {preset.stampsList.map((stamp) => (
                      <div 
                        key={stamp.name} 
                        className={styles.stampItem} 
                        title="Click to place stamp on desk"
                        onClick={() => handleAddStamp(stamp.name, stamp.image)}
                      >
                        <div
                          className={styles.stampPhoto}
                          style={{ backgroundImage: `url(${stamp.image})` }}
                        />
                        <span 
                          className={styles.stampName}
                          style={stamp.name.length > 12 ? { fontSize: '6px' } : undefined}
                        >
                          {stamp.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* THE LETTER / SEALED ENVELOPE PANEL */}
              {item.type === 'letter' && (
                <div className={styles.centerColumn}>
                  {/* Open Letter Paper */}
                  <div className={`${styles.letterPaper} ${isSealed || isTransitioning ? styles.sealing : ''}`}>
                    <input
                      type="text"
                      value={locationHeader}
                      onChange={(e) => setLocationHeader(e.target.value)}
                      className={styles.letterDateLineInput}
                      placeholder="Location & Date"
                      disabled={isSealed}
                    />

                    <input
                      ref={letterGreetingRef}
                      type="text"
                      value={greeting}
                      onChange={(e) => setGreeting(e.target.value)}
                      className={styles.letterGreeting}
                      placeholder="Greeting"
                    />

                    <div className={styles.letterBody}>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className={styles.letterTextArea}
                        placeholder="Write your travel memory here..."
                      />
                    </div>

                    <div className={styles.letterSignature}>
                      <span className={styles.signatureYours}>Yours,</span>
                      <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className={styles.signatureInput}
                        placeholder="Signature"
                      />
                    </div>

                    {/* Bottom Right Wax Seal (acts as Seal button too) */}
                    <div className={styles.letterWaxSeal} onClick={handleSealClick} title="Seal Letter">
                      <div className={styles.waxSealRing}>
                        <svg viewBox="0 0 512 512" fill="currentColor" className={styles.waxSealIcon}>
                          <path d="M281.31 21.217L239.997 127.13l76.01 103.673 97.135-7.532-3.1-79.284-78.2-12.468-1.61 41.535 29.11 7.568-.766-14.1 18.662-1.012 2.15 39.635-68.41-17.788 3.004-77.61 68.65 10.946-2.456-86.044-98.863-13.43zM243.63 66.39l-73.702 39.917L195.885 243.7l141.306 80.704 154.447-80.037-11.252-142.205-79.617-.988.642 22.512 26.705 4.257 4.403 112.57-125.436 9.727-88.227-120.338 24.774-63.51zm-93.107 88.706c-2.992-.017-6.01.004-9.054.06-9.456.174-19.425.853-29.44 1.594 9.427 13.32 18.694 26.165 30.157 35.938 7.894 6.73 16.835 12.308 28.075 16.056l-10.1-53.453c-3.184-.11-6.396-.176-9.64-.194zm25.57 84.51c-14.278 5.27-27.16 13.25-39.437 23.55-17.875 14.995-34.273 35.22-50.625 58.47 56.9 2.6 100.16-6.41 147.316-35.01l-54.223-30.966-3.03-16.045zm270.854 48.968l-50.64 26.244c27.874 20.83 54.865 27.206 90.162 28.557-8.76-21.213-22.617-39.484-39.523-54.8zm-189.853 4.895c-14.566 9.75-28.84 17.8-43.156 24.342.37 10.843 2.813 19.703 6.968 26.47-29.49 37.69-61.714 72.017-96.78 102.843-17.584-1.215-24.577-19.137-17.845-37.344-22.758 18.074-30.427 42.166-20 68.376-6.832 5.23-13.75 10.354-20.78 15.344h45.344c25.65-20.11 49.915-41.82 72.844-65.094 29.485 9.192 54.05-1.51 69.625-27.97-14.975 8.052-31.217 5.627-37.438-6.686 9.653-11.06 19.037-22.436 28.156-34.125 7.25 1.21 15.586.57 24.72-2.03-8.863-17.974-13.326-39.19-11.656-64.126zm18.133 17.065c1.205 25.213 10.463 44.01 24.648 60.12 17.914 20.346 44.73 35.942 73.625 50.814 7.79-33.575 9.555-62.664-2.05-93.77l-34.692 17.978-61.53-35.143z" />
                        </svg>
                      </div>
                    </div>

                    {/* Brass Clip decoration */}
                    <div className={styles.brassClip}>
                      <div className={styles.clipGroove} />
                    </div>

                    {/* Lavender sprigs */}
                    <div className={styles.lavenderRight}>
                      <svg viewBox="0 0 64 132">
                        <path d="M33 132 C33 102 34 78 34 52" stroke="#7f8a56" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <ellipse cx="34" cy="12" rx="5" ry="7" fill="#9079b2" />
                        <ellipse cx="28" cy="20" rx="4.5" ry="6" fill="#8570a6" />
                        <ellipse cx="40" cy="22" rx="4.5" ry="6" fill="#8570a6" />
                        <ellipse cx="30" cy="30" rx="4.5" ry="6" fill="#9079b2" />
                        <ellipse cx="38" cy="32" rx="4.5" ry="6" fill="#8570a6" />
                        <ellipse cx="32" cy="40" rx="4" ry="5.5" fill="#8570a6" />
                        <ellipse cx="37" cy="42" rx="4" ry="5.5" fill="#9079b2" />
                        <ellipse cx="34" cy="50" rx="3.5" ry="5" fill="#8570a6" />
                      </svg>
                    </div>
                    <div className={styles.lavenderLeft}>
                      <svg viewBox="0 0 36 84">
                        <path d="M18 84 C18 64 19 50 19 34" stroke="#7f8a56" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <ellipse cx="19" cy="10" rx="4" ry="5.5" fill="#9079b2" />
                        <ellipse cx="15" cy="17" rx="3.5" ry="5" fill="#8570a6" />
                        <ellipse cx="23" cy="18" rx="3.5" ry="5" fill="#8570a6" />
                        <ellipse cx="18" cy="26" rx="3.5" ry="5" fill="#9079b2" />
                        <ellipse cx="20" cy="33" rx="3" ry="4.5" fill="#8570a6" />
                      </svg>
                    </div>
                  </div>

                  {/* 3D Realistic Folding Flaps Overlay (Visible during folding transition) */}
                  {isFolding && (
                    <div className={styles.foldingContainer}>
                      {/* Top flap folds down */}
                      <div className={`${styles.foldingFlapTop} ${isFolding ? styles.folded : ''}`} />
                      {/* Middle third remains static */}
                      <div className={styles.foldingFlapMiddle} />
                      {/* Bottom flap folds up */}
                      <div className={`${styles.foldingFlapBottom} ${isFolding ? styles.folded : ''}`} />
                    </div>
                  )}

                  {/* Sealed Envelope view */}
                  <div className={`${styles.sealedEnvelope} ${isSealed && !isTransitioning ? styles.active : ''}`}>
                    <div className={styles.envelopeFlap} />
                    <div className={styles.envelopePocket} />

                    {/* Lavender sprigs on envelope */}
                    <div className={styles.lavenderRight}>
                      <svg viewBox="0 0 64 132">
                        <path d="M33 132 C33 102 34 78 34 52" stroke="#7f8a56" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <ellipse cx="34" cy="12" rx="5" ry="7" fill="#9079b2" />
                        <ellipse cx="28" cy="20" rx="4.5" ry="6" fill="#8570a6" />
                        <ellipse cx="40" cy="22" rx="4.5" ry="6" fill="#8570a6" />
                        <ellipse cx="30" cy="30" rx="4.5" ry="6" fill="#9079b2" />
                        <ellipse cx="38" cy="32" rx="4.5" ry="6" fill="#8570a6" />
                        <ellipse cx="32" cy="40" rx="4" ry="5.5" fill="#8570a6" />
                        <ellipse cx="37" cy="42" rx="4" ry="5.5" fill="#9079b2" />
                        <ellipse cx="34" cy="50" rx="3.5" ry="5" fill="#8570a6" />
                      </svg>
                    </div>
                    <div className={styles.lavenderLeft}>
                      <svg viewBox="0 0 36 84">
                        <path d="M18 84 C18 64 19 50 19 34" stroke="#7f8a56" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <ellipse cx="19" cy="10" rx="4" ry="5.5" fill="#9079b2" />
                        <ellipse cx="15" cy="17" rx="3.5" ry="5" fill="#8570a6" />
                        <ellipse cx="23" cy="18" rx="3.5" ry="5" fill="#8570a6" />
                        <ellipse cx="18" cy="26" rx="3.5" ry="5" fill="#9079b2" />
                        <ellipse cx="20" cy="33" rx="3" ry="4.5" fill="#8570a6" />
                      </svg>
                    </div>

                    <div className={styles.sealedCaption}>
                      <span className={styles.sealedCaptionLabel}>Sealed</span>
                      <span className={styles.sealedCaptionDate}>{locationHeader}</span>
                    </div>

                    {/* Central Wax Seal */}
                    <div className={styles.centerWaxSeal} onClick={handleUnsealClick} title="Unseal Letter">
                      <div className={styles.centerWaxSealRing}>
                        <svg viewBox="0 0 512 512" fill="currentColor" className={styles.centerWaxSealIcon}>
                          <path d="M281.31 21.217L239.997 127.13l76.01 103.673 97.135-7.532-3.1-79.284-78.2-12.468-1.61 41.535 29.11 7.568-.766-14.1 18.662-1.012 2.15 39.635-68.41-17.788 3.004-77.61 68.65 10.946-2.456-86.044-98.863-13.43zM243.63 66.39l-73.702 39.917L195.885 243.7l141.306 80.704 154.447-80.037-11.252-142.205-79.617-.988.642 22.512 26.705 4.257 4.403 112.57-125.436 9.727-88.227-120.338 24.774-63.51zm-93.107 88.706c-2.992-.017-6.01.004-9.054.06-9.456.174-19.425.853-29.44 1.594 9.427 13.32 18.694 26.165 30.157 35.938 7.894 6.73 16.835 12.308 28.075 16.056l-10.1-53.453c-3.184-.11-6.396-.176-9.64-.194zm25.57 84.51c-14.278 5.27-27.16 13.25-39.437 23.55-17.875 14.995-34.273 35.22-50.625 58.47 56.9 2.6 100.16-6.41 147.316-35.01l-54.223-30.966-3.03-16.045zm270.854 48.968l-50.64 26.244c27.874 20.83 54.865 27.206 90.162 28.557-8.76-21.213-22.617-39.484-39.523-54.8zm-189.853 4.895c-14.566 9.75-28.84 17.8-43.156 24.342.37 10.843 2.813 19.703 6.968 26.47-29.49 37.69-61.714 72.017-96.78 102.843-17.584-1.215-24.577-19.137-17.845-37.344-22.758 18.074-30.427 42.166-20 68.376-6.832 5.23-13.75 10.354-20.78 15.344h45.344c25.65-20.11 49.915-41.82 72.844-65.094 29.485 9.192 54.05-1.51 69.625-27.97-14.975 8.052-31.217 5.627-37.438-6.686 9.653-11.06 19.037-22.436 28.156-34.125 7.25 1.21 15.586.57 24.72-2.03-8.863-17.974-13.326-39.19-11.656-64.126zm18.133 17.065c1.205 25.213 10.463 44.01 24.648 60.12 17.914 20.346 44.73 35.942 73.625 50.814 7.79-33.575 9.555-62.664-2.05-93.77l-34.692 17.978-61.53-35.143z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Simplified Unified Bottom Toolbar */}
      <div className={styles.bottomToolbar}>
        {/* Add Image Tool */}
        <button className={styles.unifiedTool} onClick={triggerPhotoUpload} title="Add Custom Polaroid Image">
          <ImageIcon className={styles.unifiedToolIcon} />
          <span>Add Image</span>
        </button>

        {/* Add Postcard Tool */}
        <button className={styles.unifiedTool} onClick={handleAddPostcard} title="Add Vintage Postcard">
          <Mail className={styles.unifiedToolIcon} />
          <span>Add Postcard</span>
        </button>

        <div className={styles.divider} />

        {/* Write Letter Focus Tool */}
        <button className={styles.unifiedTool} onClick={handleWriteLetterClick} title="Focus Letter Writing">
          <Edit3 className={styles.unifiedToolIcon} />
          <span>Write Letter</span>
        </button>

        {/* Reset Tool */}
        <button className={styles.unifiedTool} onClick={handleResetClick} title="Reset Desk Positions & Edits">
          <RotateCcw className={styles.unifiedToolIcon} />
          <span>Reset Desk</span>
        </button>

        <div className={styles.divider} />

        {/* Seal Button */}
        <button
          className={`${styles.sealButton} ${isSealed ? styles.sealed : ''}`}
          onClick={isSealed ? handleUnsealClick : handleSealClick}
        >
          <div className={styles.sealEmblem}>
            {isSealed ? (
              <Check className={styles.sealEmblemIcon} />
            ) : (
              <svg viewBox="0 0 512 512" fill="currentColor" className={styles.sealEmblemIcon}>
                <path d="M281.31 21.217L239.997 127.13l76.01 103.673 97.135-7.532-3.1-79.284-78.2-12.468-1.61 41.535 29.11 7.568-.766-14.1 18.662-1.012 2.15 39.635-68.41-17.788 3.004-77.61 68.65 10.946-2.456-86.044-98.863-13.43zM243.63 66.39l-73.702 39.917L195.885 243.7l141.306 80.704 154.447-80.037-11.252-142.205-79.617-.988.642 22.512 26.705 4.257 4.403 112.57-125.436 9.727-88.227-120.338 24.774-63.51zm-93.107 88.706c-2.992-.017-6.01.004-9.054.06-9.456.174-19.425.853-29.44 1.594 9.427 13.32 18.694 26.165 30.157 35.938 7.894 6.73 16.835 12.308 28.075 16.056l-10.1-53.453c-3.184-.11-6.396-.176-9.64-.194zm25.57 84.51c-14.278 5.27-27.16 13.25-39.437 23.55-17.875 14.995-34.273 35.22-50.625 58.47 56.9 2.6 100.16-6.41 147.316-35.01l-54.223-30.966-3.03-16.045zm270.854 48.968l-50.64 26.244c27.874 20.83 54.865 27.206 90.162 28.557-8.76-21.213-22.617-39.484-39.523-54.8zm-189.853 4.895c-14.566 9.75-28.84 17.8-43.156 24.342.37 10.843 2.813 19.703 6.968 26.47-29.49 37.69-61.714 72.017-96.78 102.843-17.584-1.215-24.577-19.137-17.845-37.344-22.758 18.074-30.427 42.166-20 68.376-6.832 5.23-13.75 10.354-20.78 15.344h45.344c25.65-20.11 49.915-41.82 72.844-65.094 29.485 9.192 54.05-1.51 69.625-27.97-14.975 8.052-31.217 5.627-37.438-6.686 9.653-11.06 19.037-22.436 28.156-34.125 7.25 1.21 15.586.57 24.72-2.03-8.863-17.974-13.326-39.19-11.656-64.126zm18.133 17.065c1.205 25.213 10.463 44.01 24.648 60.12 17.914 20.346 44.73 35.942 73.625 50.814 7.79-33.575 9.555-62.664-2.05-93.77l-34.692 17.978-61.53-35.143z" />
              </svg>
            )}
          </div>
          <span className={styles.sealButtonLabel}>
            {isSealed ? 'Letter Sealed' : 'Seal Letter'}
          </span>
        </button>
      </div>
    </div>
  );
}
