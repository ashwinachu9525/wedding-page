# Aswin K & Annapoorna — Bespoke Editorial Wedding Website

An ultra-luxury, high-performance, single-page wedding website built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. Designed with the editorial sophistication of a Vogue feature or high-end creative agency, this project prioritizes typography, large intentional whitespace, subtle animations, and 100/100 Core Web Vitals performance.

---

## 🌟 Key Features

- **Editorial Photography-First Architecture**: Magazine-style typography mixing *Cormorant Garamond* serifs with *Plus Jakarta Sans* minimalism.
- **Cinematic Desktop Video Hero**: Responsive looping video background with automatic fallback to high-resolution optimized imagery on mobile devices and reduced-motion environments.
- **Interactive Relationship Timeline**: Alternating narrative layout charting the couple's story from first encounter to wedding weekend.
- **Refined Event & Itinerary Cards**: Dynamic cards featuring integrated Google Maps links, dress code guides, and one-click `.ics` **Add to Calendar** generation.
- **Accommodations Guide**: Curated hotel recommendations with distances, descriptions, and booking promo codes.
- **Responsive Masonry Gallery with Lightbox**: Filterable portfolio (Engagement, Ceremony, Portraits, Reception) powered by `next/image` and `yet-another-react-lightbox` with swipe gestures and keyboard navigation.
- **Interactive RSVP Modal**: Dialog/Sheet workflow with guest count selectors, dietary allergy trackers, song requests, and confirmation states.
- **Turnkey SEO Suite**: Dynamic Open Graph cards, Twitter metadata, automatic `sitemap.xml`, `robots.txt`, and Schema.org `WeddingEvent` JSON-LD structured data.

---

## 🛠️ Technology Stack

- **Core Framework**: Next.js 16.2 (App Router, Server & Client Components)
- **Language**: TypeScript 5+ (Strict mode)
- **Styling**: Tailwind CSS v4 + CSS Variables design tokens
- **UI Architecture**: shadcn/ui (Base UI / Radix primitives)
- **Typography**: `next/font/google` (*Cormorant Garamond* & *Plus Jakarta Sans*)
- **Icons**: Lucide React
- **Lightbox**: `yet-another-react-lightbox`
- **Code Quality**: ESLint 9 + Prettier (`prettier-plugin-tailwindcss`)

---

## 🚀 Quick Start & Local Development Guide

### Prerequisites
- Node.js 20.x or higher
- npm, pnpm, yarn, or bun

### 1. Installation
Clone or navigate to the project directory and install dependencies:

```bash
npm install
```

### 2. Local Development Server
Launch the development server with hot module replacement:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### 3. Production Verification & Build
Verify code quality, TypeScript types, and generate static assets locally:

```bash
npm run build
npm run start
```

---

## ✏️ Customization Guide (Updating Data & Assets)

All wedding details are centrally organized so you can customize the entire website in **under 5 minutes** without touching complex UI components.

### 1. Updating Couple Names, Wedding Date & Welcome Message
Open `data/wedding-data.ts` and modify the `coupleInfo` object:

```typescript
export const coupleInfo: CoupleInfo = {
  names: "Elena & Julian",
  firstNames: { partner1: "Elena", partner2: "Julian" },
  fullNames: {
    partner1: "Elena Vance Kensington",
    partner2: "Julian Alexander Thorne",
  },
  weddingDateISO: "2026-10-18T16:00:00.000Z", // ISO format for countdown & calendar
  weddingDateDisplay: "October 18, 2026",
  locationDisplay: "Lake Como, Italy",
  hashtag: "#ThorneToLove",
  headline: "Two Lives, One Timeless Journey",
  welcomeMessage: "We joyfully invite you to join us...",
  heroVideoUrl: "/videos/hero.mp4", // or external CDN URL
  heroFallbackImage: "/images/hero-fallback.jpg",
};
```

### 2. Updating the Couple's Story & Timeline
In `data/wedding-data.ts`, edit the `storyTimeline` array. You can add or remove milestones:

```typescript
export const storyTimeline: StoryTimelineItem[] = [
  {
    id: "first-encounter",
    date: "Autumn 2021",
    title: "A Chance Encounter in Brera",
    description: "On a crisp October evening in Milan...",
    image: "https://images.unsplash.com/photo-...",
    location: "Milan, Italy",
  },
  // Add more milestones...
];
```

### 3. Modifying Event Itinerary & Accommodations
In `data/wedding-data.ts`, edit `weddingEvents` and `accommodations`. The `.ics` calendar generator automatically reads these dates, times, and addresses to create downloadable calendar invites for your guests.

