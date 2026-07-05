'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Home, Globe, MapPin, Camera, Bookmark } from 'lucide-react';
import styles from './GlassNavRail.module.css';

const navItems = [
  { icon: Home, href: '/', id: 'home', label: 'Home' },
  { icon: Globe, href: '/globe', id: 'globe', label: 'Globe' },
  { icon: MapPin, href: '/city/new-delhi', id: 'atlas', label: 'Places' },
  { icon: Camera, href: '/letter/write', id: 'photos', label: 'Memories' },
  { icon: Bookmark, href: '/archive', id: 'letters', label: 'Archive' },
];

export default function GlassNavRail({ activeId }) {
  const pathname = usePathname();
  const [placesHref, setPlacesHref] = useState(null);

  useEffect(() => {
    const lastCity = localStorage.getItem('lastSelectedCity');
    if (lastCity) {
      setPlacesHref(`/city/${lastCity}`);
    }
  }, []);

  const getActiveId = () => {
    if (activeId) return activeId;
    if (pathname === '/') return 'home';
    if (pathname === '/globe') return 'globe';
    if (pathname.startsWith('/city')) return 'atlas';
    if (pathname.startsWith('/letter')) return 'photos';
    if (pathname === '/archive') return 'letters';
    return 'home';
  };

  const currentActive = getActiveId();

  const filteredItems = navItems
    .map(item => {
      if (item.id === 'atlas') {
        return { ...item, href: placesHref || '#' };
      }
      return item;
    })
    .filter(item => {
      // Hide the Places navigation item if no city has been selected yet from the globe
      if (item.id === 'atlas' && !placesHref) {
        return false;
      }
      return true;
    });

  return (
    <nav className={styles.rail}>
      {filteredItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.id === currentActive;
        return (
          <Link
            key={item.id + index}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            style={{ animationDelay: `${0.3 + index * 0.08}s` }}
          >
            <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
            {item.id === 'letters' && !isActive && (
              <span className={styles.notificationDot} />
            )}
            <span className={styles.tooltip}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
