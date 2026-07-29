/**
 * CONSOLIDATED DATA MODULE - Single Source of Truth
 * Replaces: data.js, portfolio-data.js, tactical-data.js
 * All portfolio data unified here with proper exports
 */

// ===== PROFILE INFO =====
export const PROFILE_INFO = {
  name: 'Sajid Islam',
  role: 'Product & Data Professional',
  heroText: 'A Product & Data professional with a background in Computer Science, passionate about building products, automating workflows, and solving business problems with technology. Specializing in Data Analytics, AI/ML, and Process Automation.',
  photo: 'img/profile.jpg',
  email: 'sajid.islam.chowdhury@gmail.com',
  whatsapp: '+880 182 452 6054',
  telegram: 'https://t.me/+8801824526054',
  github: 'https://github.com/Sajid-ul-Islam',
  linkedin: 'https://www.linkedin.com/in/sajidislamchowdhury/',
  huggingface: 'https://huggingface.co/Sajid-ul-Islam',
  kaggle: 'https://www.kaggle.com/saajiidi'
};

// ===== EDUCATION =====
export const EDUCATION = [
  {
    id: 'edu-1',
    institution: 'Academy of Business Professionals',
    degree: 'PGD - Data Science & Business Analytics',
    date: '2025',
    location: 'Dhaka, BD'
  },
  {
    id: 'edu-2',
    institution: 'North South University',
    degree: 'BSc - Computer Science & Engineering',
    date: '2019',
    location: 'Dhaka, BD'
  },
  {
    id: 'edu-3',
    institution: 'BAF Shaheen College Dhaka',
    degree: 'Higher Secondary Certificate (HSC) (Science)',
    date: '2013',
    location: 'Science Division'
  },
  {
    id: 'edu-4',
    institution: 'Uttara High School & College',
    degree: 'Secondary School Certificate (SSC) (Science)',
    date: '2011',
    location: 'Science Division'
  }
];

// ===== EXPERIENCES =====
export const EXPERIENCES = [
  {
    id: 'deencommerce',
    title: 'Business Analyst',
    company: 'Deen Commerce',
    location: 'Mirpur, Dhaka',
    startDate: 'June 2025',
    current: true,
    description: 'Leading Business Strategy and CRM growth through granular performance tracking. Architecting weekly performance dashboards.',
    highlights: [
      'CRM Improvisation',
      'Business Strategy',
      'Architecting weekly performance dashboards for stakeholder reporting'
    ],
    technologies: ['CRM', 'Business Analysis', 'Strategy']
  },
  {
    id: 'gearmaster',
    title: 'Co-Founder',
    company: 'Gear Master',
    location: 'Dhaka, BD',
    startDate: 'Jun 2024',
    current: true,
    description: 'Leading Business Operations for bike accessories retail. Managing inventory and multi-channel engagement.',
    highlights: [
      'Leading Business Operations for a bike accessories retail startup',
      'Managing inventory, sales growth strategies, and multi-channel customer engagement'
    ],
    technologies: ['Retail', 'Business Management']
  },
  {
    id: 'nztex',
    title: 'IT Executive',
    company: 'NZ TEX GROUP',
    location: 'Rupganj, Narayanganj',
    startDate: 'Feb 2024',
    endDate: 'May 2024',
    description: 'Collaborated with the Research & Development Team to enhance product innovation. Delivered impactful presentations and reports to authorities and buyers.',
    highlights: [
      'Collaborated with the Research & Development Team to enhance product innovation',
      'Delivered impactful presentations and reports to authorities and buyers, enhancing stakeholder engagement'
    ],
    technologies: ['IT Support', 'R&D', 'Reporting']
  },
  {
    id: 'thrivingskills',
    title: 'Associate – Online Sales & Customer Supports',
    company: 'Thriving Skills',
    location: 'Gulshan, Dhaka',
    startDate: 'Oct 2023',
    endDate: 'Jan 2024',
    description: 'Conducted business and marketplace analysis; executed targeted sales strategies to increase customer loyalty and engagement.',
    highlights: [
      'Conducted comprehensive business and marketplace analysis, identifying opportunities that increased sales',
      'Designed and executed targeted sales strategies, resulting in a significant increase in customer loyalty and engagement',
      'Managed CRM systems to improve customer retention'
    ],
    technologies: ['Market Analysis', 'CRM', 'Sales Strategy']
  },
  {
    id: 'daraz',
    title: 'Jr. Executive – Marketplace',
    company: 'Daraz Bangladesh Ltd.',
    location: 'Banani, Dhaka',
    startDate: 'Jan 2020',
    endDate: 'Jan 2022',
    description: 'Increased partner acquisitions by 50% through targeted outreach strategies. Managed key accounts and increased client satisfaction by 20%.',
    highlights: [
      'Drove a 50% increase in partner acquisitions by implementing targeted outreach strategies and enhancing brand visibility',
      'Led successful campaigns and managed key accounts, increasing client satisfaction by 20% and driving revenue growth',
      'Optimized Marketplace Health through vendor performance tracking'
    ],
    technologies: ['Marketplace', 'Acquisition', 'Account Management']
  },
  {
    id: 'hungrynaki',
    title: 'Associate – Home Kitchen & Street Food',
    company: 'HungryNaki (Sister concern of Daraz)',
    location: 'Banani, Dhaka',
    startDate: 'Jul 2021',
    endDate: 'Jan 2022',
    description: 'Identified 15% growth opportunities through in-depth marketplace analysis. Spearheaded partner acquisition initiatives, increasing the network by 25%.',
    highlights: [
      'Conducted in-depth business and marketplace analysis, identifying 15% growth opportunities that increased revenue',
      'Spearheaded brand and partner acquisition initiatives, increasing partner network by 25%',
      'Leveraged BI tools to identify hyper-local food trends'
    ],
    technologies: ['Business Analysis', 'Growth Strategy', 'BI Tools']
  }
];

