export type HelpTopic = {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or plain text instructions
  videoUrl?: string; // YouTube embed URL (e.g. https://www.youtube.com/embed/...)
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "connect-whatsapp",
    title: "How to Connect WhatsApp",
    description: "Learn how to link your WhatsApp account to send automated invitations and receive RSVP alerts directly.",
    content: "1. Navigate to your Admin Dashboard (`/admin`).\n2. Click on the **WhatsApp Invite Studio** tab.\n3. Follow the instructions to scan the QR code using your WhatsApp Mobile App (Linked Devices).\n4. Once connected, your session will be marked as active and ready to broadcast messages.",
     // Placeholder for demo
  },
  {
    id: "create-dynamic-link",
    title: "How to Create a Dynamic Invitation Link",
    description: "Step-by-step guide to generating a unique, personalized URL for your guests.",
    content: "1. Go to your Admin Dashboard.\n2. Pick one of the 12 luxury card themes.\n3. Customize the couple names or guest names.\n4. Generate the SEO-friendly URL slug (e.g., `/invite/rahul-priya-2026`)."
  },
  {
    id: "custom-domain",
    title: "Can I host my wedding site on a custom domain?",
    description: "Instructions on linking a custom URL like myroyalwedding.com to your invitation.",
    content: "Yes! When deployed on Vercel, simply enter your custom domain in the platform's domain configuration setting box. When you click send on WhatsApp, it automatically formats your exact live domain."
  },
  {
    id: "whatsapp-invite-tutorial",
    title: "Create Custom WhatsApp Wedding Invites in Minutes with VivahaLuxe!",
    description: "Welcome to VivahaLuxe! 💍 In this quick tutorial, we demonstrate how easy it is to create and send stunning, personalized digital wedding invitations to your guests directly via WhatsApp.Skip the manual typing and let our platform do the heavy lifting! Watch how you can effortlessly select royal themes, input guest details, and generate customized WhatsApp messages with unique, dynamic invitation links in just a few clicks.",
    content: "Yes! When deployed on Vercel, simply enter your custom domain in the platform's domain configuration setting box. When you click send on WhatsApp, it automatically formats your exact live domain.",
    videoUrl: "https://www.youtube.com/embed/F_N3T2V7xxc"

  },
  {
    id: "manage-rsvps",
    title: "How to Manage Guest RSVPs",
    description: "Learn how to track who is attending, their dietary requirements, and meal preferences.",
    content: "All RSVPs are automatically stored in the database. Go to your Admin Dashboard and click on the **RSVPs** tab to view the live list, export it to CSV, or get a summarized count of attendees."
  }
];
