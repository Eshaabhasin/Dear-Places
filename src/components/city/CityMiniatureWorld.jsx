'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Camera, Mail, MapPin, Music, Compass, Ticket,
  ArrowRight, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import styles from './CityMiniatureWorld.module.css';

// Map icon strings from data to Lucide components
const iconMap = {
  camera: Camera,
  mail: Mail,
  ticket: Ticket,
  music: Music,
  compass: Compass,
};

// Generate floating particle positions deterministically
function generateParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 53 + 27) % 100 + 50}%`,
      size: 2 + (i % 3),
      duration: 8 + (i % 7) * 2,
      delay: (i * 1.3) % 10,
      opacity: 0.3 + (i % 4) * 0.15,
    });
  }
  return particles;
}

export default function CityMiniatureWorld({ destination }) {
  const [activeLandmark, setActiveLandmark] = useState(null);

  const particles = useMemo(() => generateParticles(18), []);

  useEffect(() => {
    if (destination?.slug) {
      localStorage.setItem('lastSelectedCity', destination.slug);
    }
  }, [destination]);

  if (!destination) return null;

  const handleLandmarkClick = (name) => {
    setActiveLandmark(activeLandmark === name ? null : name);
  };

  return (
    <div className={styles.viewport}>
      {/* Cinematic Background */}
      <div
        className={styles.backgroundLayer}
        style={{ backgroundImage: `url(${destination.background})` }}
      />
      <div className={styles.sceneVignette} />

      {/* Floating Particles */}
      <div className={styles.particlesLayer}>
        {particles.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Title Row */}
      <div className={styles.titleRow}>
        <h1 className={styles.destinationTitle}>{destination.name}</h1>
        <div className={styles.countryTagRow}>
          <MapPin size={14} className={styles.countryIcon} />
          <span className={styles.countryTag}>{destination.country}</span>
        </div>
        <span className={styles.travelDates}>{destination.dates}</span>
      </div>

      {/* Back to Atlas Button */}
      <Link href="/globe" className={styles.backButton}>
        <ArrowLeft size={16} className={styles.backIcon} />
        <span>Back to Globe</span>
      </Link>

      {/* Landmark Markers Layer */}
      {destination.landmarks && destination.landmarks.length > 0 && (
        <div className={styles.markersLayer}>
          {destination.landmarks.map((landmark) => {
            const IconComponent = iconMap[landmark.icon] || Camera;
            const isActive = activeLandmark === landmark.name;

            return (
              <div
                key={landmark.name}
                className={`${styles.landmarkMarker} ${isActive ? styles.active : ''}`}
                style={{
                  top: landmark.position.top,
                  left: landmark.position.left,
                }}
                onClick={() => handleLandmarkClick(landmark.name)}
              >
                <div className={styles.markerOrb}>
                  <IconComponent size={18} strokeWidth={2} className={styles.orbIcon} />
                </div>
                <div className={styles.markerLabelCard}>
                  <span className={styles.landmarkName}>{landmark.name}</span>
                  <span className={styles.landmarkCount}>
                    {landmark.memories} {landmark.memories === 1 ? 'Memory' : 'Memories'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Memory Stats Card */}
      <div className={styles.memoryCard}>
        <span className={styles.memoryCardTitle}>
          {activeLandmark ? activeLandmark : destination.name}
        </span>
        <div className={styles.memoryStatsList}>
          <div className={styles.memoryStat}>
            <Camera size={16} strokeWidth={2} className={styles.memoryStatIcon} />
            <span className={styles.memoryStatValue}>
              {activeLandmark
                ? (activeLandmark === 'India Gate' ? 3 : activeLandmark === 'Red Fort' ? 2 : 1)
                : destination.photos}
            </span>
            <span className={styles.memoryStatLabel}>Photos</span>
          </div>
          <div className={styles.memoryStat}>
            <Mail size={16} strokeWidth={2} className={styles.memoryStatIcon} />
            <span className={styles.memoryStatValue}>
              {activeLandmark
                ? (activeLandmark === 'India Gate' ? 2 : activeLandmark === 'Red Fort' ? 1 : 1)
                : destination.letters}
            </span>
            <span className={styles.memoryStatLabel}>Letters</span>
          </div>
          <div className={styles.memoryStat}>
            <MapPin size={16} strokeWidth={2} className={styles.memoryStatIcon} />
            <span className={styles.memoryStatValue}>
              {activeLandmark
                ? (activeLandmark === 'India Gate' ? 1 : 0)
                : destination.postcards}
            </span>
            <span className={styles.memoryStatLabel}>
              {(!activeLandmark && destination.postcards === 1) || (activeLandmark && (activeLandmark === 'India Gate' ? 1 : 0) === 1) ? 'Postcard' : 'Postcards'}
            </span>
          </div>
        </div>
        <Link
          href={`/letter/write?city=${destination.slug}&landmark=${activeLandmark
              ? activeLandmark.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')
              : (destination.landmarks && destination.landmarks.length > 0
                ? destination.landmarks[0].name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')
                : `${destination.slug}-general`)
            }`}
          className={styles.exploreMemoryButton}
        >
          <span>Explore Memory</span>
          <ArrowRight size={16} className={styles.exploreMemoryIcon} />
        </Link>
      </div>
    </div>
  );
}
