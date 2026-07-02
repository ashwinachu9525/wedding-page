export interface CoupleInfo {
  names: string;
  firstNames: {
    partner1: string;
    partner2: string;
  };
  fullNames: {
    partner1: string;
    partner2: string;
  };
  weddingDateISO: string;
  weddingDateDisplay: string;
  weddingTimeDisplay: string;
  locationDisplay: string;
  hashtag: string;
  headline: string;
  welcomeMessage: string;
  heroVideoUrl: string;
  heroFallbackImage: string;
}

export interface StoryTimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  location?: string;
}

export interface WeddingEventDetail {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venueName: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  dressCode: string;
  description: string;
  featured?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  category: "ceremony" | "engagement" | "portraits" | "reception" | "sangeet" | "mehendi" | string;
  blurDataURL?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AccommodationOption {
  name: string;
  distance: string;
  description: string;
  bookingLink: string;
  phone?: string;
  promoCode?: string;
}

export interface RSVPFormData {
  fullName: string;
  email: string;
  attending: "yes" | "no";
  guestCount: number;
  guestNames?: string;
  dietaryRequirements?: string;
  songRequest?: string;
  message?: string;
}
