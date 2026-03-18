# Stack'd Fries Website Spec — Review & Implementation Notes

**Reviewer:** Claude Code
**Date:** March 18, 2026
**Spec Version:** 1.0
**Status:** Ready for development with noted clarifications

---

## Overall Assessment

This is an excellent, thorough spec. The brand identity is clear, the design direction is well-defined, and the technical requirements are realistic. The document provides enough detail to build the site without ambiguity on most fronts. Below are questions, gaps, risks, and recommendations organized by section.

---

## 1. PROJECT OVERVIEW

### Strengths
- Clear single-page scope keeps V1 focused and shippable
- Framework flexibility (Next.js or Astro) is smart — both are excellent for this use case
- External ordering link avoids e-commerce complexity at launch

### Recommendations
- **Astro is the stronger choice here.** This is a mostly-static marketing site with minimal interactivity (scroll animations, open/closed status). Astro ships zero JS by default and can hydrate only the interactive islands (hours status badge). Next.js adds unnecessary client-side runtime for a site this simple. Lighthouse 90+ will be easier to hit with Astro.
- If the owner has a preference or future plans for a React-heavy dashboard/CMS integration, Next.js with static export is a solid fallback.

### Questions for Stakeholder
1. **Framework preference?** Astro recommended unless there's a reason to prefer Next.js.
2. **Hosting preference?** Vercel pairs best with Next.js; Netlify/Cloudflare Pages pair well with Astro.

---

## 2. BRAND IDENTITY SYSTEM

### Strengths
- Color palette is tight and purposeful — dark-first with gold accent is distinctive
- Typography hierarchy is well-defined with clear role assignments
- Brand voice guidelines are specific and actionable

### Issues & Clarifications

| Item | Issue | Recommendation |
|------|-------|----------------|
| **Gold on black contrast** | `#D4A843` on `#0D0D0D` = **7.6:1 contrast ratio** — passes WCAG AAA for normal text. Good. | No action needed. |
| **White 55% on black** | `rgba(255,255,255,0.55)` on `#0D0D0D` = **~8.2:1** — passes AAA. Good. | No action needed. |
| **White 40% for descriptions** | `rgba(255,255,255,0.40)` on `#1A1A1A` = **~5.3:1** — passes AA but fails AAA at 12px. | Bump to 45% opacity or ensure description text is at least 14px to meet AA for large text. |
| **White 35% (--text-muted)** | `rgba(255,255,255,0.35)` on dark = **~4.3:1** — borderline AA fail at small sizes. | Only use for decorative/non-essential text, or bump to 40%. |
| **Red badge text** | White on `#C73E3A` = **4.6:1** — passes AA normal text. | Acceptable, but bold text recommended for small badge labels. |
| **Bebas Neue weight** | Spec says 400 (Regular) — Bebas Neue only comes in Regular (400). Confirmed. | No issue, but limits bold headline options. Consider Bebas Neue Pro if bolder weights are ever needed. |

### Font Loading Note
Three Google Font families = 3 network requests minimum. Recommend using a single combined Google Fonts URL:
```
fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500&family=Barlow+Condensed:wght@500;600;700&display=swap
```

---

## 3. DESIGN DIRECTION

### Strengths
- Shake Shack benchmark is a clear, achievable reference point
- Design principles table is specific and implementable
- CSS-only textures avoid image dependencies

### Implementation Notes

| Element | Notes |
|---------|-------|
| **Radial gold glow** | `radial-gradient(ellipse at center, rgba(212,168,67,0.08) 0%, transparent 70%)` — simple CSS, no performance concerns. |
| **Line texture** | Horizontal lines at 2% white, 40px spacing — achievable with `repeating-linear-gradient`. Will add ~0 bytes to payload. |
| **Scroll animations** | Intersection Observer API + CSS transitions. No library needed. ~20 lines of JS. |
| **Sticky nav blur** | `backdrop-filter: blur()` has good browser support (96%+). Add `-webkit-backdrop-filter` for Safari. |
| **200ms stagger on load** | CSS `animation-delay` on child elements. Clean and simple. |
| **Gold glow pulse** | `@keyframes` with `box-shadow` or `filter: drop-shadow()` animation. 3s loop, subtle. Easy. |

