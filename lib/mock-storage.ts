export interface InvitationData {
  id: string;
  slug: string;
  title: string;
  coupleNames: string;
  brideDetails?: string;
  groomDetails?: string;
  weddingDate: string;
  weddingDateDisplay: string;
  venueName: string;
  venueAddress?: string;
  mapUrl?: string;
  story: string;
  theme: string;
  fontStyle?: string;
  musicUrl?: string;
  heroBgType?: "image" | "video";
  heroBgUrl?: string;
  timelineJson?: string;
  faqJson?: string;
  isPublished: boolean;
  viewCount: number;
  eventsJson: string;
  galleryJson: string;
  isProUser?: boolean;
  enableAccommodations?: boolean;
  accommodationsTitle?: string;
  splitCoupleNames?: boolean;
}

const DEFAULT_INVITATIONS: InvitationData[] = [
  {
    id: "inv-1",
    slug: "rahul-priya-2026",
    title: "The Royal Wedding Celebration",
    coupleNames: "Rahul Sharma & Priya Mehta",
    brideDetails: "Daughter of Sri K. Ramachandran & Smt. Lakshmi Devi",
    groomDetails: "Son of Sri V. Krishnan & Smt. Saraswathi",
    weddingDate: "2026-11-21T10:30:00",
    weddingDateDisplay: "November 21–22, 2026",
    venueName: "The Tamarind Tree & The Leela Palace",
    venueAddress: "Bangalore, Karnataka, India",
    mapUrl: "https://maps.google.com/?q=The+Tamarind+Tree+Bangalore",
    story: "Two paths crossed under the Bangalore skies, blossoming into a lifelong bond of love, laughter, and heritage.",
    theme: "alabaster",
    fontStyle: "cormorant_bickham",
    musicUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-136.mp3",
    heroBgType: "image",
    heroBgUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    timelineJson: JSON.stringify([
      { date: "June 2023", title: "First Glance at Lalbagh", desc: "A chance meeting under the ancient botanical trees sparked endless coffee conversations." },
      { date: "December 2024", title: "The Nandi Hills Proposal", desc: "With the sunrise painting the clouds gold, the magical question was asked and answered with joyful tears." },
      { date: "August 2025", title: "Traditional Ring Ceremony", desc: "Blessed by our elders and families in a sacred South Indian engagement gala." },
    ]),
    faqJson: JSON.stringify([
      { q: "What is the dress code?", a: "Traditional Indian ethnic or formal western attire. We encourage bright celebration colors!" },
      { q: "Is valet parking available?", a: "Yes, complimentary valet parking is provided at both The Tamarind Tree and The Leela Palace." },
      { q: "What accommodations are recommended?", a: "We have partnered with partner luxury boutique hotels near Bangalore South. Contact family for block discounts." },
    ]),
    isPublished: true,
    viewCount: 342,
    eventsJson: JSON.stringify([
      { name: "Haldi & Mehendi", time: "Nov 20, 4:00 PM", venue: "Tamarind Tree Gardens", desc: "An afternoon of vibrant yellow hues, marigold blossoms, and soulful folk music." },
      { name: "Muhurtham Ceremony", time: "Nov 21, 9:30 AM", venue: "Tamarind Tree Main Hall", desc: "The sacred royal tying of the Thali under traditional Vedic chants and Nadaswaram melodies." },
      { name: "Grand Reception Gala", time: "Nov 22, 7:00 PM", venue: "The Leela Palace Ballroom", desc: "An enchanting black-tie evening of champagne toasts, live classical orchestra, and royal feast." },
    ]),
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    ]),
  },
  {
    id: "inv-2",
    slug: "rahul-anjali",
    title: "Midnight Velvet Royal Union",
    coupleNames: "Rahul Sharma & Anjali Mehta",
    brideDetails: "Daughter of Dr. Rajesh Mehta & Smt. Sunita Mehta",
    groomDetails: "Son of Sri Suresh Sharma & Smt. Anita Sharma",
    weddingDate: "2026-12-14T18:00:00",
    weddingDateDisplay: "December 14–15, 2026",
    venueName: "Umaid Bhawan Palace & Rambagh Palace",
    venueAddress: "Jaipur, Rajasthan, India",
    mapUrl: "https://maps.google.com/?q=Rambagh+Palace+Jaipur",
    story: "From college best friends to soulful life partners, our journey is filled with laughter, adventures, and unconditional devotion under the royal stars of Jaipur.",
    theme: "velvet",
    musicUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-136.mp3",
    heroBgType: "image",
    heroBgUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
    timelineJson: JSON.stringify([
      { date: "August 2022", title: "Jaipur Literature Festival", desc: "Our shared passion for poetry brought us together under the pink city arches." },
      { date: "October 2024", title: "Sunset Proposal at Amber Fort", desc: "Surrounded by historic palacial lanterns and timeless royalty." },
    ]),
    faqJson: JSON.stringify([
      { q: "What is the weather like in December?", a: "Jaipur in December is cool and pleasant (15°C to 24°C). Light shawls or bandhgalas are recommended for evening events." },
    ]),
    isPublished: true,
    viewCount: 189,
    eventsJson: JSON.stringify([
      { name: "Sufi Sangeet & Cocktail Gala", time: "Dec 14, 7:30 PM", venue: "Umaid Bhawan Gardens", desc: "High-energy dance performances and Sufi melodies under the stars." },
      { name: "Royal Pheras & Muhurtham", time: "Dec 15, 10:00 AM", venue: "Rambagh Palace Courtyard", desc: "The traditional seven steps around the holy fire." },
    ]),
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2070&auto=format&fit=crop",
    ]),
  },
  {
    id: "inv-3",
    slug: "vikram-pooja",
    title: "Heritage Emerald Lakeside Union",
    coupleNames: "Vikram Rao & Pooja Nair",
    brideDetails: "Daughter of Col. G. Nair & Smt. Bhavani Nair",
    groomDetails: "Son of Justice M. Rao & Smt. Revathi Rao",
    weddingDate: "2027-01-18T10:00:00",
    weddingDateDisplay: "January 18–19, 2027",
    venueName: "Taj Lake Palace & City Palace Courtyard",
    venueAddress: "Udaipur, Rajasthan, India",
    mapUrl: "https://maps.google.com/?q=Taj+Lake+Palace+Udaipur",
    story: "A serene lakeside romance that blossomed amidst architecture, heritage music, and lifelong mutual respect.",
    theme: "emerald",
    musicUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-136.mp3",
    heroBgType: "image",
    heroBgUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2070&auto=format&fit=crop",
    timelineJson: JSON.stringify([
      { date: "January 2024", title: "Meeting by Pichola Lake", desc: "A boat ride during sunset that sparked a deep connection." },
      { date: "November 2025", title: "Royal Ring Blessing", desc: "Surrounded by family and lakefront fireworks." },
    ]),
    faqJson: JSON.stringify([
      { q: "How do we reach the island palace?", a: "Private luxury boats run continuously from the mainland jetty for all invited guests." },
    ]),
    isPublished: true,
    viewCount: 210,
    eventsJson: JSON.stringify([
      { name: "Lakeside Mehendi Carnival", time: "Jan 18, 3:30 PM", venue: "City Palace Terraces", desc: "Folk dancers, henna artistry, and sunset refreshments." },
      { name: "Sacred Vedic Nuptials", time: "Jan 19, 10:00 AM", venue: "Taj Lake Palace Mandap", desc: "Holy vows exchanged amidst serene waters and flute symphonies." },
    ]),
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1545232972-9bb88a5b6dcc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop",
    ]),
  },
  {
    id: "inv-4",
    slug: "sneha-arjun",
    title: "Jaipur Rose Blossom Symphony",
    coupleNames: "Sneha Kapoor & Arjun Verma",
    brideDetails: "Daughter of Sri P. Kapoor & Smt. Meenakshi Kapoor",
    groomDetails: "Son of Dr. S. Verma & Smt. Ritu Verma",
    weddingDate: "2027-02-14T17:00:00",
    weddingDateDisplay: "February 14, 2027",
    venueName: "The Oberoi Amarvilas Gardens",
    venueAddress: "Agra, Uttar Pradesh, India",
    mapUrl: "https://maps.google.com/?q=Oberoi+Amarvilas+Agra",
    story: "Woven together with threads of poetry, floral art, and unwavering companionship.",
    theme: "rose",
    musicUrl: "https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-136.mp3",
    heroBgType: "image",
    heroBgUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1974&auto=format&fit=crop",
    timelineJson: JSON.stringify([
      { date: "February 2023", title: "First Rose Day", desc: "A bouquet of pink roses that started our story." },
    ]),
    faqJson: JSON.stringify([
      { q: "What is the theme color?", a: "Blush pink, ivory, and soft gold hues." },
    ]),
    isPublished: true,
    viewCount: 175,
    eventsJson: JSON.stringify([
      { name: "Rose Garden Vows", time: "Feb 14, 5:00 PM", venue: "Amarvilas Fountain Courtyard", desc: "Sunset vows followed by harp music and starlit dinner." },
    ]),
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
    ]),
  },
];

