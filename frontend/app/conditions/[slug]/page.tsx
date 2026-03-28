import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { conditions, getConditionBySlug } from '@/lib/conditions';
import { buildMetadata, buildConditionSchema } from '@/lib/seo';

export async function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);
  if (!condition) return {};
  return buildMetadata({
    title: `${condition.name} — Homeopathic Treatment`,
    description: `${condition.shortDesc} ${condition.intro.slice(0, 120)}...`,
    path: `/conditions/${condition.slug}`,
  });
}

export const revalidate = 3600;

export default async function ConditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);
  if (!condition) notFound();

  const schema = buildConditionSchema(condition.name, condition.intro);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, hsl(152,42%,14%), hsl(152,30%,28%))',
        padding: 'var(--space-16) 0',
      }}>
        <div className="container">
          <Link href="/services" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-sm)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            ← All Conditions
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '48px' }}>{condition.icon}</span>
            <h1 style={{ color: 'var(--clr-white)' }}>{condition.name}</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-lg)', maxWidth: '600px' }}>
            {condition.shortDesc}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-12)', alignItems: 'start' }}>
            {/* Main content */}
            <div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Overview</h2>
              <div className="divider" />
              <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.8, marginBottom: 'var(--space-8)' }}>
                {condition.intro}
              </p>

              <h3 style={{ marginBottom: 'var(--space-4)' }}>Common Symptoms</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
                {condition.symptoms.map((s) => (
                  <div key={s} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--clr-sage-pale)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--clr-text)',
                    fontWeight: 500,
                  }}>
                    <span style={{ color: 'var(--clr-sage)', fontWeight: 700 }}>✓</span>
                    {s}
                  </div>
                ))}
              </div>

              <h3 style={{ marginBottom: 'var(--space-4)' }}>How Homeopathy Helps</h3>
              <div style={{
                background: 'var(--clr-sage-pale)',
                borderLeft: '4px solid var(--clr-sage)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
              }}>
                <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--clr-text)' }}>
                  {condition.howHomeopathyHelps}
                </p>
              </div>

              <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-5)', background: 'var(--clr-gold-lt)', borderRadius: 'var(--radius-lg)', border: '1px solid hsl(42,68%,82%)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'hsl(42,68%,28%)', fontWeight: 500 }}>
                  ⚠️ <strong>Disclaimer:</strong> Homeopathy is complementary medicine. Always consult a qualified practitioner. Results vary by individual. This page is for educational purposes only.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'sticky', top: 'calc(var(--header-h) + 2rem)' }}>
              <div className="card" style={{ borderTop: '4px solid var(--clr-sage)' }}>
                <h4 style={{ marginBottom: 'var(--space-3)' }}>Book a Consultation</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-mid)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                  Get an individualized prescription for {condition.name} from Dr. Shweta Goyal.
                </p>
                <Link href="/appointment" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Request Appointment
                </Link>
                <div style={{ textAlign: 'center', marginTop: 'var(--space-3)' }}>
                  <a href="tel:+916284411753" style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-sage)', fontWeight: 600 }}>
                    📞 +91 62844 11753
                  </a>
                </div>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-3)' }}>Dr. Shweta&apos;s Credentials</h4>
                {['BHMS — Gold Medalist, Panjab University', 'MD (Homoeopathy)', 'PG — IACH, Greece', '15+ Years Clinical Experience'].map((c) => (
                  <div key={c} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--clr-text-mid)' }}>
                    <span style={{ color: 'var(--clr-sage)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {c}
                  </div>
                ))}
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-3)' }}>Other Conditions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {conditions.filter((c) => c.slug !== slug).slice(0, 5).map((c) => (
                    <Link key={c.slug} href={`/conditions/${c.slug}`} style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--clr-sage)',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) 0',
                      borderBottom: '1px solid var(--clr-border)',
                    }}>
                      <span>{c.icon}</span> {c.name}
                    </Link>
                  ))}
                  <Link href="/services" style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-sage)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
                    View all conditions →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
