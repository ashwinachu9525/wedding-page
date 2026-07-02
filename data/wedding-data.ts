import {
  CoupleInfo,
  StoryTimelineItem,
  WeddingEventDetail,
  GalleryImage,
  FAQItem,
  AccommodationOption,
} from "@/types/wedding";

export const coupleInfo: CoupleInfo = {
  names: "Aswin K & Annapoorna",
  firstNames: {
    partner1: "Aswin K",
    partner2: "Annapoorna",
  },
  fullNames: {
    partner1: "Aswin K",
    partner2: "Annapoorna",
  },
  weddingDateISO: "2026-10-18T09:30:00.000Z",
  weddingDateDisplay: "October 18, 2026",
  weddingTimeDisplay: "9:30 AM IST",
  locationDisplay: "Bangalore, India",
  hashtag: "#AswinWedsAnnapoorna",
  headline: "Two Souls, One Sacred Journey",
  welcomeMessage:
    "We joyfully invite you to join us in the garden city of Bangalore as we celebrate our love, exchange our sacred vows amidst royal Indian heritage, and begin our greatest adventure surrounded by those we cherish most.",
  heroVideoUrl:
    "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-and-walking-in-nature-41527-large.mp4",
  heroFallbackImage:
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=80",
};

export const storyTimeline: StoryTimelineItem[] = [
  {
    id: "first-encounter",
    date: "Autumn 2021",
    title: "A Monsoon Evening on Church Street",
    description:
      "On a breezy October evening in Bangalore’s vibrant Church Street, a sudden shower led to a shared umbrella and an unforgettable conversation over South Indian filter coffee that lasted hours into the night.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
    location: "Bangalore, India",
  },
  {
    id: "building-dreams",
    date: "Summer 2022",
    title: "Between Tech Hubs & Heritage Gardens",
    description:
      "Between Aswin’s innovative architectural commissions and Annapoorna’s artistic curation across the city, our bond deepened through weekend strolls in Cubbon Park, heritage art exhibitions, and starlit dinners.",
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80",
    location: "Bangalore & Mysore",
  },
  {
    id: "the-proposal",
    date: "December 2024",
    title: "Sunrise at Nandi Hills",
    description:
      "Overlooking the mist-covered valleys of Nandi Hills at dawn, surrounded by golden morning sunlight breaking across the horizon, Aswin knelt to ask the easiest question of their lives. Without hesitation, Annapoorna said yes.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
    location: "Nandi Hills, Bangalore",
  },
  {
    id: "the-next-chapter",
    date: "October 2026",
    title: "Forever Begins at The Leela Palace",
    description:
      "Now, five years after that rainy evening on Church Street, we gather with our beloved family and closest friends to make our eternal promise amidst the timeless elegance of Bangalore.",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
    location: "Bangalore, India",
  },
];

export const weddingEvents: WeddingEventDetail[] = [
  {
    id: "mehendi-sangeet",
    title: "Mehendi & Sangeet Soirée",
    subtitle: "Music, Dance & Vibrant Henna Celebrations",
    date: "Saturday, October 17, 2026",
    time: "5:30 PM – 11:00 PM",
    venueName: "The Tamarind Tree Heritage Gardens",
    address: "88, Avalahalli, Anjanapura Post, JP Nagar 9th Phase",
    city: "Bangalore, KA 560062, India",
    googleMapsUrl: "https://maps.google.com/?q=The+Tamarind+Tree+Bangalore",
    dressCode: "Festive Indian / Indo-Western (Lehengas, Kurtas, Vibrant Silks)",
    description:
      "Join us under centuries-old banyan trees and traditional stone pavilions for an enchanting evening of henna artistry, folk melodies, Sufi music, and high-energy dance performances.",
    featured: false,
  },
  {
    id: "ceremony",
    title: "Sacred Muhurtham",
    subtitle: "Traditional South Indian Wedding Ceremony",
    date: "Sunday, October 18, 2026",
    time: "9:30 AM – 1:00 PM",
    venueName: "The Leela Palace Bangalore — Royal Ballroom",
    address: "23, Old Airport Road, Kodihalli",
    city: "Bangalore, KA 560008, India",
    googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+Bangalore",
    dressCode: "Traditional Indian / Kanjeevaram Silks & Ethnic Formal",
    description:
      "Witness our sacred vows amidst an opulent floral mandap accompanied by traditional Nadaswaram melodies and Vedic chants, followed by an authentic plantain leaf grand feast (Elai Sappadu).",
    featured: true,
  },
  {
    id: "reception",
    title: "The Grand Reception Gala",
    subtitle: "Starry Night Celebration & Banquet",
    date: "Sunday, October 18, 2026",
    time: "7:00 PM – 11:30 PM",
    venueName: "Bangalore Palace Grounds — Royal Canopy",
    address: "Vasanth Nagar, Near Mount Carmel College",
    city: "Bangalore, KA 560052, India",
    googleMapsUrl: "https://maps.google.com/?q=Bangalore+Palace+Grounds",
    dressCode: "Formal Evening Wear / Sherwanis & Designer Gowns",
    description:
      "Celebrate our union under majestic illuminated canopies at the historic Bangalore Palace Grounds with a multi-cuisine global banquet, live orchestral band, and heartfelt toasts.",
    featured: true,
  },
  {
    id: "farewell-brunch",
    title: "Farewell Champagne Brunch",
    subtitle: "Relaxed Conversations & South Indian Delicacies",
    date: "Monday, October 19, 2026",
    time: "11:00 AM – 2:30 PM",
    venueName: "ITC Gardenia — Rooftop Pavilion",
    address: "1, Residency Road",
    city: "Bangalore, KA 560025, India",
    googleMapsUrl: "https://maps.google.com/?q=ITC+Gardenia+Bangalore",
    dressCode: "Smart Casual / Garden Resort Wear",
    description:
      "Before departing, join us for a leisurely rooftop brunch featuring artisan South Indian breakfast classics, fresh tropical juices, and specialty filter coffee as we wrap up our magical weekend.",
    featured: false,
  },
];

