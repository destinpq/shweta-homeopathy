"""
scrape-google-reviews.py  v3
Scrapes all Google Maps reviews for Dr. Shweta's Homoeopathy.
Usage:  python3 scripts/scrape-google-reviews.py
"""

import json, time, re, random
from playwright.sync_api import sync_playwright

SEARCH_QUERY = "Dr. Shweta's Homoeopathy Zirakpur"
OUT_FILE = "scripts/scraped-reviews.json"

def pause(a=0.5, b=1.2):
    time.sleep(random.uniform(a, b))

def scroll_panel(page):
    page.evaluate("""
        () => {
            // Try common Maps review panel selectors
            const candidates = [
                document.querySelector('.m6QErb.DxyBCb.kA9KIf'),
                document.querySelector('.m6QErb[tabindex="-1"]'),
                document.querySelector('.m6QErb.DxyBCb'),
                document.querySelector('.m6QErb'),
                ...[...document.querySelectorAll('div')].filter(
                    d => d.scrollHeight > d.clientHeight + 100
                      && d.clientHeight > 300
                      && d.clientHeight < 900
                ).slice(-3),
            ].filter(Boolean);
            if (candidates[0]) candidates[0].scrollBy(0, 700);
            else window.scrollBy(0, 700);
        }
    """)

def scrape():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            slow_mo=40,
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox", "--start-maximized"]
        )
        ctx = browser.new_context(
            viewport={"width": 1400, "height": 900},
            locale="en-US",
            timezone_id="Asia/Kolkata",
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.184 Safari/537.36",
        )
        page = ctx.new_page()
        page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined})")

        # ── Step 1: Load Maps ───────────────────────────────────────────
        print("→ Loading Google Maps...")
        page.goto(
            f"https://www.google.com/maps/search/{SEARCH_QUERY.replace(' ', '+')}",
            wait_until="domcontentloaded", timeout=60000
        )
        pause(3, 5)

        # Accept cookies
        for sel in ["button:has-text('Accept all')", "button:has-text('Agree')"]:
            try: page.click(sel, timeout=2000); pause(1, 2); break
            except: pass

        # ── Step 2: Open the first result ───────────────────────────────
        print("→ Opening clinic page...")
        try:
            page.click(".Nv2PK:first-child", timeout=6000)
        except:
            try: page.click("a[href*='/maps/place/']", timeout=6000)
            except:
                try: page.keyboard.press("Enter"); pause(1, 2)
                except: pass
        pause(3, 5)
        print(f"  URL: {page.url[:120]}")

        # ── Step 3: Click Reviews tab ───────────────────────────────────
        print("→ Clicking Reviews tab...")
        clicked = False
        for sel in [
            "button[aria-label*='Reviews']",
            "button.hh2c6",
            "[role='tab']:has-text('Reviews')",
            "button:has-text('Reviews')",
        ]:
            try:
                page.click(sel, timeout=6000)
                print(f"  Clicked: {sel}")
                clicked = True
                pause(3, 4)
                break
            except: pass
        if not clicked:
            print("  Could not find Reviews tab — trying direct URL...")
            # Use the direct URL with reviews tab hash
            current = page.url
            if "/place/" in current:
                parts = current.split("?")
                reviews_url = parts[0].rstrip("/") + "/reviews"
                page.goto(reviews_url, wait_until="domcontentloaded", timeout=30000)
                pause(3, 5)

        # ── Step 4: Sort by Newest (optional) ──────────────────────────
        try:
            page.click("[aria-label='Sort reviews'], button:has-text('Sort')", timeout=3000)
            pause(0.5, 1)
            page.click("li:has-text('Newest'), [data-index='1']", timeout=3000)
            pause(2, 3)
            print("  Sorted by newest")
        except: pass

        # ── Step 5: Scroll to load all reviews ─────────────────────────
        print("→ Scrolling to load all reviews...")
        last = 0
        streak = 0
        for i in range(150):
            n = len(page.query_selector_all(".jftiEf, [data-review-id]"))
            if n > last:
                print(f"  {n} reviews loaded...")
                last = n
                streak = 0
            else:
                streak += 1
                if streak >= 8:
                    print(f"  No new reviews after {streak} scrolls — done.")
                    break
            scroll_panel(page)
            pause(0.7, 1.1)

        # ── Step 6: Expand all "More" buttons ──────────────────────────
        print("→ Expanding truncated reviews...")
        for btn in page.query_selector_all("button.w8nwRe, button[jsaction*='expandReview']"):
            try: btn.click(); pause(0.05, 0.12)
            except: pass
        pause(1, 1.5)

        # ── Step 7: Debug — dump sample HTML ───────────────────────────
        n_blocks = len(page.query_selector_all(".jftiEf, [data-review-id]"))
        print(f"→ Found {n_blocks} review blocks. Extracting...")

        if n_blocks == 0:
            # Dump some diagnostic HTML to understand page state
            html_snippet = page.evaluate("document.body.innerHTML.slice(0,3000)")
            print("  DEBUG: page snippet:")
            print(html_snippet[:500])

        # ── Step 8: Extract ─────────────────────────────────────────────
        raw = page.evaluate("""
            () => {
                const out = [];
                const seen = new Set();
                const blocks = [...new Set([
                    ...document.querySelectorAll('.jftiEf'),
                    ...document.querySelectorAll('[data-review-id]'),
                ])];

                for (const b of blocks) {
                    const name = (
                        b.querySelector('.d4r55')?.innerText ||
                        b.querySelector('.kvMYJc')?.innerText || ''
                    ).trim();

                    const rEl = b.querySelector('[aria-label*="star"]');
                    let rating = 5;
                    if (rEl) {
                        const m = (rEl.getAttribute('aria-label')||'').match(/(\\d)/);
                        if (m) rating = +m[1];
                    }

                    const text = (
                        b.querySelector('.wiI7pd')?.innerText ||
                        b.querySelector('span[jscontroller]')?.innerText || ''
                    ).trim();

                    const date = (b.querySelector('.rsqaWe')?.innerText || '').trim();

                    const img = b.querySelector('img.NBa7we, img[src*="googleusercontent"]');
                    const imageUrl = img ? img.src : '';

                    const key = name + '|' + text.slice(0, 40);
                    if (!seen.has(key) && name) {
                        seen.add(key);
                        out.push({ name, rating, text, date, imageUrl });
                    }
                }
                return out;
            }
        """)

        browser.close()
        return raw

def main():
    print("=" * 60)
    print("Google Reviews Scraper — Dr. Shweta's Homoeopathy")
    print("=" * 60)
    print("A browser window will open — do NOT close it.\n")

    reviews = scrape()

    print(f"\n✅ Scraped {len(reviews)} reviews")
    for r in reviews[:5]:
        preview = (r['text'] or '(no text)')[:70].replace('\n', ' ')
        print(f"  • {r['name']} ({r['rating']}★)  {preview}...")

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Saved → {OUT_FILE}")

if __name__ == "__main__":
    main()
