import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo';
import BentoCredentials from '@/components/public/BentoCredentials';
import styles from './about.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'About Dr. Shweta Goyal',
  description:
    'Learn about Dr. Shweta Goyal — BHMS Gold Medalist, MD (Hom), PG IACH Greece — a luminary in classical homeopathy with over 15 years of experience treating chronic and complex conditions.',
  path: '/about',
});

export const revalidate = 3600;

const timeline = [
  { year: '2006', event: 'BHMS — Gold Medalist, Panjab University' },
  { year: '2010', event: 'MD in Homeopathy — Advanced specialization' },
  { year: '2012', event: 'PG — International Academy of Classical Homeopathy (IACH), Greece' },
  { year: '2013', event: 'DNHE — Delhi. Opened practice in Zirakpur, Punjab' },
  { year: '2018', event: 'Expanded to second clinic — Budhlada' },
  { year: '2020', event: 'Launched online consultations — patients across India & abroad' },
  { year: '2024', event: '10,000+ patients treated. Continued focus on classical prescribing.' },
];

const philosophy = [
  { icon: '🧬', text: 'Every patient is a unique individual — the prescription must match the person, not the disease label.' },
  { icon: '🌱', text: 'Homeopathy aims to remove the root cause of suffering, not suppress symptoms.' },
  { icon: '🤝', text: 'The therapeutic relationship built over time is as healing as the remedy itself.' },
  { icon: '📚', text: 'Classical prescribing — one well-chosen constitutional remedy — is the foundation of deep healing.' },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Split-screen Hero ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>🌿 About the Doctor</div>
            <h1 className={styles.heroTitle}>Dr. Shweta Goyal</h1>
            <p className={styles.heroSub}>
              Classical Homeopath with 15+ years of practice across Zirakpur, Budhlada, and online — treating patients worldwide.
            </p>
            <div className={styles.heroCreds}>
              {['BHMS Gold Medalist', 'MD (Hom)', 'PG · IACH Greece', 'DNHE Delhi'].map((c) => (
                <span key={c} className={styles.credPill}>{c}</span>
              ))}
            </div>
          </div>
          <div className={styles.heroPhoto}>
            {/* REPLACE with candid warm-lit photo when client provides */}
            <div className={styles.heroPhotoFrame}>
              <Image
                src="/Clinic Pictures/IMG-20240615-WA0085.jpg"
                alt="Dr. Shweta Goyal"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Bento Credentials ── */}
      <BentoCredentials />

      {/* ── Bio & Timeline ── */}
      <section className={styles.bioSection}>
        <div className="container">
          <div className={styles.bioGrid}>
            {/* Sticky photo + sidebar CTA */}
            <div className={styles.stickyCol}>
              <div className={styles.photoWrap}>
                <Image
                  src="/Clinic Pictures/IMG-20240615-WA0219.jpg"
                  alt="Dr. Shweta Goyal at clinic"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  sizes="(max-width: 640px) 100vw, 320px"
                />
              </div>
              <div className={`glass-card ${styles.ctaSidebar}`}>
                <p className={styles.ctaSidebarText}>Ready to start your healing journey?</p>
                <Link href="/appointment" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                  Book a Consultation
                </Link>
              </div>
            </div>

            {/* Content column */}
            <div className={styles.contentCol}>
              {/* Bio text */}
              <div>
                <span className="section-label">Background</span>
                <h2 style={{ marginBottom: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
                  A Luminary in Classical Homeopathy
                </h2>
                <div className="divider" />
                <p>
                  Dr. Shweta Goyal is a distinguished homeopathic physician with a rare combination of academic excellence
                  and deep clinical experience. She graduated as a <strong>Gold Medalist in BHMS from Panjab University</strong>,
                  followed by an MD in Homeopathy and a prestigious post-graduate qualification from the
                  <strong> International Academy of Classical Homeopathy (IACH), Greece</strong> — one of the world&apos;s
                  foremost institutions for classical homeopathic training, founded by Dr. George Vithoulkas.
                </p>
                <p style={{ marginTop: 'var(--space-4)' }}>
                  Today, with over 15 years of clinical practice and more than 10,000 patients treated, Dr. Shweta runs
                  clinics in Zirakpur and Budhlada, Punjab, and conducts online consultations for patients across India and internationally.
                </p>
              </div>

              {/* Philosophy */}
              <div>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Treatment Philosophy</h3>
                <div className={styles.philosophyGrid}>
                  {philosophy.map((p, i) => (
                    <div key={i} className={styles.philosophyCard}>
                      <span className={styles.philosophyIcon}>{p.icon}</span>
                      <p className={styles.philosophyText}>{p.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 style={{ marginBottom: 'var(--space-6)' }}>Journey & Credentials</h3>
                <div className={styles.timelineWrap}>
                  <div className={styles.timelineLine} />
                  <div className={styles.timelineItems}>
                    {timeline.map((t) => (
                      <div key={t.year} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <span className={styles.timelineYear}>{t.year}</span>
                        <p className={styles.timelineEvent}>{t.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaStrip}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2>Ready to Begin Your Healing?</h2>
            <p>Schedule a consultation with Dr. Shweta — in clinic or online.</p>
            <Link href="/appointment" className="btn btn-gold btn-lg">Request Appointment</Link>
          </div>
        </div>
      </section>
    </>
  );
}

