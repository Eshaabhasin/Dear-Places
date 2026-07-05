'use client';

import { ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import styles from './HeroSection.module.css';
import { images } from '@/data/images';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Cinematic Background */}
      <div className={styles.backgroundLayer}>
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${images.backgrounds.landingGlobeDesk})` }}
        />
        <div className={styles.radialVignette} />
        <div className={styles.bottomFade} />
        <div className={styles.leftLegibility} />
      </div>

      {/* Top Brand Row */}
      <header className={styles.topBar}>
        <div className={styles.brandLockup}>
          <div className={styles.compassMark}>
            <Compass size={24} color="rgb(242, 211, 141)" strokeWidth={1.8} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>DEAR PLACES</span>
            <span className={styles.brandSubline}>A Living Archive of Journeys</span>
          </div>
        </div>

        <div className={styles.welcomePill}>
          <div className={styles.welcomeAvatar}>
            <svg stroke="rgb(231, 195, 125)" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className={styles.welcomeTextBlock}>
            <span className={styles.welcomeGreeting}>Welcome back,</span>
            <span className={styles.welcomeName}>Eshaa</span>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        {/* Eyebrow */}
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrowLine} />
          <span className={styles.eyebrowText}>Where Memories Find Their Place</span>
        </div>

        {/* Title */}
        <h1 className={styles.heroTitle}>Dear Places</h1>

        {/* Tagline */}
        <p className={styles.heroTagline}>
          Every destination remembers you, leave a<br />
          memory before you leave
        </p>

        {/* CTA Button */}
        <Link href="/globe" className={styles.ctaButton}>
          <span>Open My Globe</span>
          <ArrowRight size={20} />
        </Link>
      </div>

      {/* Globe Hint */}
      <div className={styles.globeHint}>
        <span className={styles.pulseDot} />
        <span className={styles.hintText}>The globe remembers everywhere you&apos;ve been.</span>
      </div>
    </section>
  );
}
