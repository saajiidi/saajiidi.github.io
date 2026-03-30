/**
 * TACTICAL DATA SOURCE - v3.0
 * Comprehensive dataset for the portfolio
 */

const DATA = {
  projects: [
    {
      id: "streamlit-hub",
      title: "[STREAMLIT_HUB]",
      description: "A centralized command center for 10+ operational data apps, including inventory trackers, sales dashboards, and automation tools.",
      image: "img#projects/streamlit-hub.png",
      liveUrl: "https://share.streamlit.io/user/saajiidi",
      featured: true,
      technologies: ["Python", "Streamlit", "Automation", "Data Ops"],
      caseStudy: {
        role: "Solutions Architect",
        timeline: "2024 - 2025",
        problem: "Operational tools were scattered across different deployments, making it difficult for stakeholders to find the right dashboard.",
        solution: "Consolidated all active Streamlit tools into a single shared workspace with unified data connectors.",
        impact: [
          "50% reduction in app discovery time for managers.",
          "Standardized data ingestion for all retail automation apps.",
        ],
        metrics: [
          { label: "Active Apps", value: "10+" },
          { label: "Primary Stack", value: "Streamlit" },
        ],
      },
    },
    {
      id: "vscode-portfolio",
      title: "VS Code Themed Portfolio",
      description: "A high-performance portfolio built with Next.js 14, TypeScript, and Tailwind CSS, featuring a fully functional VS Code interface clone.",
      image: "img#projects/vscode-portfolio.png",
      liveUrl: "https://sajid-ul-islam.vercel.app/",
      featured: true,
      technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "React"],
      category: "web-apps",
      caseStudy: {
        role: "Full Stack Developer",
        timeline: "2024",
        problem: "Needed a unique, developer-centric way to showcase projects and skills beyond standard templates.",
        solution: "Architected a VS Code 'Shell' using Next.js App Router, combining file-tree navigation with code-themed content blocks.",
        impact: [
          "Achieved 95+ Lighthouse performance scores.",
          "Highly interactive UI that resonates with the developer community.",
        ],
        metrics: [
          { label: "Performance", value: "98/100" },
          { label: "Tech Stack", value: "Next.js 14" },
        ],
      },
    },
    {
      id: "automation-pivot",
      title: "Automation Pivot",
      description: "Operations dashboard for DEEN Commerce, centralizing live order queues, historical sales analysis, and customer pulse tracking.",
      image: "img#projects/automation-pivot.png",
      liveUrl: "#",
      featured: true,
      technologies: ["Streamlit", "Python", "Pandas", "Google Sheets API"],
      category: "bi-viz",
      caseStudy: {
        role: "Lead Business Analyst",
        timeline: "2024 - 2025",
        problem: "Operational data for DEEN Commerce was fragmented across multiple Google Sheets and local workbooks.",
        solution: "Built a centralized Python/Streamlit dashboard that merges live Google Sheets data with historical local archives.",
        impact: [
          "Streamlined packing and shipping workflows via Live Queue.",
          "Enabled real-time Customer Pulse monitoring (CLV, Retention).",
        ],
        metrics: [
          { label: "Data Source", value: "Hybrid GSheets/Local" },
          { label: "Efficiency", value: "Real-time Sync" },
        ],
      },
    },
    {
      id: "1",
      title: "ECommerce Dashboard",
      description: "A dashboard providing real-time data from 2021-2025, featuring analytics for total revenue, total orders, total customers, and average order value.",
      image: "/img#projects/ecommerce.png",
      liveUrl: "https://e-com-dashborad.vercel.app/",
      featured: true,
      technologies: ["Dashboard", "React", "Analytics", "E-commerce"],
      category: "bi-viz",
      caseStudy: {
        role: "Data Analyst & Dashboard Builder",
        timeline: "2021–2025 dataset",
        problem: "Stakeholders needed a single view of revenue, orders, customers, and AOV trends.",
        solution: "Built a KPI dashboard consolidating 2021–2025 sales data into a unified view.",
        impact: [
          "Improved visibility into marketplace performance trends.",
          "Standardized KPI definitions for recurring reviews.",
        ],
        metrics: [
          { label: "Time Range", value: "2021–2025" },
          { label: "Core KPIs", value: "4" },
        ],
      },
    },
    {
      id: "2",
      title: "Sheet2WhatsApp",
      description: "Automates WhatsApp link generation from Excel/CSV files.",
      image: "/img#projects/whatsapp.png",
      liveUrl: "https://sheet2whatsapp.streamlit.app/",
      featured: true,
      technologies: ["Streamlit", "Python", "Pandas", "Vercel"],
      category: "automation",
      caseStudy: {
        role: "Builder",
        timeline: "2024",
        problem: "Creating WhatsApp links from spreadsheets was manual and error-prone.",
        solution: "Streamlit app that converts CSV/Excel rows into share-ready WhatsApp links.",
        impact: [
          "Reduced copy/paste effort for outreach.",
          "Improved accuracy of contact links.",
        ],
        metrics: [
          { label: "Input", value: "CSV/Excel" },
          { label: "Output", value: "WhatsApp links" },
        ],
      },
    },
    {
      id: "3",
      title: "Sentinel Bangladesh",
      description: "An interactive security incident map for Bangladesh, featuring cluster analysis, heatmaps, and detailed incident tracking.",
      image: "/img#projects/sentinel.png",
      liveUrl: "https://sentinelbangladesh.streamlit.app/",
      featured: true,
      technologies: ["Streamlit", "Python", "Data Visualization", "Security Analysis"],
      category: "bi-viz",
      caseStudy: {
        role: "Data Visualization",
        timeline: "2024",
        problem: "Security incidents needed spatial insight at scale.",
        solution: "Interactive map with clustering, heatmaps, and drill-down incident details.",
        impact: [
          "Faster pattern discovery across regions.",
          "Clearer communication of incident density.",
        ],
        metrics: [{ label: "Map Layers", value: "Clusters + Heatmap + Points" }],
      },
    },
    {
      id: "4",
      title: "Order Process Automation",
      description: "Automates order processing and formatting from Excel files, featuring consolidation and categorization.",
      image: "/img#projects/automation.png",
      liveUrl: "https://order-process-automation.streamlit.app/",
      featured: true,
      technologies: ["Streamlit", "Python", "Automation", "Data Processing"],
      category: "automation",
      caseStudy: {
        role: "Automation Engineer",
        timeline: "2024",
        problem: "Order sheets required manual consolidation and formatting.",
        solution: "Automated ingestion, cleaning, and categorization of Excel orders.",
        impact: ["Faster order preparation.", "Consistent output formatting."],
        metrics: [
          { label: "Input", value: "Excel" },
          { label: "Output", value: "Formatted sheets" },
        ],
      },
    },
    {
      id: "5",
      title: "Air Passenger Forecasting",
      description: "Time series analysis comparing multiple forecasting models (ARIMA, Exponential Smoothing) for airline passenger prediction.",
      image: "",
      liveUrl: "https://saajiidi.github.io/Air_Passengers_Forecasting_Models/",
      featured: true,
      technologies: ["Machine Learning", "Time Series", "Python"],
      category: "ml-ai",
      caseStudy: {
        role: "Data Scientist",
        timeline: "2023",
        problem: "Forecast air passenger demand using multiple time-series models.",
        solution: "Compared ARIMA and Exponential Smoothing forecasts.",
        impact: ["Enabled model comparison for planning scenarios."],
        metrics: [{ label: "Models", value: "ARIMA, Exp. Smoothing" }],
      },
    },
    {
      id: "6",
      title: "Ramadan Compass",
      description: "A comprehensive Ramadan companion app featuring prayer times, Qibla compass, and daily goals tracking. Built with Next.js.",
      image: "",
      liveUrl: "https://ramadancompass.vercel.app/",
      featured: true,
      technologies: ["Next.js", "Ramadan", "Prayer Times", "React", "PWA"],
      category: "web-apps",
      caseStudy: {
        role: "Frontend Engineer",
        timeline: "2024",
        problem: "Users needed prayer times, Qibla, and daily goals in one place.",
        solution: "Next.js PWA combining daily utilities and reminders.",
        impact: ["Simplified daily Ramadan routines in a single app."],
        metrics: [
          { label: "Platform", value: "PWA" },
          { label: "Core Features", value: "Prayer times + Qibla" },
        ],
      },
    },
    {
      id: "churn-analysis",
      title: "Customer Churn Analysis",
      description: "Predictive modeling using Python to identify at-risk customers. Implementation of Random Forest and XGBoost with 85%+ accuracy.",
      image: "",
      githubUrl: "https://github.com/saajiidi/Customer-Churn-Prediction/",
      featured: true,
      technologies: ["Python", "Machine Learning", "XGBoost", "Random Forest"],
      category: "ml-ai",
      caseStudy: {
        role: "ML Engineer",
        timeline: "2023",
        problem: "Identify at-risk customers before churn.",
        solution: "Built Random Forest and XGBoost models for churn prediction.",
        impact: ["Improved visibility into churn drivers."],
        metrics: [
          { label: "Reported Accuracy", value: "85%+" },
          { label: "Models", value: "RF + XGBoost" },
        ],
      },
    },
    {
      id: "security-map",
      title: "Security Map Visualization",
      description: "Interactive map-based visualization of security events developed using R, Folium, and Leaflet with temporal sliders.",
      image: "",
      liveUrl: "https://trr-bd.vercel.app",
      featured: true,
      technologies: ["R", "Folium", "Leaflet", "Data Viz"],
      category: "bi-viz",
      caseStudy: {
        role: "Data Visualization",
        timeline: "2023",
        problem: "Visualize security events with spatial and temporal context.",
        solution: "R + Folium + Leaflet map with temporal sliders.",
        impact: ["Improved spatial + temporal analysis for stakeholders."],
        metrics: [{ label: "Tech", value: "R, Folium, Leaflet" }],
      },
    },
    {
      id: "gdp-debt",
      title: "Economic Analysis",
      description: "Analysis of GDP vs Debt Correlation across global economies.",
      image: "",
      liveUrl: "https://saajiidi.github.io/Economic-Analysis-GDP-vs-Debt-Correlation/",
      featured: true,
      technologies: ["Data Analysis", "Economics", "Python"],
      category: "bi-viz",
      caseStudy: {
        role: "Analyst",
        timeline: "2022",
        problem: "Understand GDP vs debt correlation across countries.",
        solution: "Cross-country analysis with comparative visuals.",
        impact: ["Highlighted macroeconomic patterns and outliers."],
        metrics: [{ label: "Scope", value: "Global economies" }],
      },
    },
    {
      id: "7",
      title: "E-Commerce Platform",
      description: "Modern e-commerce interface built with React.js featuring responsive design, product catalog, shopping cart functionality.",
      image: "",
      liveUrl: "https://gear-master.vercel.app/",
      featured: false,
      technologies: ["React", "E-commerce", "Frontend"],
      category: "web-apps",
      caseStudy: {
        role: "Frontend Engineer",
        timeline: "2022",
        problem: "Need a modern, responsive e-commerce interface.",
        solution: "React UI with catalog and cart workflows.",
        impact: ["Delivered a clean, mobile-ready shopping experience."],
        metrics: [{ label: "Modules", value: "Catalog + Cart" }],
      },
    },
    {
      id: "8",
      title: "Day Progress Plus",
      description: "A productivity focused application featuring day progress tracking, focus task management, and customizable settings.",
      image: "",
      liveUrl: "https://saajiidi.github.io/TimeTracker/",
      featured: false,
      technologies: ["Productivity", "React", "Utility"],
      category: "web-apps",
      caseStudy: {
        role: "Productivity App Builder",
        timeline: "2022",
        problem: "Track daily progress and focus tasks in one view.",
        solution: "Day progress tracker with focus task management.",
        impact: ["Improved daily planning and focus."],
        metrics: [{ label: "Features", value: "Progress + Focus tasks" }],
      },
    },
    {
      id: "9",
      title: "Growth Analysis Dashboard",
      description: "A comprehensive web development project showcasing modern web technologies and best practices.",
      image: "",
      liveUrl: "https://saajiidi.github.io/Growth-Analysis-Dashboard/",
      featured: false,
      technologies: ["Web Dev", "React", "Analytics"],
      category: "bi-viz",
      caseStudy: {
        role: "Frontend Engineer",
        timeline: "2022",
        problem: "Centralize growth metrics into a single dashboard.",
        solution: "Analytics dashboard showcasing key KPIs.",
        impact: ["Simplified growth reporting for quick reviews."],
        metrics: [{ label: "Focus", value: "Analytics KPIs" }],
      },
    },
    {
      id: "10",
      title: "Border Security Analysis",
      description: "Data visualization project analyzing border incident trends in Bangladesh using statistical methods.",
      image: "",
      liveUrl: "https://saajiidi.github.io/Border-Killing-Trend-in-Bangladesh/",
      featured: false,
      technologies: ["Data Viz", "Statistics", "Social Impact"],
      category: "bi-viz",
      caseStudy: {
        role: "Data Analyst",
        timeline: "2021",
        problem: "Analyze border incident trends in Bangladesh.",
        solution: "Statistical analysis with clear visualizations.",
        impact: ["Made incident trends easier to interpret."],
        metrics: [{ label: "Methods", value: "Stats + Data Viz" }],
      },
    },
    {
      id: "11",
      title: "Image Scraper",
      description: "Versatile Python tool for downloading images from Pinterest with multiple interfaces including web UI and command line.",
      image: "",
      liveUrl: "https://img-scraper.streamlit.app/",
      featured: false,
      technologies: ["Python", "Scraping", "Automation"],
      category: "automation",
      caseStudy: {
        role: "Python Developer",
        timeline: "2021",
        problem: "Collect images from Pinterest efficiently.",
        solution: "Python tool with web UI and CLI options.",
        impact: ["Faster dataset creation for research and projects."],
        metrics: [{ label: "Interfaces", value: "Web UI + CLI" }],
      },
    },
    {
      id: "12",
      title: "Tableau Portfolio",
      description: "Demographics, economic analysis, and security incident maps.",
      image: "",
      liveUrl: "https://public.tableau.com/app/profile/sajid.islam4721/viz/MuslimPopulationbyEthinicity/Dashboard1",
      featured: false,
      technologies: ["Tableau", "Data Visualization"],
      category: "bi-viz",
      caseStudy: {
        role: "BI Analyst",
        timeline: "2021",
        problem: "Showcase Tableau dashboards in one place.",
        solution: "Published portfolio of interactive dashboards.",
        impact: ["Centralized BI work for easy sharing."],
        metrics: [{ label: "Platform", value: "Tableau Public" }],
      },
    },
    {
      id: "13",
      title: "B2B StockLot E-Commerce",
      description: "Web development project for B2B e-commerce.",
      image: "",
      liveUrl: "https://github.com/saajiidi/B2B-StockLot-E-Commerce-BD",
      featured: false,
      technologies: ["HTML/CSS", "JavaScript", "Web Dev"],
      category: "web-apps",
      caseStudy: {
        role: "Web Developer",
        timeline: "2020",
        problem: "Create an online presence for B2B stock lot sales.",
        solution: "Static site built with HTML, CSS, and JavaScript.",
        impact: ["Provided a basic online storefront."],
        metrics: [{ label: "Stack", value: "HTML/CSS/JS" }],
      },
    }
  ],
  blogPosts: [
    {
      id: "blog-1",
      title: "Optimizing Retail BI: A Daraz Case Study",
      date: "Oct 12, 2024",
      excerpt: "Deep dive into how we increased partner acquisitions by 50% using automated funnel tracking.",
      tags: ["BI", "Case Study", "Growth"],
      url: "#"
    },
    {
      id: "blog-2",
      title: "Python for Automation: Pinterest Scrapers",
      date: "Sep 05, 2024",
      excerpt: "Technical walkthrough of building mass-image downloaders for dataset creation.",
      tags: ["Python", "Automation", "NLP"],
      url: "#"
    },
    {
        id: "blog-3",
        title: "Modern Dashboards: Beyond Aesthetics",
        date: "Aug 20, 2024",
        excerpt: "Why readability wins over flashy animations when building mission-critical tools.",
        tags: ["Data Viz", "UI/UX", "Analytics"],
        url: "#"
      }
  ],
  learningItems: [
    { name: "Advanced Generative AI", category: "ML", progress: 85 },
    { name: "Cloud Data Warehousing", category: "Data Ops", progress: 60 },
    { name: "Spatial Data Analysis", category: "GIS", progress: 40 },
    { name: "Executive Strategic Leadership", category: "BI", progress: 75 }
  ],
  gaming: {
    stats: [
      { label: "HOURS_LOGGED", value: "2400+" },
      { label: "STRATEGY_MASTERY", value: "ELITE" },
      { label: "SERVER_RANK", value: "#12" }
    ],
    favorites: [
      { name: "Red Dead Redemption 2", category: "Masterpiece" },
      { name: "God of War Ragnarok", category: "Storytelling" },
      { name: "FC24 / FIFA", category: "Competitive" },
      { name: "Ghost of Tsushima", category: "Visuals" }
    ]
  },
  favoriteMedia: [
    { title: "Inception", subtitle: "Mind-bending logic and layer-depth.", image: "https://m.media-amazon.com/images/I/912AEWRu6mL._AC_SL1500_.jpg" },
    { title: "The Martian", subtitle: "Strategic thinking and survival.", image: "https://m.media-amazon.com/images/I/9103C4pXvBL._AC_SY606_.jpg" },
    { title: "Moneyball", subtitle: "The ultimate Data-Driven story.", image: "https://m.media-amazon.com/images/I/91f6MvXyUfL._AC_SL1500_.jpg" }
  ],
      fileTreeData: [
    {
      id: "explorer",
      label: "EXPLORER",
      isOpen: true,
      items: [
        { id: "saajiidi-site", label: "saajiidi.github.io", href: "https://saajiidi.github.io/", icon: "globe", extension: "link" }
      ]
    },
    {
      id: "portfolio",
      label: "PORTFOLIO",
      isOpen: true,
      items: [
        { id: "home", label: "Welcome", href: "/", icon: "home", extension: "tsx" },
        {
          id: "experience",
          label: "Experience",
          href: "#experience",
          icon: "briefcase",
          extension: "tsx",
        },
        {
          id: "skills",
          label: "Skills",
          href: "#skills",
          icon: "code",
          extension: "json",
        },
        {
          id: "projects",
          label: "Projects",
          href: "#projects",
          icon: "folder",
          extension: "tsx",
        },
        {
            id: "education",
            label: "Education",
            href: "#education",
            icon: "graduation-cap",
            extension: "tsx",
        },
        {
            id: "family",
            label: "Family",
            href: "#family",
            icon: "users",
            extension: "tsx",
        },
        {
          id: "contact",
          label: "Contact",
          href: "#contact",
          icon: "mail",
          extension: "tsx",
        },
      ],
    },
    {
      id: "hobbies",
      label: "HOBBIES",
      isOpen: false,
      items: [
        { id: "favorites", label: "Favorites", href: "/Favorites", icon: "star", extension: "tsx" },
        {
          id: "gaming",
          label: "Gaming",
          href: "/Gaming",
          icon: "gamepad-2",
          extension: "tsx",
        },
        {
          id: "blogs",
          label: "Blogs",
          href: "/Blogs",
          icon: "book-open",
          extension: "md",
        },
      ],
    },
    {
      id: "more",
      label: "MORE",
      isOpen: false,
      items: [
        {
          id: "learning",
          label: "Learning",
          href: "/Learning",
          icon: "graduation-cap",
          extension: "tsx",
        },
        {
          id: "startup",
          label: "Startup",
          href: "/Startup",
          icon: "rocket",
          extension: "tsx",
        },
      ],
    },
  ],
  socialLinks: [
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/sajidislamchowdhury/",
      icon: "linkedin",
      color: "#0077b5",
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/saajiidi",
      icon: "github",
      color: "#333333",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      url: "https://wa.me/+8801824526054?text=",
      icon: "message-circle",
      color: "#25D366",
    },
    {
      id: "resume",
      name: "Resume",
      url: "https://saajiidi.github.io/resume.html",
      icon: "file-text",
      color: "#da552f",
    },
  ],
  skillGroups: [
    {
      name: "Business & Strategy",
      skills: [
        { name: "Market Research", category: "Strategy", icon: "https://img.icons8.com/color/48/000000/search--v1.png", level: 90 },
        { name: "Product Development", category: "Strategy", icon: "https://img.icons8.com/color/48/000000/product--v1.png", level: 85 },
        { name: "Business Development", category: "Strategy", icon: "https://img.icons8.com/color/48/000000/conference-call.png", level: 88 },
        { name: "Business Intelligence", category: "Strategy", icon: "https://img.icons8.com/color/48/000000/business-report.png", level: 92 }
      ]
    },
    {
      name: "Analytical & Technical",
      skills: [
        { name: "Data Analytics & ML", category: "Data", icon: "https://img.icons8.com/color/48/null/python--v1.png", level: 85 },
        { name: "Python & R", category: "Data", icon: "https://img.icons8.com/color/48/000000/python.png", level: 85 },
        { name: "Power BI & Tableau", category: "BI", icon: "https://img.icons8.com/color/48/000000/power-bi.png", level: 90 },
        { name: "Excel & Spreadsheets", category: "Data", icon: "https://img.icons8.com/color/48/000000/microsoft-excel-2019--v1.png", level: 95 },
        { name: "Data Visualization", category: "BI", icon: "https://img.icons8.com/color/48/000000/combo-chart.png", level: 92 },
        { name: "Prompt Engineering", category: "AI", icon: "https://img.icons8.com/color/48/000000/robot-intellectual.png", level: 88 }
      ]
    },
    {
      name: "Web Development",
      skills: [
        { name: "React", category: "Frontend", icon: "https://img.icons8.com/color/144/000000/react-native.png", level: 75 },
        { name: "JavaScript", category: "Frontend", icon: "https://img.icons8.com/color/144/000000/javascript--v1.png", level: 80 },
        { name: "HTML5 & CSS3", category: "Frontend", icon: "https://img.icons8.com/color/144/000000/html-5--v1.png", level: 90 },
        { name: "Basic Web Dev", category: "Frontend", icon: "https://img.icons8.com/color/48/000000/source-code.png", level: 70 }
      ]
    }
  ],
  experiences: [
    {
      id: "deencommerce",
      title: "Business Analyst",
      company: "Deen Commerce",
      location: "Mirpur, Dhaka",
      startDate: "June 2025",
      current: true,
      description: "Leading Business Strategy and CRM growth through granular performance tracking. Architecting weekly performance dashboards.",
      highlights: [
        "CRM Improvisation",
        "Business Strategy",
        "Architecting weekly performance dashboards for stakeholder reporting"
      ],
      technologies: ["CRM", "Business Analysis", "Strategy"],
    },
    {
      id: "nztex",
      title: "IT Executive",
      company: "NZ TEX GROUP",
      location: "Rupganj, Narayanganj",
      startDate: "Feb 2024",
      endDate: "May 2024",
      description: "Collaborated with the Research & Development Team to enhance product innovation. Delivered impactful presentations and reports to authorities and buyers.",
      highlights: [
        "Collaborated with the Research & Development Team to enhance product innovation",
        "Delivered impactful presentations and reports to authorities and buyers, enhancing stakeholder engagement and decision-making"
      ],
      technologies: ["IT Support", "R&D", "Reporting"],
    },
    {
      id: "thrivingskills",
      title: "Associate – Online Sales & Customer Supports",
      company: "Thriving Skills",
      location: "Gulshan, Dhaka",
      startDate: "Oct 2023",
      endDate: "Jan 2024",
      description: "Conducted business and marketplace analysis; executed targeted sales strategies to increase customer loyalty and engagement.",
      highlights: [
        "Conducted comprehensive business and marketplace analysis, identifying opportunities that increased sales",
        "Designed and executed targeted sales strategies, resulting in a significant increase in customer loyalty and engagement",
        "Managed CRM systems to improve customer retention"
      ],
      technologies: ["Market Analysis", "CRM", "Sales Strategy"],
    },
    {
      id: "daraz",
      title: "Jr. Executive – Marketplace",
      company: "Daraz Bangladesh Ltd.",
      location: "Banani, Dhaka",
      startDate: "Jan 2020",
      endDate: "Jan 2022",
      description: "Increased partner acquisitions by 50% through targeted outreach strategies. Managed key accounts and increased client satisfaction by 20%.",
      highlights: [
        "Drove a 50% increase in partner acquisitions by implementing targeted outreach strategies and enhancing brand visibility",
        "Led successful campaigns and managed key accounts, increasing client satisfaction by 20% and driving revenue growth",
        "Optimized Marketplace Health through vendor performance tracking"
      ],
      technologies: ["Marketplace", "Acquisition", "Account Management"],
    },
    {
      id: "hungrynaki",
      title: "Associate – Home Kitchen & Street Food",
      company: "HungryNaki (Sister concern of Daraz)",
      location: "Banani, Dhaka",
      startDate: "Jul 2021",
      endDate: "Jan 2022",
      description: "Identified 15% growth opportunities through in-depth marketplace analysis. Spearheaded partner acquisition initiatives, increasing the network by 25%.",
      highlights: [
        "Conducted in-depth business and marketplace analysis, identifying 15% growth opportunities that increased revenue",
        "Spearheaded brand and partner acquisition initiatives, increasing partner network by 25%",
        "Leveraged BI tools to identify hyper-local food trends"
      ],
      technologies: ["Business Analysis", "Growth Strategy", "BI Tools"],
    },
    {
      id: "gearmaster",
      title: "Co-Founder",
      company: "Gear Master",
      startDate: "2024",
      current: true,
      description: "Leading Business Operations for a bike accessories retail startup. Managing inventory and sales growth strategies.",
      highlights: [
        "Leading Business Operations for a bike accessories retail startup",
        "Managing inventory, sales growth strategies, and multi-channel customer engagement"
      ],
      technologies: ["Retail", "Business Management"],
    }
  ],
  favoriteMedia: [
    {
      id: "1",
      title: "Kingdom of Heaven",
      subtitle: "Movie",
      image: "/img/kingdom_of_heaven.png",
    },
    {
      id: "2",
      title: "Fatih 1453",
      subtitle: "Movie",
      image: "/img/fatih_1453.png",
    },
    {
      id: "3",
      title: "The Godfather",
      subtitle: "Novel",
      image: "/img/godfather.png",
    },
  ],
  gaming: {
    platforms: [{ name: "PC" }],
    favorites: [
      { name: "Valorant", category: "FPS", platform: "PC" },
      { name: "Marvel Rivals", category: "FPS", platform: "PC" },
      { name: "Forza Horizon 5", category: "Racing", platform: "PC" },
      { name: "FIFA", category: "Sports", platform: "PC" },
      { name: "Fortnite", category: "Battle Royale", platform: "PC" },
    ],
    stats: [
      { label: "Years Gaming", value: "15+" },
      { label: "Favorite Genre", value: "Action/Adventure/Racing" },
      { label: "Current Game", value: "Marvel Rivals" },
    ]
  },
  learningItems: [
    { name: "Advanced System Design", category: "Architecture", progress: 70 },
    { name: "Applied GenAI", category: "Programming", progress: 85 },
    { name: "AI/ML Deep Dive", category: "AI", progress: 30 },
    { name: "Product Engineering", category: "Engineering", progress: 50 },
    { name: "Sanskrit", category: "Language", progress: 20 },
    { name: "Storytelling/Writing", category: "Communication", progress: 40 },
  ],
  blogPosts: [
    {
      id: "1",
      title: "Building reliable data dashboards",
      excerpt: "Insights on how to build reliable reporting dashboards.",
      date: "2024-01-01",
      url: "#",
      tags: ["Analytics", "BI"]
    },
    {
      id: "2",
      title: "From messy data to actionable insight",
      excerpt: "Strategy for cleaning and utilizing business data.",
      date: "2024-02-01",
      url: "#",
      tags: ["Strategy", "Data"]
    },
    {
      id: "3",
      title: "Designing reporting that drives decisions",
      excerpt: "Best practices to design reports that offer actionable insights.",
      date: "2024-03-01",
      url: "#",
      tags: ["BI", "Reporting"]
    }
  ]
};

