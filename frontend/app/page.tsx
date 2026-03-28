import type { Metadata } from 'next';
import Link from 'next/link';
import { conditions } from '@/lib/conditions';
import { testimonials, faqs } from '@/lib/content';
import { buildDoctorSchema, buildFAQSchema } from '@/lib/seo';
import { getLatestBlogs } from '@/lib/blog';
import BlogCard from '@/components/public/BlogCard';
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
      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span>🌿</span> Established Practice · Classical Homeopathy
          </div>
          <h1 className={styles.heroTitle}>
            Healing at the Root.<br />
            <em>Naturally.</em>
          </h1>
          <p className={styles.heroSubtitle}>
            Dr. Shweta Goyal — BHMS Gold Medalist · MD (Hom) · PG IACH Greece<br />
            Expert homeopathic care for chronic & complex conditions.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/appointment" className="btn btn-gold btn-lg" id="hero-book-btn">
              Request Appointment
            </Link>
            <Link href="/about" className={`btn btn-lg ${styles.heroOutlineBtn}`}>
              Meet Dr. Shweta
            </Link>
          </div>
          <div className={styles.heroStats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statNum}>{s.number}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroScrollHint}>
          <span>Scroll to explore</span>
          <div className={styles.scrollArrow} />
        </div>
      </section>

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

      {/* ── Doctor intro ── */}
      <section className={`section ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImg}>
              <div className={styles.imgPlaceholder}>
                <span>𓆸</span>
                <p>Dr. Shweta Goyal</p>
              </div>
              <div className={styles.imgBadge}>
                <span className={styles.imgBadgeNum}>Gold</span>
                <span className={styles.imgBadgeLabel}>Medalist</span>
              </div>
            </div>
            <div className={styles.aboutText}>
              <span className="section-label">About the Doctor</span>
              <h2>A Luminary in Classical Homeopathy</h2>
              <div className="divider" />
              <p>
                Dr. Shweta Goyal is a distinguished homeopathic physician with a rare combination of academic excellence
                and deep clinical experience. She graduated as a <strong>Gold Medalist in BHMS from Panjab University</strong>,
                followed by an MD in Homeopathy, and a post-graduate qualification from the
                <strong> International Academy of Classical Homeopathy (IACH), Greece</strong> — one of the world&apos;s foremost
                institutions for classical homeopathic training.
              </p>
              <p>
                Her approach is rooted in the conviction that true healing means removing the root causes of disease —
                not merely managing symptoms. Every patient is treated as a unique individual with a carefully individualized prescription.
              </p>
              <div className={styles.credsList}>
                {['BHMS — Gold Medalist, Panjab University', 'MD (Homoeopathy)', 'PG — IACH, Greece', 'DNHE, Delhi'].map((c) => (
                  <div key={c} className={styles.credItem}>
                    <span className={styles.credDot} />
                    {c}
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn btn-primary">Read Full Profile</Link>
            </div>
          </div>
        </div>
      </section>

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
              <Link key={c.slug} href={`/conditions/${c.slug}`} className={styles.conditionCard}>
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
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Why Choose Homeopathy</span>
            <h2>Healing That Goes to the Root</h2>
            <p>Homeopathy is not just alternative medicine — it is a complete system of medicine that transforms health permanently.</p>
          </div>
          <div className="grid-3" style={{ marginTop: '3rem' }}>
            {whyChoose.map((w) => (
              <div key={w.title} className={`card ${styles.whyCard}`}>
                <div className={styles.whyIcon}>{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="section bg-cream">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">How It Works</span>
            <h2>What to Expect</h2>
            <p>A simple, patient-centered process designed around your healing journey.</p>
          </div>
          <div className={styles.processGrid}>
            {process.map((p, i) => (
              <div key={p.step} className={styles.processItem}>
                <div className={styles.processStep}>{p.step}</div>
                {i < process.length - 1 && <div className={styles.processLine} />}
                <h4 className={styles.processTitle}>{p.title}</h4>
                <p className={styles.processDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Patient Stories</span>
            <h2>What Our Patients Say</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className={`card ${styles.testimonialCard}`}>
                <div className={styles.stars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
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
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/testimonials" className="btn btn-outline">Read All Testimonials</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Preview ── */}
      <section className="section bg-sage-pale">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-label">Common Questions</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqGrid}>
            {faqs.slice(0, 4).map((f) => (
              <div key={f.question} className={`card ${styles.faqCard}`}>
                <h4 className={styles.faqQ}>{f.question}</h4>
                <p className={styles.faqA}>{f.answer}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" className="btn btn-outline">All FAQs</Link>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ── */}
      {latestPosts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="section-label">From the Blog</span>
              <h2>Latest Articles</h2>
              <p>Insights on homeopathy, wellness, and healing from Dr. Shweta&apos;s practice.</p>
            </div>
            <div className={styles.blogPreviewGrid}>
              {latestPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/blog" className="btn btn-outline">View All Articles</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <span className="section-label">Take the First Step</span>
            <h2 className={styles.ctaTitle}>Begin Your Healing Journey Today</h2>
            <p className={styles.ctaDesc}>
              Free 10-minute introductory call available. In-clinic (Zirakpur & Budhlada) or online worldwide.
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
    </>
  );
}