### Risk: Mobile Performance
- `backdrop-filter: blur()` can cause jank on older Android devices. Recommend a solid fallback: `background: rgba(13,13,13,0.95)` when `backdrop-filter` is unsupported.

---

## 4. SITE STRUCTURE & CONTENT

### Strengths
- Single-page architecture is perfect for a food trailer launch site
- Content is specific and written — no placeholder lorem ipsum
- Menu items are real with actual descriptions

### Issues & Clarifications

#### 4.2 Hero Section
- **Logo treatment:** "FRIES" in gold, rest white — clear. But should this match the nav logo exactly? Spec says nav logo is "STACK'D FRIES (Bebas Neue, white + gold)" — assumed consistent.
- **Hero image:** Spec mentions "Full-bleed food photos in hero" in Section 3.2 but no hero image is specified in Section 4.2. The background is black with gold glow. **Clarification needed:** Is there a hero food photo, or is V1 text-only hero with the gold glow background?

#### 4.3 Menu Section
- **"2-column card grid"** — Spec doesn't specify max-width for the grid container. Recommend `max-width: 1200px` centered to prevent cards from stretching too wide on ultrawide monitors.
- **Funnel Cake and Dirty Sodas** are not "fries" — consider whether these should be visually differentiated (e.g., a "SIDES & DRINKS" sub-header) or kept in the same grid. Current spec treats all items equally.

#### 4.4 Menu Items
- **6 items total** (including rotating special) — fits a 2-column grid cleanly (3 rows). Good.
- **Rotating special teaser:** "You'll know it when you taste it." is great brand voice. The red badge + vague copy + Instagram CTA creates a compelling mystery loop.

#### 4.5 Location Section
- **"Address TBD"** — Will need this before launch. Placeholder is fine for dev.
- **Seasonal hours logic:** "Sat extended to 2am during OU sessions (Sep–Nov, Feb–Apr)" — this is non-trivial date logic. The config file needs a `seasonalOverrides` structure. Proposed schema:

```json
{
  "hours": {
    "default": {
      "thu": { "open": "17:00", "close": "22:00" },
      "fri": { "open": "17:00", "close": "23:00" },
      "sat": { "open": "12:00", "close": "23:00" },
      "sun": { "open": "12:00", "close": "20:00" }
    },
    "seasonalOverrides": [
      {
        "label": "OU Football Season",
        "months": [9, 10, 11],
        "overrides": { "sat": { "open": "12:00", "close": "02:00" } }
      },
      {
        "label": "OU Spring Season",
        "months": [2, 3, 4],
        "overrides": { "sat": { "open": "12:00", "close": "02:00" } }
      }
    ]
  }
}
```

- **"2am close"** — Does this mean 2:00 AM the next day (Sunday morning)? The hours utility must handle day-boundary crossings correctly.
- **Live open/closed status** — Requires client-side JavaScript to check current time against schedule. This is one of the few interactive components. In Astro, this would be a hydrated island.

#### 4.7 Footer
- **Missing:** No mention of email or phone contact. Is this intentional? Many food businesses include a contact email at minimum. Consider adding a `hello@stackdfries.com` or at least a link to DM on Instagram.

#### 4.8 Navigation
- **"Order" in nav** — Spec lists nav items as "Menu | Find Us | Order" but Section 4.1 shows nav labels as "Menu" and "Find Us" only. The hero has "Order Now" and "See The Menu" CTAs. **Confirm:** Nav should have three links: Menu (anchor), Find Us (anchor), Order (external)?
- **Mobile hamburger:** "Slide-in panel or full-screen overlay" — recommend full-screen overlay for simplicity and brand impact (dark overlay with gold links, centered).

---

## 5. RESPONSIVE DESIGN

### Strengths
- Three clean breakpoints covering all major device classes
- Mobile-specific requirements are detailed and practical
- 44px minimum touch targets called out explicitly

### Notes
- **Fixed mobile CTA bar:** 60px tall, pinned to bottom — this will overlap page content. Need `padding-bottom: 60px` on the body/main content on mobile to prevent the last section from being hidden behind it.
- **Hero tagline scaling:** 52px → 36px is a good ratio. Consider using `clamp()` for fluid scaling: `font-size: clamp(36px, 8vw, 52px)`.

---

## 6. TECHNICAL REQUIREMENTS