// ===== PROJECTS =====
export const PROJECTS = [
  {
    id: 'deakho',
    title: 'Deakho — Live TV & Entertainment Platform',
    description: 'A modern Live TV & Entertainment streaming platform featuring a Telegram Mini App for channel browsing, scheduling, and notifications. Built with React, TypeScript, and Node.js.',
    image: '/img/projects/streamlit-hub.png',
    liveUrl: 'https://deakho.vercel.app/',
    telegramUrl: 'https://t.me/deakhoBot',
    githubUrl: 'https://github.com/Sajid-ul-Islam/Deakho',
    featured: true,
    technologies: ['React', 'TypeScript', 'Node.js', 'Telegram Mini App', 'Vercel'],
    category: 'web-app',
    caseStudy: {
      role: 'Full-Stack Developer & Architect',
      timeline: '2025',
      problem: 'Users needed a seamless way to browse live TV channels, schedules, and receive notifications — all within their messaging platform.',
      solution: 'Built a cross-platform live TV & entertainment platform with a Telegram Mini App frontend, enabling channel discovery, scheduling, and real-time notifications.',
      impact: [
        'Provided instant access to live TV channels via Telegram.',
        'Delivered an intuitive Mini App interface for browsing and scheduling.'
      ],
      metrics: [
        { label: 'Platform', value: 'Web + Telegram' },
        { label: 'Tech Stack', value: 'React / TypeScript / Node.js' }
      ]
    }
  },
  {
    id: 'desco-bot',
    title: 'DESCO Electricity Usage Assistant Bot',
    description: 'An interactive Telegram chatbot assistant engineered for DESCO electricity subscribers to track, monitor, and query electricity usage, account details, and billing intel.',
    image: '/img/projects/streamlit-hub.png',
    liveUrl: 'https://t.me/descoTGbot',
    githubUrl: 'https://github.com/Sajid-ul-Islam/descoiunfobot',
    featured: true,
    technologies: ['Python', 'Telegram API', 'Automation', 'Chatbot'],
    category: 'automation',
    caseStudy: {
      role: 'Developer & Architect',
      timeline: '2025',
      problem: 'DESCO electricity subscribers required a fast, automated interface to check real-time electricity usage and account info.',
      solution: 'Engineered an interactive Telegram chatbot (@descoTGbot) providing automated electricity usage queries and utility assistance.',
      impact: [
        'Automated query handling for DESCO electricity account metrics.',
        'Simplified electricity usage check-ups via instant messaging.'
      ],
      metrics: [
        { label: 'Bot Handle', value: '@descoTGbot' },
        { label: 'Tech Stack', value: 'Python / Telegram API' }
      ]
    }
  },
  {
    id: 'deen-commerce-bot',
    title: 'DEEN Commerce Telegram Bot',
    description: 'An automated WooCommerce Telegram bot integration engineered for real-time e-commerce order notifications, store management alerts, and operational workflows.',
    image: '/img/projects/streamlit-hub.png',
    liveUrl: 'https://github.com/Sajid-ul-Islam/woocom_telegram_bot',
    githubUrl: 'https://github.com/Sajid-ul-Islam/woocom_telegram_bot',
    featured: true,
    technologies: ['Python', 'Telegram API', 'WooCommerce', 'E-Commerce', 'Automation'],
    category: 'automation',
    caseStudy: {
      role: 'Developer & Integrator',
      timeline: '2025',
      problem: 'E-commerce store operators needed real-time notifications and store status alerts inside daily communication tools.',
      solution: 'Created a specialized WooCommerce Telegram bot bridging e-commerce store events with instant Telegram notifications.',
      impact: [
        'Streamlined store order tracking and operational alerts.',
        'Reduced response times for store management events.'
      ],
      metrics: [
        { label: 'Platform', value: 'WooCommerce' },
        { label: 'Tech Stack', value: 'Python / Telegram API' }
      ]
    }
  },
  {
    id: 'streamlit-hub',
    title: 'Streamlit Prototype Projects',
    description: 'A centralized prototype command center for 10+ operational data apps, including inventory trackers, sales dashboards, and automation tools.',
    image: '/img/projects/streamlit-hub.png',
    liveUrl: 'https://share.streamlit.io/user/saajiidi',
    featured: true,
    technologies: ['Python', 'Streamlit', 'Automation', 'Data Ops'],
    category: 'automation',
    caseStudy: {
      role: 'Solutions Architect & Builder',
      timeline: '2024 - 2025',
      problem: 'Operational tools and client trackers were scattered, causing high latency in access.',
      solution: 'Developed a centralized Streamlit App Hub to catalog and launch 10+ data-ops utilities from a single interface.',
      impact: [
        'Reduced application access latency by 50%.',
        'Standardized data access patterns for operational business analytics.'
      ],
      metrics: [
        { label: 'Apps Hosted', value: '10+' },
        { label: 'Tech Stack', value: 'Python / Streamlit' }
      ]
    }
  },
  {
    id: 'huggingface-space',
    title: 'Hugging Face Space (EconVision)',
    description: 'An interactive Hugging Face Space focused on global economic analytics, visual comparisons, and macro-trend index insights.',
    image: '/img/projects/gdp-debt.png',
    liveUrl: 'https://huggingface.co/spaces/Sajid-ul-Islam/Global-Economical-Analytics',
    featured: true,
    technologies: ['Python', 'Hugging Face', 'Spaces', 'Streamlit', 'Data Visualization'],
    category: 'bi-viz',
    caseStudy: {
      role: 'Data Scientist & Builder',
      timeline: '2024',
      problem: 'Comparing multiple macroeconomic index data series across countries required complex visual tooling.',
      solution: 'Built and hosted a specialized economic analytics Space on Hugging Face using Streamlit/Gradio.',
      impact: [
        'Visualized global macroeconomic indicator correlations.',
        'Created a clean interface for index pattern discovery.'
      ],
      metrics: [
        { label: 'Hosting', value: 'Hugging Face' },
        { label: 'Domain', value: 'Macro-Economics' }
      ]
    }
  }
];

