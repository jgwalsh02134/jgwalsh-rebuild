# Prompt: Redesign /contact — Mobile-First Contact Page

## Context

You are improving the contact page (`src/pages/contact.astro`) for jgwalsh.com, a professional portfolio site built with Astro 5. The site uses a Swiss Modernism design system with CERN Blue (`#0033A0`) and Princeton Orange (`#FF6B00`) as brand colors, Instrument Sans + Newsreader fonts, and an 8px spacing grid defined as CSS custom properties in `src/styles/global.css`. The site has full dark mode support via a `.dark` class on `<html>`. All styles use CSS custom properties (no Tailwind). The layout uses `BaseLayout.astro` with `Header.astro` and `Footer.astro` components.

The current contact page is a centered card with a JGW monogram, name, email/phone rows with copy buttons, a 5-item professional links grid, and a vCard download button. It works, but has several mobile-first UX problems and missed opportunities.

---

## Problems to Fix

### 1. Mobile tap targets and information hierarchy are wrong

**Phone number should be the most prominent action on mobile.** On a phone, the #1 reason someone visits a contact page is to call. Right now the phone number is styled identically to the email — a secondary-looking row buried in the card. On mobile (< 768px), the phone number should be a large, full-width, primary-styled "Call" button that uses `tel:` and is immediately visible without scrolling past the monogram. Email can be secondary.

