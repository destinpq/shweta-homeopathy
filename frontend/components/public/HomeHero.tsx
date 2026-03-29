'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './HomeHero.module.css';

interface Stat { number: string; label: string; }
interface Props { stats: Stat[]; }

export default function HomeHero({ stats }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <section className={styles.hero} ref={ref}>
      <div className={styles.bgPattern} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>

        {/* ── Text side ── */}
        <motion.div
          className={styles.textSide}
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            <span>🌿</span> Established Practice · Classical Homeopathy
          </motion.div>

          <h1 className={styles.title}>
            Healing at the Root.<br />
            <em className={styles.titleEm}>Naturally.</em>
          </h1>

          <p className={styles.subtitle}>
            Dr. Shweta Goyal — BHMS Gold Medalist · MD (Hom) · PG IACH Greece<br />
            Expert homeopathic care for chronic &amp; complex conditions.
          </p>

          <motion.div
            className={styles.ctas}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
          >
            <Link href="/appointment" className="btn btn-gold btn-lg" id="hero-book-btn">
              Request Appointment
            </Link>
            <Link href="/about" className={`btn btn-lg ${styles.outlineBtn}`}>
              Meet Dr. Shweta
            </Link>
          </motion.div>

          <motion.div
            className={styles.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.stat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <span className={styles.statNum}>{s.number}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Photo side ── */}
        <motion.div
          className={styles.photoSide}
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: photoY } as React.CSSProperties}
        >
          {/*
            REPLACE THE IMG BELOW WITH A CANDID WARM-LIT PHOTO OF DR. SHWETA (no white coat)
            Ideal dimensions: 420×560px portrait, warm natural lighting
            Replace: src="/Clinic Pictures/IMG-20240615-WA0219.jpg"
          */}
          <div className={styles.photoFrame}>
            <div className={styles.photoInner}>
              <Image
                src="/Clinic Pictures/IMG-20240615-WA0219.jpg"
                alt="Dr. Shweta Goyal — Classical Homeopath"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Floating badge — Gold Medal */}
          <motion.div
            className={styles.floatBadge}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className={styles.floatIcon}>🏅</span>
            <div>
              <span className={styles.floatLine1}>Gold Medalist</span>
              <span className={styles.floatLine2}>Panjab University</span>
            </div>
          </motion.div>

          {/* Floating badge 2 — IACH */}
          <motion.div
            className={`${styles.floatBadge} ${styles.floatBadge2}`}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <span className={styles.floatIcon}>🌍</span>
            <div>
              <span className={styles.floatLine1}>PG · IACH Greece</span>
              <span className={styles.floatLine2}>Classical Homeopathy</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span>Scroll to explore</span>
        <div className={styles.scrollArrow} />
      </div>
    </section>
  );
}
