import type { Metadata } from 'next';
import Link from 'next/link';
import { conditions } from '@/lib/conditions';
import { testimonials, faqs } from '@/lib/content';
import { buildDoctorSchema, buildFAQSchema } from '@/lib/seo';
import { getLatestBlogs } from '@/lib/blog';
import BlogCard from '@/components/public/BlogCard';
import HomeHero from '@/components/public/HomeHero';
import BentoCredentials from '@/components/public/BentoCredentials';
import VideoSection from '@/components/public/VideoSection';
import GoogleReviewWidget from '@/components/public/GoogleReviewWidget';
import FaqAccordion from '@/components/public/FaqAccordion';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "Dr. Shweta's Homoeopathy — Best Homeopath Zirakpur & Budhlada",
  description:
    "Expert classical homeopathic treatment by Dr. Shweta Goyal — BHMS Gold Medalist, MD Hom, PG IACH Greece. Treating chronic illness, women's health, skin diseases, joint problems & more in Zirakpur, Punjab.",
};

const stats = [
  { number: '15+', label: 'Years Experience' },
  { number: '10,000+', label: 'Patients Treated' },
  { number: '12+', label: 'Specialities' },
  { number: '98%', label: 'Patient Satisfaction' },
];

const whyChoose = [
  { icon: '🛡️', title: 'Zero Side Effects', desc: 'Natural remedies that are safe for all ages — children, pregnant women, and the elderly.' },
  { icon: '🎯', title: 'Root Cause Treatment', desc: 'We treat the whole person, not just the symptom. Long-lasting results, not short-term suppression.' },
  { icon: '🔬', title: 'Classical Approach', desc: 'Trained at the International Academy of Classical Homeopathy, Greece — the gold standard globally.' },
  { icon: '🌍', title: 'Online Consultations', desc: 'Worldwide consultations with doorstep delivery of medicines across India and internationally.' },
  { icon: '📋', title: 'Thorough Case-Taking', desc: 'Deep, personalized case analysis — every patient is unique and treated as such.' },
  { icon: '💚', title: 'Permanent Cure', desc: 'Focused on eradicating disease at its roots, not managing symptoms indefinitely.' },
];

const process = [
  { step: '01', title: 'Book Appointment', desc: 'Fill out our appointment form online or call us directly.' },
  { step: '02', title: 'Detailed Consultation', desc: 'Dr. Shweta conducts a thorough case-taking covering physical, mental, and emotional aspects.' },
  { step: '03', title: 'Individualized Prescription', desc: 'A carefully selected constitutional remedy is prescribed, unique to you.' },
  { step: '04', title: 'Healing & Follow-up', desc: 'Regular follow-ups track your progress and refine treatment for optimal outcomes.' },
];

