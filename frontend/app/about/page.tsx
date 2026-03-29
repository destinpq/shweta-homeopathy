import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo';

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
  'Every patient is a unique individual — the prescription must match the person, not the disease label.',
  'Homeopathy aims to remove the root cause of suffering, not suppress symptoms.',
  'The therapeutic relationship built over time is as healing as the remedy itself.',
  'Classical prescribing — one well-chosen constitutional remedy — is the foundation of deep healing.',
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, hsl(152,42%,14%), hsl(152,30%,28%))',
        padding: 'var(--space-20) 0',
      }}>
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>About the Doctor</span>
          <h1 style={{ color: 'var(--clr-white)', marginBottom: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            Dr. Shweta Goyal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', maxWidth: '600px' }}>
            BHMS (Gold Medalist) · MD (Homoeopathy) · PG IACH Greece · DNHE Delhi<br />
            Classical Homeopath. 15+ Years of Practice.
          </p>
        </div>
      </section>

      {/* Bio */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'var(--space-16)', alignItems: 'start' }}>
            {/* Photo placeholder */}
            <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 2rem)' }}>
              <div style={{
                aspectRatio: '3/4',
                background: 'linear-gradient(160deg, var(--clr-sage-pale), var(--clr-sage-lt))',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
                gap: 'var(--space-4)',
                border: '1px solid var(--clr-border)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <Image src="/Clinic Pictures/IMG-20240615-WA0085.jpg" alt="Dr. Shweta Goyal" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="card" style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-mid)', marginBottom: 'var(--space-4)' }}>
                  Ready to start your healing journey?
                </p>
                <Link href="/appointment" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Book a Consultation
                </Link>
              </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <div>
                <span className="section-label">Background</span>
                <h2 style={{ marginBottom: 'var(--space-4)', marginTop: 'var(--space-3)' }}>A Luminary in Classical Homeopathy</h2>
                <div className="divider" />
                <p>
                  Dr. Shweta Goyal is a distinguished homeopathic physician with a rare combination of academic excellence
                  and deep clinical experience. Born from a calling to heal rather than merely treat, she has dedicated
                  her practice to the principles of classical homeopathy — individualized, constitutional prescribing
                  that treats the whole person.
                </p>
                <p style={{ marginTop: 'var(--space-4)' }}>
                  She graduated as a <strong>Gold Medalist in BHMS from Panjab University</strong>, a distinction that reflects
                  both her intellectual rigour and her passion for the science of homeopathy. She pursued her MD in Homeopathy
                  and then undertook a prestigious post-graduate programme at the
                  <strong> International Academy of Classical Homeopathy (IACH) in Greece</strong> — one of the foremost
                  institutions for classical homeopathy in the world, founded by Dr. George Vithoulkas.
                </p>
                <p style={{ marginTop: 'var(--space-4)' }}>
                  Today, with over 15 years of clinical practice and more than 10,000 patients treated, Dr. Shweta runs
                  clinics in Zirakpur and Budhlada, Punjab, and conducts online consultations for patients across India
                  and internationally.
                </p>
              </div>

              {/* Philosophy */}
              <div>
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Treatment Philosophy</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {philosophy.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-4)',
                      background: 'var(--clr-sage-pale)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--clr-sage)',
                    }}>
                      <span style={{ fontSize: 'var(--text-xl)', flexShrink: 0 }}>🍃</span>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--clr-text)' }}>{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 style={{ marginBottom: 'var(--space-6)' }}>Journey & Credentials</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative', paddingLeft: 'var(--space-10)' }}>
                  <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'var(--clr-sage-lt)' }} />
                  {timeline.map((t) => (
                    <div key={t.year} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: 'calc(-1 * var(--space-10) - 1px + 20px)',
                        top: '4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--clr-sage)',
                        border: '2px solid var(--clr-white)',
                        boxShadow: '0 0 0 2px var(--clr-sage-lt)',
                      }} />
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--clr-gold)', letterSpacing: '0.06em', display: 'block', marginBottom: 'var(--space-1)' }}>{t.year}</span>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--clr-text)', fontWeight: 500 }}>{t.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--clr-sage-pale)', padding: 'var(--space-16) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Begin Your Healing?</h2>
          <p style={{ color: 'var(--clr-text-mid)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', maxWidth: '500px', marginInline: 'auto' }}>
            Schedule a consultation with Dr. Shweta — in clinic or online.
          </p>
          <Link href="/appointment" className="btn btn-primary btn-lg">Request Appointment</Link>
        </div>
      </section>
    </>
  );
}
