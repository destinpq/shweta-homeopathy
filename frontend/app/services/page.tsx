import type { Metadata } from 'next';
import Link from 'next/link';
import { conditions } from '@/lib/conditions';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Conditions We Treat',
  description:
    "Dr. Shweta's Homoeopathy treats a wide range of chronic and complex conditions including skin diseases, women's health, joint problems, pediatric conditions, respiratory issues, thyroid disorders, and much more.",
  path: '/services',
});

export const revalidate = 3600;

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, hsl(152,42%,14%), hsl(152,30%,28%))',
        padding: 'var(--space-16) 0',
      }}>
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
            Services
          </span>
          <h1 style={{ color: 'var(--clr-white)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            Conditions We Treat
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-lg)', maxWidth: '600px' }}>
            Classical homeopathic treatment for chronic, complex, and difficult-to-treat conditions.
            Each patient receives an individualized prescription — never a one-size-fits-all approach.
          </p>
        </div>
      </section>

      {/* Conditions grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
            {conditions.map((c) => (
              <Link key={c.slug} href={`/conditions/${c.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '36px', flexShrink: 0 }}>{c.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>{c.name}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-mid)', lineHeight: 1.65 }}>{c.shortDesc}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-lt)' }}>
                      {c.symptoms.length} common symptoms
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-sage)', fontWeight: 600 }}>
                      Learn more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section" style={{ background: 'var(--clr-sage-pale)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', marginInline: 'auto', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Why Choose Homeopathy</span>
            <h2 style={{ marginTop: 'var(--space-3)' }}>Safe. Natural. Permanent.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
            {[
              { icon: '🛡️', title: 'Zero Side Effects', desc: 'Safe for children, pregnant women, nursing mothers, and the elderly.' },
              { icon: '🎯', title: 'Permanent Cure', desc: 'Removes the root cause of disease rather than managing symptoms indefinitely.' },
              { icon: '🌿', title: 'Natural Healing', desc: 'Highly diluted natural remedies that stimulate the body\'s own healing intelligence.' },
            ].map((b) => (
              <div key={b.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: 'var(--space-4)' }}>{b.icon}</div>
                <h4 style={{ marginBottom: 'var(--space-2)' }}>{b.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--clr-forest)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--clr-white)', marginBottom: 'var(--space-4)' }}>Not Sure Where to Start?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 'var(--space-6)', maxWidth: '500px', marginInline: 'auto' }}>
            Book a consultation and let Dr. Shweta assess your case comprehensively.
          </p>
          <Link href="/appointment" className="btn btn-gold btn-lg">Request Appointment</Link>
        </div>
      </section>
    </>
  );
}