// ===== SKILL GROUPS =====
export const SKILL_GROUPS = [
  {
    name: 'Data Analytics & BI',
    skills: [
      { name: 'Python', category: 'Language', icon: 'fab fa-python', level: 90 },
      { name: 'SQL', category: 'Language', icon: 'fas fa-database', level: 88 },
      { name: 'Pandas', category: 'Data', icon: 'fas fa-table', level: 88 },
      { name: 'NumPy', category: 'Data', icon: 'fas fa-square-root-alt', level: 82 },
      { name: 'Plotly', category: 'Visualization', icon: 'fas fa-chart-line', level: 85 },
      { name: 'Dash', category: 'Visualization', icon: 'fas fa-tachometer-alt', level: 82 }
    ]
  },
  {
    name: 'AI & Machine Learning',
    skills: [
      { name: 'Scikit-learn', category: 'ML', icon: 'fas fa-brain', level: 80 },
      { name: 'LLMs', category: 'AI', icon: 'fas fa-robot', level: 78 },
      { name: 'RAG', category: 'AI', icon: 'fas fa-project-diagram', level: 75 },
      { name: 'AI Agents', category: 'AI', icon: 'fas fa-microchip', level: 72 }
    ]
  },
  {
    name: 'Development & Tools',
    skills: [
      { name: 'JavaScript', category: 'Language', icon: 'fab fa-js', level: 78 },
      { name: 'HTML/CSS', category: 'Web', icon: 'fab fa-html5', level: 85 },
      { name: 'Git/GitHub', category: 'DevOps', icon: 'fab fa-git-alt', level: 85 },
      { name: 'Docker', category: 'DevOps', icon: 'fab fa-docker', level: 72 },
      { name: 'Linux', category: 'OS', icon: 'fab fa-linux', level: 80 },
      { name: 'Flask', category: 'Framework', icon: 'fas fa-fire', level: 75 }
    ]
  },
  {
    name: 'Databases',
    skills: [
      { name: 'PostgreSQL', category: 'DB', icon: 'fas fa-database', level: 80 },
      { name: 'MySQL', category: 'DB', icon: 'fas fa-database', level: 78 },
      { name: 'SQLite', category: 'DB', icon: 'fas fa-database', level: 82 }
    ]
  }
];

