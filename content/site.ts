export const site = {
  url: "https://portifolio-kjf4.vercel.app/",
  title: "Matheus Castilho — Software Developer",
  description:
    "Brazilian software developer in Ireland building fast, playful web experiences — and the occasional algorithm you can play with.",
  locale: "en_IE",

  name: "Matheus Vinicios de Castilho",
  shortName: "Matheus",
  lastName: "Castilho",
  tagline: "I build things for the web — with logic you can see.",
  role: "Full-stack Developer",
  location: "Dublin, Ireland · from Santa Catarina, Brazil",
  timezone: "Europe/Dublin",
  status: "Open to new opportunities",
  email: "matheusvcastilho@gmail.com",
  resumeUrl: "/cv.pdf",
  avatar: "/images/me.jpg",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Algorithms",
  ],

  nav: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Lab", href: "/lab" },
    { label: "Contact", href: "/contact" },
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/CastilhoMatheus" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/matheuscastilho/" },
    { label: "Email", href: "mailto:matheusvcastilho@gmail.com" },
  ],
} as const;