### 4. Updating the Photo Gallery
In `data/wedding-data.ts`, update `galleryPhotos`. Assign each photo a category (`"ceremony" | "engagement" | "portraits" | "reception"`) to automatically populate the interactive filter buttons:

```typescript
export const galleryPhotos: GalleryImage[] = [
  {
    id: "photo-1",
    src: "/images/gallery-1.jpg",
    alt: "Elena and Julian walking through Milan",
    width: 1200,
    height: 800,
    category: "engagement",
    caption: "Quiet mornings in the heart of Milan",
  },
];
```

### 5. Updating Navigation Links
To change navigation labels or anchor targets, open `components/navbar/navbar.tsx` and edit `navLinks`:

```typescript
const navLinks = [
  { label: "Story", href: "#story" },
  { label: "Details", href: "#events" },
  { label: "Accommodations", href: "#accommodations" },
  { label: "Gallery", href: "#gallery" },
  { label: "Q&A", href: "#faq" },
];
```

### 6. Updating SEO & Metadata Settings
SEO tags and Open Graph metadata automatically inherit from `coupleInfo` in `data/wedding-data.ts`. For advanced customization (custom domains, canonical URLs, search engine verification), open `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts`.

---

## ⚡ Performance Optimization Notes

This application is engineered for **95+ to 100 Lighthouse scores** across Performance, Accessibility, Best Practices, and SEO:

1. **Image Optimization (`next/image`)**:
   - Automatic conversion to modern AVIF/WebP formats.
   - Precise `sizes` attributes (`(max-width: 640px) 100vw...`) prevent oversized image downloads on mobile devices.
   - Below-the-fold gallery images load lazily, while the hero image utilizes `priority` for instant LCP (Largest Contentful Paint).

2. **Video Asset Optimization**:
   - The desktop hero video uses `playsInline muted loop autoPlay` with no audio track to keep file sizes minimal (< 3MB recommended).
   - Automatically hidden on mobile devices (<768px) and replaced with an optimized static image to preserve mobile battery and bandwidth.

3. **Font Loading (`next/font/google`)**:
   - Fonts are pre-hosted and self-served at build time with `display: 'swap'` and zero Layout Shift (CLS = 0.00).

4. **Zero Layout Shifts**:
   - Explicit `width` and `height` aspect ratios reserved for every card, timeline entry, and gallery thumbnail.

---

## 🖼️ Asset Optimization Workflow

When preparing your own photography and videography assets:

1. **Images**:
   - Export images at 80% WebP or AVIF quality.
   - Keep landscape hero photos around `1920x1080px` (< 250KB).
   - Place local images in `/public/images/`.

2. **Videos**:
   - Encode looping background videos in H.264 MP4 (`Profile: High`, `Level: 4.0`, bitrate ~2.5Mbps) and WebM.
   - Strip all audio streams (`ffmpeg -i input.mp4 -an -vcodec copy output.mp4`).
   - Place videos in `/public/videos/`.

---

## 🔐 Admin Dashboard & Media Uploader (`/admin`)

This project includes a dedicated, password-protected **Admin Portal** accessible at `/admin` (or via the "Admin Portal" link in the footer):
- **Passcode Protection**: Default PIN is `2026` (can be customized in `app/admin/page.tsx`).
- **Live Photo Uploader**: Upload images directly from your computer/phone or paste CDN links. Select event categories (*Mehendi & Sangeet, Muhurtham, Reception Gala, Engagement & Portraits*) and set captions.
- **Hero Video Background Customizer**: Update the cinematic looping background video in real time.
- **RSVP Management**: View submitted guest attendance confirmations and dietary restrictions.

---

## 🌐 Vercel Deployment Guide

Deploying to Vercel requires zero manual configuration:

### Option A: Using Vercel CLI (Fastest from Terminal)
You can deploy directly from your local terminal in 60 seconds:
```bash
# Install Vercel CLI globally or run via npx
npx vercel

# Follow prompts to link and deploy production
npx vercel --prod
```

### Option B: Using Git & Vercel Dashboard
1. Push your project repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository. Vercel automatically detects Next.js 16 and configures build commands (`next build`).
4. Click **Deploy**. Your custom domain SSL certificate, edge caching, and image optimization CDN will be automatically configured worldwide.

---

## ♿ Browser & Accessibility Compatibility

- **WCAG 2.1 AA Compliant**: High contrast ratios between charcoal text (`#22201E`) and warm ivory (`#FAF8F5`).
- **Keyboard Navigation**: Full focus visibility across interactive navigation links, category filters, lightbox slides, and forms.
- **Reduced Motion Support**: Animations gracefully respect OS-level `prefers-reduced-motion` settings.
- **Browser Support**: Fully tested across Chrome, Safari, Firefox, Edge, and iOS/Android Safari WebKit engines.