// ===== BLOG POSTS =====
export const BLOG_POSTS = [
  {
    id: 'blog-1',
    title: 'Optimizing Retail BI: A Daraz Case Study',
    date: 'Oct 12, 2024',
    excerpt: 'Deep dive into how we increased partner acquisitions by 50% using automated funnel tracking.',
    tags: ['BI', 'Case Study', 'Growth'],
    url: 'https://www.linkedin.com/pulse/optimizing-retail-bi-daraz-case-study-sajid-islam/'
  },
  {
    id: 'blog-2',
    title: 'Python for Automation: Pinterest Scrapers',
    date: 'Sep 05, 2024',
    excerpt: 'Technical walkthrough of building mass-image downloaders for dataset creation.',
    tags: ['Python', 'Automation', 'NLP'],
    url: 'https://www.linkedin.com/pulse/python-automation-pinterest-scrapers-sajid-islam/'
  },
  {
    id: 'blog-3',
    title: 'Modern Dashboards: Beyond Aesthetics',
    date: 'Aug 20, 2024',
    excerpt: 'Why readability wins over flashy animations when building mission-critical tools.',
    tags: ['Data Viz', 'UI/UX', 'Analytics'],
    url: 'https://www.linkedin.com/pulse/modern-dashboards-beyond-aesthetics-sajid-islam/'
  }
];

