'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Mail, Image as ImageIcon, Map, Flag } from 'lucide-react';
import styles from './JourneyStats.module.css';

const stats = [
  { icon: Send, value: 23, label: 'Trips', color: 'var(--accent-purple)' },
  { icon: Mail, value: 87, label: 'Letters', color: 'var(--accent-purple)' },
  { icon: ImageIcon, value: 156, label: 'Photos', color: 'var(--accent-purple)' },
  { icon: Map, value: 42, label: 'Postcards', color: 'var(--accent-purple)' },
  { icon: Flag, value: 11, label: 'Countries', color: 'var(--accent-purple)' },
];

function AnimatedCounter({ target, duration = 2000, delay = 0 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, target, duration, delay]);

  return <span ref={ref}>{count}</span>;
}

export default function JourneyStats() {
  return (
    <div className={styles.container}>
      <div className={styles.statsCard}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={styles.statRow}
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className={styles.iconWrapper}>
                <Icon size={18} color={stat.color} strokeWidth={1.8} />
              </div>
              <div className={styles.statMeta}>
                <span className={styles.statValue}>
                  <AnimatedCounter target={stat.value} delay={800 + index * 150} />
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