export const galleryPhotos: GalleryImage[] = [
  {
    id: "photo-1",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    alt: "Aswin K and Annapoorna walking through heritage gardens in Bangalore",
    width: 1200,
    height: 800,
    category: "engagement",
    caption: "Quiet mornings in the garden city of Bangalore",
  },
  {
    id: "photo-2",
    src: "https://images.unsplash.com/photo-1519225336804-91fe9588a0c4?auto=format&fit=crop&w=800&q=80",
    alt: "Intimate portrait overlooking Bangalore palace courtyards",
    width: 800,
    height: 1200,
    category: "portraits",
    caption: "Golden hour glow across royal architecture",
  },
  {
    id: "photo-3",
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
    alt: "Opulent floral decor and brass lamps setting for Muhurtham",
    width: 1200,
    height: 800,
    category: "ceremony",
    caption: "Traditional marigold and jasmine mandap inspiration",
  },
  {
    id: "photo-4",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    alt: "Couple laughing during stroll along stone pillars",
    width: 800,
    height: 1000,
    category: "portraits",
    caption: "Serene moments before the grand celebration",
  },
  {
    id: "photo-5",
    src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80",
    alt: "Vibrant henna mehendi designs and festive evening lights",
    width: 1000,
    height: 1000,
    category: "mehendi",
    caption: "Intricate henna patterns celebrating auspicious beginnings",
  },
  {
    id: "photo-6",
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    alt: "Joyful celebration and dance during Sangeet evening",
    width: 1200,
    height: 800,
    category: "sangeet",
    caption: "Music, rhythms, and joy under starlit banyan trees",
  },
  {
    id: "photo-7",
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    alt: "Bride in traditional Kanjeevaram silk saree and temple jewellery",
    width: 800,
    height: 1100,
    category: "ceremony",
    caption: "Timeless South Indian bridal elegance",
  },
  {
    id: "photo-8",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    alt: "Illuminated banquet tablescape at Bangalore Palace grounds",
    width: 1200,
    height: 750,
    category: "reception",
    caption: "Royal banquet setting awaiting our cherished guests",
  },
];

export const accommodations: AccommodationOption[] = [
  {
    name: "The Leela Palace Bangalore",
    distance: "On-site for Ceremony / 15 mins to Reception",
    description:
      "An architectural masterpiece inspired by the royal Mysore Palace, surrounded by cascading waterfalls and lush gardens.",
    bookingLink: "https://www.theleela.com/the-leela-palace-bengaluru",
    promoCode: "ASWIN2026",
  },
  {
    name: "ITC Gardenia, Bangalore",
    distance: "15 mins from Palace Grounds in central Bangalore",
    description:
      "A luxury green hotel inspired by the garden city with open-air pavilions and award-winning dining.",
    bookingLink: "https://www.itchotels.com/in/en/itcgardenia-bengaluru",
    promoCode: "ASWIN2026",
  },
  {
    name: "Taj West End, Bangalore",
    distance: "10 mins from Palace Grounds / Race Course Road",
    description:
      "A legendary 20-acre sanctuary of colonial charm, ancient trees, and peaceful luxury right in the heart of Bangalore.",
    bookingLink: "https://www.tajhotels.com/en-in/taj/taj-west-end-bengaluru/",
    promoCode: "ASWIN2026",
  },
];

export const faqs: FAQItem[] = [
  {
    question: "When should I RSVP by?",
    answer:
      "Please kindly confirm your attendance by July 1, 2026, using the online RSVP form on this website so we may finalize arrangements for our banquet feasts.",
  },
  {
    question: "How do I travel to the wedding venues in Bangalore?",
    answer:
      "We recommend flying into Kempegowda International Airport Bangalore (BLR), which is about 45-60 minutes by airport taxi (Uber/Ola/BluSmart) to central hotel locations. Dedicated shuttle arrangements will be provided between partner hotels and ceremony venues.",
  },
  {
    question: "What is the dress code for each ceremony?",
    answer:
      "For Saturday's Mehendi & Sangeet, festive Indian wear (colorful Lehengas, Kurtas, Nehrus) is recommended. For Sunday morning's Muhurtham ceremony, traditional South Indian attire (Silks, Sarees, Veshtis/Dhotis or formal suits) is requested. For the evening Reception Gala, formal evening wear (Sherwanis or formal gowns/suits).",
  },
  {
    question: "Can I bring plus ones or children?",
    answer:
      "We warmly welcome invited family members and children mentioned on your formal invitation. Please indicate the total number of guests attending when completing your online RSVP.",
  },
  {
    question: "What weather can we expect in Bangalore in October?",
    answer:
      "Bangalore enjoys pleasant, crisp weather in October, with daytime temperatures around 26°C (79°F) and cool evenings around 19°C (66°F). Light shawls or jackets are recommended for evening outdoor celebrations.",
  },
];