On desktop (≥ 1024px), the hierarchy should flip: email becomes the primary action (people don't call from desktops), and phone is secondary.

### 2. Copy buttons are backwards

The copy buttons are `opacity: 0.55` on mobile and `opacity: 0` (hover-reveal) on desktop. This is the wrong way around. On mobile, there's no hover — users need to *see* the copy button clearly or not at all. On desktop, hover-reveal is fine. Fix: on mobile, either make copy buttons fully visible (`opacity: 1`) with a clear affordance, or remove them entirely and rely on long-press/native copy behavior. Don't show them at half opacity — it looks like a disabled state.

### 3. Double glassmorphism is heavy

On desktop (≥ 768px), both `.contact-frame` and `.contact-card` have `backdrop-filter: blur()` with semi-transparent backgrounds. This is two stacked glass layers, which is visually muddy and GPU-expensive. Pick one: either the frame *or* the card gets the glass treatment, not both. Recommendation: drop the glass on `.contact-frame` entirely and let the card stand alone on the background gradient.

### 4. The monogram is wasted space on mobile

The 80–104px JGW circle monogram is the first thing you see, but it communicates nothing that the name below it doesn't already say. On small screens, it pushes the actual contact actions below the fold. Options:

- **Replace it with a professional headshot** (much more personal and useful for recognition). Use Astro's `<Image />` component for automatic optimization.
- **Or shrink it significantly on mobile** (48px) and place it inline next to the name, Apple-contact-card style, so it doesn't take a full block of vertical space.

### 5. Professional links section conflates different things

The links grid mixes social profiles (LinkedIn), academic identifiers (ORCID), institutional pages (Siena, BU), and government job boards (USAJobs). These serve different audiences. Group them:

- **Connect** — LinkedIn, GitHub (networking/professional)
- **Academic** — ORCID, Siena College, Boston University (research/institutional)
- **Government** — USAJobs (if this link actually resolves — verify it)

Use small labeled sections rather than one flat icon grid. This helps visitors find the right link faster.

### 6. No contact form or message path

The page is "view-only" — it shows contact info but doesn't let anyone actually *send* a message. For a professional site, consider adding a lightweight contact form (name, email, message) that posts to a service like Formspree, Netlify Forms, or a Cloudflare Worker. This is especially important on mobile where switching between apps (browser → email client) is friction.

If a form feels like too much, at minimum add a prominent "Send me an email" mailto: button with a pre-filled subject line: `mailto:jgregorywalsh@icloud.com?subject=Inquiry%20from%20jgwalsh.com`.

### 7. The vCard button looks like an afterthought

The "Add to Contacts" vCard button is visually the strongest element (full CERN Blue primary button), but it's at the very bottom of the card. On mobile, this may be below the fold. It should be higher — ideally right after the name/identity section, because saving a contact is a top-3 action on mobile. Move it up.

### 8. Missing aria-live for clipboard feedback

When a user clicks "Copy," the button changes icon to a checkmark, but screen readers don't know anything happened. Add an `aria-live="polite"` region that announces "Copied to clipboard" when the copy succeeds. This is a WCAG requirement for dynamic content changes.

### 9. Inconsistent email addresses

The page shows `jgregorywalsh@icloud.com` as the primary email, but the footer uses `jgwalsh@proton.me`. The structured data in BaseLayout uses `jgwalsh@proton.me`. Pick one canonical contact email and use it everywhere, or clearly label them (e.g., "Personal" vs. "Encrypted/Secure").

---

## Redesign Specification

### Mobile (< 768px) — "Contact card" layout

```
┌─────────────────────────────┐
│  [48px photo]  J. Gregory   │  ← Inline photo + name
│               (Greg) Walsh  │
│  Behavioral Science & Data  │  ← One-line subtitle
├─────────────────────────────┤
│  📞  Call (617) 383-3745    │  ← Full-width PRIMARY button (tel:)
├─────────────────────────────┤
│  ✉  Send Email              │  ← Full-width SECONDARY button (mailto:)
├─────────────────────────────┤
│  👤 Add to Contacts (.vcf)  │  ← Tertiary/outlined button
├─────────────────────────────┤
│                             │
│  Connect                    │  ← Section label
│  [LinkedIn]  [GitHub]       │  ← 2-col icon+label grid
│                             │
│  Academic                   │
│  [ORCID] [Siena] [BU]      │  ← 3-col icon grid
│                             │
└─────────────────────────────┘
```

Key mobile rules:
- No monogram. Use a small circular photo or omit entirely.
- Phone "Call" button is `position: sticky` or at minimum above the fold.
- All tap targets ≥ 48px.
- Copy buttons hidden on mobile — rely on native long-press behavior.
- No `backdrop-filter` on mobile (performance on low-end devices).
- Page padding-top should account for the fixed header but not add excessive whitespace. `calc(var(--header-height) + var(--space-8))` is enough.

### Tablet (768px–1023px) — "Centered card" layout

Similar to current, but:
- Single glass layer (card only, not frame).
- Email and phone are equal-weight rows (both useful on tablet).
- Copy buttons visible on row hover.
- Professional links in a single row of 5 if space allows, otherwise 3+2.

### Desktop (≥ 1024px) — "Two-column" layout

```
┌──────────────────────────────────────────────┐
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │              │  │                      │  │
│  │  [Photo]     │  │  ✉ Email (PRIMARY)   │  │
│  │  Name        │  │  📞 Phone            │  │
│  │  Title       │  │  👤 Add to Contacts  │  │
│  │              │  │                      │  │
│  │  Connect     │  │  ── or ──            │  │
│  │  [LI] [GH]  │  │                      │  │
│  │              │  │  [Contact Form]      │  │
│  │  Academic    │  │  Name: ___________   │  │
│  │  [OR][SI][BU]│  │  Email: __________   │  │
│  │              │  │  Message: ________   │  │
│  └──────────────┘  │  [Send Message]      │  │
│                    └──────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

Key desktop rules:
- Two-column layout: identity/links on left, actions/form on right.
- Email is the primary action (not phone).
- Copy buttons hover-reveal on email/phone rows.
- Glass effect on the card is fine here (powerful GPUs).
- Max-width ~900px for the entire block.

---

## Technical Requirements

1. **Keep all styles in the `<style>` block of contact.astro** (scoped). Don't add to global.css.
2. **Use existing CSS custom properties** from global.css for all colors, spacing, typography, and transitions.
3. **Mobile-first CSS**: write the base styles for mobile, then use `@media (min-width: ...)` to progressively enhance.
4. **Dark mode**: every new color must have a `.dark` or `:global(.dark)` variant. Test both themes.
5. **Accessibility**:
   - All interactive elements ≥ 48px touch target.
   - Add `aria-live="polite"` region for copy feedback.
   - Maintain `prefers-reduced-motion: reduce` support.
   - Ensure color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI components).
   - Keep the existing focus-visible ring pattern (3px CERN Blue outline).
6. **No new dependencies**. Vanilla JS only for clipboard, form validation (if adding form).
7. **If adding a contact form**: use `<form action="https://formspree.io/f/{id}" method="POST">` or a similar zero-dependency approach. Include honeypot spam protection. Style it consistently with the card aesthetic.
8. **Image optimization**: if replacing the monogram with a photo, use Astro's `<Image />` component from `astro:assets` with `width`, `height`, and `alt` attributes.
9. **Verify all links work**: especially the USAJobs URL (`https://www.usajobs.gov/applicant/profile/` — does this actually resolve to a public profile, or does it require authentication?).
10. **Resolve the email inconsistency**: choose one canonical email for the contact page and ensure it matches the footer, structured data, and vCard.

---

## Files to Modify

- `src/pages/contact.astro` — Primary file. HTML structure, scoped styles, and client-side script.
- `public/assets/j-gregory-walsh.vcf` — Update if the canonical email changes.
- `src/components/Footer.astro` — Update email if it changes for consistency.
- `src/layouts/BaseLayout.astro` — Update structured data email if it changes.

## Files to NOT Modify

- `src/styles/global.css` — Do not add contact-specific styles here.
- `src/components/Header.astro` — No changes needed.
- `astro.config.mjs` — No changes needed.

---

## Acceptance Criteria

- [ ] On a 375px viewport (iPhone SE), the call button is visible without scrolling past the name.
- [ ] On a 390px viewport (iPhone 14), all content fits without horizontal overflow.
- [ ] On a 768px viewport (iPad), the card is centered and all links are reachable.
- [ ] On a 1440px viewport, the layout uses available space (two-column or wider card).
- [ ] Dark mode works correctly for every new element.
- [ ] Copy feedback is announced to screen readers.
- [ ] All tap targets meet the 48px minimum.
- [ ] `prefers-reduced-motion: reduce` disables all new animations.
- [ ] Lighthouse accessibility score ≥ 95.
- [ ] No layout shift (CLS = 0) during page load.
- [ ] The page loads no external JS libraries.