export default async function HomePage() {
  const doctorSchema = buildDoctorSchema();
  const faqSchema = buildFAQSchema(faqs.slice(0, 6));
  const latestPosts = await getLatestBlogs(3).catch(() => []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Split-screen Hero ── */}
      <HomeHero stats={stats} />

      {/* ── Trust Strip ── */}
      <section className={styles.trustStrip}>
        <div className="container">
          <div className={styles.trustItems}>
            {[
              { icon: '🏅', text: 'Gold Medalist — Panjab University' },
              { icon: '🔬', text: 'MD in Homeopathy' },
              { icon: '🌍', text: 'PG · IACH, Greece' },
              { icon: '🏥', text: 'Clinics in Zirakpur & Budhlada' },
              { icon: '💻', text: 'Online Consultations Worldwide' },
            ].map((item) => (
              <div key={item.text} className={styles.trustItem}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento Credentials Grid ── */}
      <BentoCredentials />

      {/* ── Meet the Doctor Video ── */}
      {/* REPLACE: pass videoUrl="https://www.youtube.com/embed/YOUR_VIDEO_ID" when client provides the video link */}
      <VideoSection />

      {/* ── Conditions Grid ── */}
      <section className={`section bg-sage-pale ${styles.conditionsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Conditions Treated</span>
            <h2>Homeopathy Helps With</h2>
            <p>Specialized treatment for a wide range of chronic and complex conditions using classical homeopathy.</p>
          </div>
          <div className={styles.conditionsGrid}>
            {conditions.map((c) => (
              <Link key={c.slug} href={`/conditions/${c.slug}`} className={`${styles.conditionCard} glass-card`}>
                <span className={styles.condIcon}>{c.icon}</span>
                <h3 className={styles.condName}>{c.name}</h3>
                <p className={styles.condDesc}>{c.shortDesc}</p>
                <span className={styles.condArrow}>Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose ── */}
      <section className={`section ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Why Choose Homeopathy</span>
            <h2>Healing That Goes to the Root</h2>
            <p>Homeopathy is not just alternative medicine — it is a complete system of medicine that transforms health permanently.</p>
          </div>
          <div className={`grid-3 ${styles.whyGrid}`}>
            {whyChoose.map((w) => (
              <div key={w.title} className={`glass-card ${styles.whyCard}`}>
                <div className={styles.whyIcon}>{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Appointment Flow ── */}
      <section className={`section ${styles.processSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">How It Works</span>
            <h2>Your Healing Journey in 4 Steps</h2>
            <p>A simple, patient-centered process designed around your healing — not a one-size-fits-all solution.</p>
          </div>
          <div className={styles.processGrid}>
            {process.map((p, i) => (
              <div key={p.step} className={`glass-card ${styles.processItem}`}>
                <div className={styles.processStep}>{p.step}</div>
                {i < process.length - 1 && <div className={styles.processLine} />}
                <h4 className={styles.processTitle}>{p.title}</h4>
                <p className={styles.processDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Link href="/appointment" className="btn btn-gold btn-lg">
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={`section bg-sage-pale ${styles.testimonialsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Patient Stories</span>
            <h2>What Our Patients Say</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className={`glass-card ${styles.testimonialCard}`}>
                <div className={styles.quoteIconLg}>&ldquo;</div>
                <div className={styles.stars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>{t.name[0]}</div>
                  <div>
                    <p className={styles.authorName}>{t.name}</p>
                    <p className={styles.authorCondition}>{t.condition}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Google Review Widget */}
          {/* REPLACE: add placeId="ChIJxxxxxxxxxxxxxxxx" and reviewsUrl once client confirms Google Business listing */}
          <div className={styles.reviewWidgetWrap}>
            <GoogleReviewWidget reviewCount={200} rating={4.9} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <Link href="/testimonials" className="btn btn-outline">Read All Patient Stories</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Preview ── */}
      <section className={`section ${styles.faqSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Common Questions</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqWrap}>
            <FaqAccordion />
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link href="/faq" className="btn btn-outline">All FAQs</Link>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ── */}
      {latestPosts.length > 0 && (
        <section className={`section bg-sage-pale`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="section-label">From the Blog</span>
              <h2>Latest Articles</h2>
              <p>Insights on homeopathy, wellness, and healing from Dr. Shweta&apos;s practice.</p>
            </div>
            <div className={styles.blogPreviewGrid}>
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
              <Link href="/blog" className="btn btn-outline">View All Articles</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
              Take the First Step
            </span>
            <h2 className={styles.ctaTitle}>Begin Your Healing Journey Today</h2>
            <p className={styles.ctaDesc}>
              Free 10-minute introductory call available. In-clinic (Zirakpur &amp; Budhlada) or online worldwide.
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/appointment" className="btn btn-gold btn-lg" id="cta-book-btn">
                Request Appointment
              </Link>
              <a href="tel:+916284411753" className={`btn btn-lg ${styles.ctaCallBtn}`}>
                📞 Call +91 62844 11753
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="mobile-cta-bar" aria-hidden="true">
        <Link href="/appointment" className="btn btn-gold">Book Appointment</Link>
        <a href="tel:+916284411753" className="btn btn-outline">Call Now</a>
      </div>
    </>
  );
}