### 6.1 Performance
- **Lighthouse 90+** is achievable with Astro and proper font loading. Next.js may require extra optimization (dynamic imports, script defer).
- **FCP under 1.5s** — Easy with static hosting and preconnected fonts. The only render-blocking resources will be CSS and fonts.

### 6.2 SEO & Meta
- **All specified.** No gaps. Schema markup (LocalBusiness) is a smart inclusion for local SEO.
- **Favicon:** "Gold S on black background" — will need this asset created. Can be generated as SVG for crisp rendering at all sizes.

### 6.3 Configuration
- **JSON config is the right call for V1.** Easy to edit, version-controlled, no external dependencies.
- Recommend splitting into multiple config files if the single file gets unwieldy:
  - `menu.json` — menu items
  - `site.json` — hours, URLs, location, social links

### 6.4 Analytics
- **GA4 + Meta Pixel** — straightforward. Both can be loaded async with no performance impact.
- **Event tracking spec is clear:** Order clicks, scroll milestones, social clicks.
- **Missing:** No mention of cookie consent/GDPR banner. For a US-only Norman, OK business this is low priority, but worth noting if they ever run Meta ads targeting broader audiences.

---

## 7. FILE STRUCTURE

The suggested structure is clean. Minor adjustments for Astro (if chosen):

```
stackd-fries/
├── public/
│   ├── images/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Nav.astro
│   │   ├── MenuSection.astro
│   │   ├── MenuCard.astro
│   │   ├── Location.astro
│   │   ├── HoursStatus.tsx       # Interactive island (React/Preact)
│   │   ├── Social.astro
│   │   └── Footer.astro
│   ├── config/
│   │   └── site.json
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   └── hours.ts
│   └── pages/
│       └── index.astro
├── .env
├── astro.config.mjs
└── package.json
```

Key difference: Only `HoursStatus` needs client-side JS hydration. Everything else is static HTML + CSS.

---

## 8. CSS DESIGN TOKENS

### Strengths
- Comprehensive token set covering colors, typography, spacing, and transitions
- Ready to copy-paste into `globals.css`

### Suggested Additions
```css
:root {
  /* ...existing tokens... */

  /* Layout */
  --max-width: 1200px;
  --nav-height: 64px;

  /* Z-index scale */
  --z-nav: 100;
  --z-mobile-cta: 90;
  --z-mobile-menu: 110;
}
```

---

## Summary of Questions for Stakeholder

| # | Question | Impact |
|---|----------|--------|
| 1 | **Framework preference:** Astro (recommended) or Next.js? | Architecture decision |
| 2 | **Hero image:** Is V1 text-only hero, or is there a food photo to include? | Hero layout |
| 3 | **Contact info in footer:** Add email/phone, or social DMs only? | Footer content |
| 4 | **Menu sub-sections:** Should Funnel Cake & Dirty Sodas be grouped separately from loaded fries? | Menu layout |
| 5 | **Square or Toast:** Which ordering platform? Need the URL for the Order Now CTA. | CTA link |
| 6 | **Nav "Order" link:** Confirm nav has three items: Menu, Find Us, Order (external)? | Nav structure |
| 7 | **Mobile menu style:** Full-screen overlay preferred over slide-in panel? | Mobile UX |

---

## Risk Summary

| Risk | Severity | Mitigation |
|------|----------|------------|
| `backdrop-filter` jank on old Android | Low | Solid color fallback |
| Seasonal hours logic edge cases (2am day-boundary) | Medium | Thorough unit tests on hours utility |
| White 35-40% text failing WCAG AA at small sizes | Medium | Bump opacity or increase font size |
| No cookie consent for Meta Pixel | Low | Add simple banner if running ads |
| Missing address/ordering URL at launch | High | Placeholder config, but blocks go-live |

---

## Verdict

**This spec is build-ready.** The 7 questions above are nice-to-haves for polish — none of them block starting development. I recommend:

1. Start with Astro + static deployment
2. Build the config-driven architecture first (`site.json` + hours utility)
3. Lay out all sections with the design tokens
4. Add animations and interactions last
5. Address stakeholder questions as they're answered

**Estimated component count:** 7-8 components, 1 config file, 1 utility module, 1 page. This is a clean, focused build.