const memoryInvitations = [...DEFAULT_INVITATIONS];

export function getInvitationBySlug(slug: string): InvitationData | null {
  const cleanSlug = slug.toLowerCase().trim();
  return memoryInvitations.find((i) => i.slug.toLowerCase() === cleanSlug) || null;
}

export function getAllInvitations(): InvitationData[] {
  return memoryInvitations;
}

export function saveOrUpdateInvitation(data: Partial<InvitationData> & { slug: string }): InvitationData {
  const existingIndex = memoryInvitations.findIndex((i) => i.slug.toLowerCase() === data.slug.toLowerCase());
  if (existingIndex > -1) {
    memoryInvitations[existingIndex] = { ...memoryInvitations[existingIndex], ...data };
    return memoryInvitations[existingIndex];
  } else {
    const newInv: InvitationData = {
      id: `inv-${Date.now()}`,
      slug: data.slug,
      title: data.title || "The Royal Wedding Celebration",
      coupleNames: data.coupleNames || "New Couple",
      brideDetails: data.brideDetails || "Bride Family Details",
      groomDetails: data.groomDetails || "Groom Family Details",
      weddingDate: data.weddingDate || new Date().toISOString(),
      weddingDateDisplay: data.weddingDateDisplay || "December 2026",
      venueName: data.venueName || "Grand Palace Banquet",
      venueAddress: data.venueAddress || "India",
      mapUrl: data.mapUrl || "https://maps.google.com",
      story: data.story || "A beautiful celebration of love and togetherness.",
      theme: data.theme || "alabaster",
      fontStyle: data.fontStyle || "cormorant_bickham",
      musicUrl: data.musicUrl || "",
      heroBgType: data.heroBgType || "image",
      heroBgUrl: data.heroBgUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
      timelineJson: data.timelineJson || "[]",
      faqJson: data.faqJson || "[]",
      isPublished: true,
      viewCount: 1,
      eventsJson: data.eventsJson || "[]",
      galleryJson: data.galleryJson || "[]",
      enableAccommodations: data.enableAccommodations !== undefined ? data.enableAccommodations : true,
      accommodationsTitle: data.accommodationsTitle || "Accommodations & Venue Directions",
      splitCoupleNames: Boolean(data.splitCoupleNames),
    };
    memoryInvitations.push(newInv);
    return newInv;
  }
}
