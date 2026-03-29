'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Award, Microscope, Globe } from 'lucide-react';
import styles from './BentoCredentials.module.css';

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const duration = 1800;
    const fps = 60;
    const increment = to / (duration / (1000 / fps));
    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const cellVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function BentoCredentials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-60px' });

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className="section-label">About the Doctor</span>
          <h2>A Luminary in Classical Homeopathy</h2>
          <div className="divider" style={{ marginInline: 'auto' }} />
          <p>
            Combining academic excellence, international training, and 15+ years of clinical practice
            to deliver deep, lasting healing through classical homeopathy.
          </p>
        </div>

        <motion.div
          ref={containerRef}
          className={styles.bento}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Cell 1: Doctor photo (2 cols × 2 rows) */}
          <motion.div
            className={`${styles.cell} ${styles.cellPhoto}`}
            variants={cellVariants}
            custom={0}
          >
            {/*
              REPLACE WITH CANDID WARM-LIT DOCTOR PHOTO (no white coat)
              Ideal: 420×560px portrait, warm natural lighting
            */}
            <div className={styles.photoWrap}>
              <Image
                src="/Clinic Pictures/IMG-20240615-WA0219.jpg"
                alt="Dr. Shweta Goyal"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className={styles.photoOverlay}>
                <span className={styles.photoName}>Dr. Shweta Goyal</span>
                <span className={styles.photoCreds}>BHMS · MD (Hom) · PG IACH Greece</span>
              </div>
            </div>
          </motion.div>

          {/* Cell 2: Gold Medalist */}
          <motion.div
            className={`${styles.cell} ${styles.cellGold}`}
            variants={cellVariants}
            custom={1}
          >
            <span className={styles.credIcon}><Award size={32} /></span>
            <h4 className={styles.credTitle}>Gold Medalist</h4>
            <p className={styles.credSub}>BHMS — Panjab University</p>
          </motion.div>

          {/* Cell 3: MD */}
          <motion.div
            className={`${styles.cell} ${styles.cellMd}`}
            variants={cellVariants}
            custom={2}
          >
            <span className={styles.credIcon}><Microscope size={32} /></span>
            <h4 className={styles.credTitle}>MD (Hom)</h4>
            <p className={styles.credSub}>Advanced Specialization in Homoeopathy</p>
          </motion.div>

          {/* Cell 4: 15+ Years counter */}
          <motion.div
            className={`${styles.cell} ${styles.cellCounter} ${styles.cellSage}`}
            variants={cellVariants}
            custom={3}
          >
            <span className={styles.counterNum}>
              <AnimatedCounter to={15} suffix="+" />
            </span>
            <span className={styles.counterLabel}>Years of Experience</span>
          </motion.div>

          {/* Cell 5: 10,000+ patients counter */}
          <motion.div
            className={`${styles.cell} ${styles.cellCounter} ${styles.cellForest}`}
            variants={cellVariants}
            custom={4}
          >
            <span className={styles.counterNum}>
              <AnimatedCounter to={10000} suffix="+" />
            </span>
            <span className={styles.counterLabel}>Patients Treated</span>
          </motion.div>

          {/* Cell 6: Philosophy quote (spans 2 cols) */}
          <motion.div
            className={`${styles.cell} ${styles.cellQuote}`}
            variants={cellVariants}
            custom={5}
          >
            <span className={styles.quoteIcon}>&ldquo;</span>
            <p className={styles.quoteText}>
              True healing means removing the root cause of disease — not merely managing symptoms.
              Every patient deserves an individualized prescription.
            </p>
            <span className={styles.quoteAuthor}>— Dr. Shweta Goyal</span>
          </motion.div>

          {/* Cell 7: IACH Greece */}
          <motion.div
            className={`${styles.cell} ${styles.cellIach}`}
            variants={cellVariants}
            custom={6}
          >
            <span className={styles.credIcon}><Globe size={32} /></span>
            <h4 className={styles.credTitle}>PG · IACH Greece</h4>
            <p className={styles.credSub}>World&apos;s premier institute for classical homeopathy</p>
          </motion.div>

          {/* Cell 8: CTA */}
          <motion.div
            className={`${styles.cell} ${styles.cellCta}`}
            variants={cellVariants}
            custom={7}
          >
            <p className={styles.ctaHeading}>Ready to heal naturally?</p>
            <p className={styles.ctaDesc}>Free 10-min introductory call available.</p>
            <Link href="/appointment" className="btn btn-gold">
              Book Consultation
            </Link>
          </motion.div>
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <Link href="/about" className="btn btn-outline">Read Full Profile →</Link>
        </div>
      </div>
    </section>
  );
}
