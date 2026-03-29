'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, MessageCircle, Pill, RefreshCw } from 'lucide-react';
import styles from './ConsultationPathway.module.css';

const steps = [
  {
    number: '01',
    icon: <CalendarCheck size={28} />,
    title: 'Book Consultation',
    desc: 'Fill out our simple appointment form online or call us. Free 10-min intro call available.',
  },
  {
    number: '02',
    icon: <MessageCircle size={28} />,
    title: 'Deep Case Analysis',
    desc: 'Dr. Shweta takes a thorough history — body, mind, emotions, lifestyle — nothing is left out.',
  },
  {
    number: '03',
    icon: <Pill size={28} />,
    title: 'Your Personal Remedy',
    desc: 'A constitutional remedy selected uniquely for you. Delivered to your door across India.',
  },
  {
    number: '04',
    icon: <RefreshCw size={28} />,
    title: 'Heal & Follow-up',
    desc: 'Regular check-ins track your progress and refine treatment until you are fully healed.',
  },
];

export default function ConsultationPathway() {
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            className={`${styles.card} glass-card`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
          >
            <div className={styles.stepBadge}>{step.number}</div>
            <div className={styles.icon}>{step.icon}</div>
            <h4 className={styles.title}>{step.title}</h4>
            <p className={styles.desc}>{step.desc}</p>
            {i < steps.length - 1 && (
              <div className={styles.connector} aria-hidden="true" />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.cta}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.45 }}
      >
        <Link href="/appointment" className="btn btn-gold btn-lg">
          Start Your Journey →
        </Link>
      </motion.div>
    </div>
  );
}
