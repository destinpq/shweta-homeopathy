/**
 * GOOGLE REVIEWS EXTRACTOR
 * ─────────────────────────────────────────────────────────────────
 * HOW TO USE:
 *
 *  1. Open Chrome and go to:
 *     https://www.google.com/maps/place/Dr.+Shweta%27s+Homoeopathy/@30.6513053,76.8147174,17z
 *
 *  2. Click the "Reviews" tab on the business listing.
 *
 *  3. SCROLL DOWN slowly in the reviews panel until no more reviews
 *     load (you should see all 107 reviews).
 *
 *  4. Open Chrome DevTools:  Cmd+Option+J  (Mac)  or  F12 (Windows)
 *     → click the "Console" tab.
 *
 *  5. Paste this ENTIRE script into the console and press Enter.
 *
 *  6. A JSON file named  google-reviews.json  will download
 *     automatically with all visible reviews.
 *
 *  7. Put that file in:  scripts/google-reviews-raw.json
 *     Then run:  node scripts/import-all-google-reviews.mjs
 * ─────────────────────────────────────────────────────────────────
 */
(function extractGoogleReviews() {
  // ── Expand all truncated "More" buttons ───────────────────────
  const moreBtns = document.querySelectorAll('button.w8nwRe, button[jsaction*="expandReview"]');
  moreBtns.forEach(b => { try { b.click(); } catch(e) {} });

  // Small wait for DOM update, then extract
  setTimeout(() => {
    const reviews = [];
    const seen = new Set();

    const blocks = [
      ...document.querySelectorAll('.jftiEf'),
      ...document.querySelectorAll('[data-review-id]'),
    ].filter((el, i, arr) => arr.indexOf(el) === i);

    blocks.forEach(block => {
      // Reviewer name
      const name = (
        block.querySelector('.d4r55')?.innerText ||
        block.querySelector('.kvMYJc')?.innerText || ''
      ).trim();

      // Star rating  (aria-label like "5 stars")
      const rEl = block.querySelector('[aria-label*="star"]');
      let rating = 5;
      if (rEl) {
        const m = (rEl.getAttribute('aria-label') || '').match(/(\d)/);
        if (m) rating = parseInt(m[1], 10);
      }

      // Full review text (after expanding)
      const text = (
        block.querySelector('.wiI7pd')?.innerText ||
        block.querySelector('span[jscontroller]')?.innerText || ''
      ).trim();

      // Relative date ("2 weeks ago", etc.)
      const date = (block.querySelector('.rsqaWe')?.innerText || '').trim();

      // Profile photo
      const imgEl = block.querySelector('img.NBa7we, img[src*="googleusercontent"]');
      const imageUrl = imgEl ? imgEl.src : '';

      const key = `${name}|${text.slice(0, 40)}`;
      if (!seen.has(key) && name) {
        seen.add(key);
        reviews.push({ name, rating, text, date, imageUrl,
                       source: 'Google', status: 'published' });
      }
    });

    console.log(`✅  Extracted ${reviews.length} reviews`);
    reviews.slice(0, 3).forEach((r, i) =>
      console.log(`  ${i+1}. ${r.name} (${r.rating}★): ${r.text.slice(0,60)}...`)
    );

    // ── Auto-download JSON ──────────────────────────────────────
    const blob = new Blob([JSON.stringify(reviews, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'google-reviews.json';
    a.click();

    return reviews;
  }, 800);
})();