// ===== LEARNING ITEMS =====
export const LEARNING_ITEMS = [
  { name: 'Large Language Models (LLMs)', category: 'AI', progress: 78 },
  { name: 'AI Agents & Agentic Workflows', category: 'AI', progress: 75 },
  { name: 'Retrieval-Augmented Generation (RAG)', category: 'AI', progress: 80 },
  { name: 'Product Analytics & Management', category: 'Product', progress: 70 },
  { name: 'Cloud Technologies', category: 'DevOps', progress: 65 },
  { name: 'System Design', category: 'Engineering', progress: 60 }
];

// ===== STATS =====
export const STATS = [
  { label: 'Years Experience', value: 4, suffix: '+', accent: false },
  { label: 'Projects Completed', value: 15, suffix: '+', accent: true },
  { label: 'Publications', value: 3, suffix: '+', accent: false },
  { label: 'Certifications', value: 10, suffix: '+', accent: false }
];

// ===== GAMING DATA =====
export const GAMING = {
  stats: [
    { label: 'HOURS_LOGGED', value: '2400+' },
    { label: 'STRATEGY_MASTERY', value: 'ELITE' },
    { label: 'SERVER_RANK', value: '#12' }
  ],
  favorites: [
    { name: 'Red Dead Redemption 2', category: 'Masterpiece' },
    { name: 'God of War Ragnarok', category: 'Storytelling' },
    { name: 'FC24 / FIFA', category: 'Competitive' },
    { name: 'Ghost of Tsushima', category: 'Visuals' }
  ]
};

// ===== FILE TREE =====
export const FILE_TREE = [
  {
    id: 'explorer',
    label: 'EXPLORER',
    isOpen: true,
    items: [
      { id: 'sajid-ul-islam-site', label: 'Sajid-ul-Islam.github.io', href: 'https://sajid-ul-islam.github.io/', icon: 'globe', extension: 'link' }
    ]
  },
  {
    id: 'portfolio',
    label: 'PORTFOLIO',
    isOpen: true,
    items: [
      { id: 'home', label: 'Welcome', href: '/', icon: 'home', extension: 'tsx' },
      { id: 'experience', label: 'Experience', href: '#experience', icon: 'briefcase', extension: 'tsx' },
      { id: 'skills', label: 'Skills', href: '#skills', icon: 'code', extension: 'json' },
      { id: 'projects', label: 'Projects', href: '#projects', icon: 'folder', extension: 'tsx' },
      { id: 'education', label: 'Education', href: '#education', icon: 'graduation-cap', extension: 'tsx' },
      { id: 'contact', label: 'Contact', href: '#contact', icon: 'mail', extension: 'tsx' },
    ],
  },
  {
    id: 'hobbies',
    label: 'HOBBIES',
    isOpen: false,
    items: [
      { id: 'favorites', label: 'Favorites', href: '#hobbies', icon: 'star', extension: 'tsx' },
      { id: 'gaming', label: 'Gaming', href: '#hobbies', icon: 'gamepad-2', extension: 'tsx' },
      { id: 'blogs', label: 'Blogs', href: '#blogs', icon: 'book-open', extension: 'md' },
    ],
  },
  {
    id: 'more',
    label: 'MORE',
    isOpen: false,
    items: [
      { id: 'learning', label: 'Learning', href: '#learning', icon: 'graduation-cap', extension: 'tsx' },
      { id: 'startup', label: 'Startup', href: '#projects', icon: 'rocket', extension: 'tsx' },
    ],
  },
];

// ===== SOCIAL LINKS =====
export const SOCIAL_LINKS = [
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/sajidislamchowdhury/', icon: 'linkedin', color: '#0077b5' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/Sajid-ul-Islam', icon: 'github', color: '#333333' },
  { id: 'whatsapp', name: 'WhatsApp', url: 'https://wa.me/+8801824526054?text=', icon: 'message-circle', color: '#25D366' },
  { id: 'telegram', name: 'Telegram', url: 'https://t.me/+8801824526054', icon: 'send', color: '#0088cc' },
  { id: 'resume', name: 'Resume', url: 'https://sajid-ul-islam.github.io/resume.html', icon: 'file-text', color: '#da552f' },
  { id: 'huggingface', name: 'Hugging Face', url: 'https://huggingface.co/Sajid-ul-Islam', icon: 'robot', color: '#FFD21E' },
];

