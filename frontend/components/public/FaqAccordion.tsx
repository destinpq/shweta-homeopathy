'use client';
import { useState } from 'react';
import { faqs } from '@/lib/content';
import styles from './FaqAccordion.module.css';

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={styles.accordion}>
      {faqs.map((f, i) => (
        <div key={i} className={`${styles.item} ${open === i ? styles.isOpen : ''}`}>
          <button className={styles.question} onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} id={`faq-btn-${i}`}>
            {f.question}
            <span className={styles.icon}>{open === i ? '−' : '+'}</span>
          </button>
          <div className={styles.answer}>
            <p>{f.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