// ===== AI BOT LOCAL INTEL =====
export const LOCAL_INTEL = {
  profile: `${PROFILE_INFO.name}. ${PROFILE_INFO.role} based in Dhaka. DataOps Lead at DEEN Commerce, ex-Daraz (Alibaba). Expert in strategic growth via BI & ML.`,
  experience: EXPERIENCES.map(exp => `${exp.title} @ ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'}) — ${exp.highlights?.[0] || exp.description}`),
  education: EDUCATION.map(edu => `${edu.degree} @ ${edu.institution} (${edu.date})`),
  skills: SKILL_GROUPS.flatMap(g => g.skills.map(s => s.name)).join(', '),
  projects: PROJECTS.map(p => `${p.title} — ${p.description}`),
  certifications: 'Data Science & Business Analytics (PGD), Python for Data Science, Power BI Desktop, SQL Fundamentals, Machine Learning Basics.',
  learning: LEARNING_ITEMS.map(l => `${l.name} — ${l.progress}% progress`),
  contact: {
    email: PROFILE_INFO.email,
    whatsapp: PROFILE_INFO.whatsapp,
    telegram: PROFILE_INFO.telegram,
    github: PROFILE_INFO.github,
    linkedin: PROFILE_INFO.linkedin,
    kaggle: PROFILE_INFO.kaggle,
    huggingface: PROFILE_INFO.huggingface
  },
  availability: 'Available for full-time roles, freelance projects, consulting, and collaboration. Open to remote and on-site opportunities in Dhaka.',
  gaming: `Favorite games: ${GAMING.favorites.map(g => g.name).join(', ')}. ${GAMING.stats[0]?.value || '2400+'} hours logged.`
};

// ===== BACKWARD COMPATIBILITY =====
// Maintain the DATA object for legacy code
export const DATA = {
  projects: PROJECTS,
  blogPosts: BLOG_POSTS,
  learningItems: LEARNING_ITEMS,
  gaming: GAMING,
  fileTreeData: FILE_TREE,
  socialLinks: SOCIAL_LINKS,
  skillGroups: SKILL_GROUPS,
  experiences: EXPERIENCES,
  stats: STATS
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

// ===== PORTFOLIO DATA PROVIDER =====
export const PortfolioData = {
  _data: null,
  
  async load() {
    if (this._data) return this._data;

    try {
      localStorage.removeItem('portfolio-data-cache');
    } catch {
      // Storage can be unavailable in restricted browser modes.
    }
    
    this._data = {
      info: { ...PROFILE_INFO },
      education: cloneData(EDUCATION),
      experiences: cloneData(EXPERIENCES),
      projects: cloneData(PROJECTS),
      skills: cloneData(SKILL_GROUPS),
      blogs: cloneData(BLOG_POSTS),
      learning: cloneData(LEARNING_ITEMS),
      gaming: cloneData(GAMING),
      fileTree: cloneData(FILE_TREE)
    };
    
    return this._data;
  },
  
  getInfo() { return this._data?.info || PROFILE_INFO; },
  getExperiences() { return this._data?.experiences || EXPERIENCES; },
  getEducation() { return this._data?.education || EDUCATION; },
  getSkills() { return this._data?.skills || SKILL_GROUPS; },
  getProjects() { return this._data?.projects || PROJECTS; },
  getBlogPosts() { return this._data?.blogs || BLOG_POSTS; },
  getLearning() { return this._data?.learning || LEARNING_ITEMS; },
  getGaming() { return this._data?.gaming || GAMING; },
  getFileTree() { return this._data?.fileTree || FILE_TREE; }
};

if (typeof window !== 'undefined') {
  window.PortfolioData = PortfolioData;
}

