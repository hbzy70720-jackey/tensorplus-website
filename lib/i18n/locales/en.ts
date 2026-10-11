import type { Dict } from "../dictionaries";

export const en: Dict = {
  nav: {
    home: "Home",
    perception: "3D Perception",
    robot: "Outdoor Operation Robots",
    cases: "Customer Stories",
    about: "About Us",
    bookDemo: "Book a Demo",
    languageSwitch: "中文",
  },
  footer: {
    brandDesc:
      "Beijing TensorPlus Technology Co., Ltd. — high-precision 3D perception and outdoor operation robot solutions.",
    quickLinks: "Quick Links",
    contact: "Contact",
    business: "Business",
    businessDesc:
      "Interested in our products or solutions? Reach out anytime — we respond within 24 hours.",
    bookDemo: "Book a Demo →",
    copyright: (year: number) => `© ${year} Beijing TensorPlus Technology Co., Ltd. All rights reserved.`,
  },
  hero: {
    tagline: "Enabling machines to understand and work in the real world",
    subtitle1: "High-precision 3D perception + outdoor operation robots",
    subtitle2:
      "Turnkey intelligent solutions for forestry, solar, power, oil & gas, and agriculture",
    viewSolutions: "View Solutions",
    bookDemo: "Book a Demo →",
  },
  home: {
    metaTitle: "Beijing TensorPlus Technology Co., Ltd. — High-Precision 3D Perception & Outdoor Robots",
    metaDescription:
      "Beijing TensorPlus Technology Co., Ltd. specializes in high-precision 3D perception and outdoor operation robots. Sub-millimeter 3D cameras, object recognition, and autonomous SLAM navigation deliver turnkey solutions for solar, power, forestry, oil & gas, and agriculture.",
    productsTitle: "Core Solutions",
    productsSubtitle:
      "Two core product lines covering the full loop from perception to execution",
    industriesTitle: "Industry Applications",
    industriesSubtitle:
      "Proven across four key industries, deployed at leading customers",
    statsTitle: "Key Advantages",
    statsSubtitle: "Extreme accuracy and reliability in the most demanding environments",
    ctaTitle: "Ready to automate your outdoor operations?",
    ctaDesc:
      "Whether you build robots or run field operations, we deliver industry-leading, cost-effective 3D perception and outdoor robot solutions.",
    ctaButton: "Book a Product Demo",
    card1Title: "High-Precision 3D Perception",
    card1Desc:
      "Industry-leading outdoor 3D cameras and object-recognition algorithms deliver sub-millimeter accuracy and strong resistance to light and shadow, with proven deployments across solar, forestry, power, and more.",
    card2Title: "Outdoor Operation Robots",
    card2Desc:
      "Autonomous navigation (SLAM + path planning + obstacle avoidance) plus autonomous execution enables fully automatic travel and precise operation over complex outdoor terrain.",
    learnMore: "Learn More",
    industries: [
      {
        name: "Solar",
        description: "Automated installation, cleaning, and maintenance of PV modules",
      },
      {
        name: "Forestry",
        description: "End-to-end intelligence from planting through production",
      },
      {
        name: "Oil & Gas",
        description: "Intelligent drilling, plus pipeline installation and maintenance",
      },
      {
        name: "Power",
        description: "Intelligent installation and maintenance of power equipment",
      },
    ],
    stats: [
      { display: "<0.1mm, 0.05°", label: "3D Perception Accuracy" },
      { display: "99.999%", label: "Action Execution Success Rate" },
      {
        display: "Outdoor-ready",
        label: "Unaffected by strong sunlight, backlight, and other extremes",
      },
    ],
  },
  perception: {
    metaTitle: "3D Perception",
    metaDescription:
      "High-precision 3D cameras and object-recognition algorithms with sub-millimeter accuracy and strong-light immunity. Turnkey vision solutions for solar, power, forestry, and oil & gas.",
    heroTitle: "Outdoor High-Precision 3D Perception",
    heroTagline: "Helping machines see the world at sub-millimeter accuracy",
    heroDescription:
      "An outdoor high-precision 3D perception system for robots — combining rugged outdoor 3D cameras with robot 3D perception algorithms to deliver turnkey vision solutions.",
    capabilitiesTitle: "Core Capabilities",
    capabilitiesSubtitle:
      "Integrated hardware and software — the full stack from camera to algorithm",
    seriesTitle: "Product Series",
    seriesSubtitle: "Three models covering a range of application scenarios",
    scenariosTitle: "Applications",
    scenariosSubtitle:
      "Validated in deployment with leading customers across industries",
    features: [
      {
        title: "High-Precision 3D Camera",
        description:
          "Sub-millimeter 3D imaging accuracy on common materials, even under harsh outdoor conditions such as strong sunlight and backlight. Stable and interference-resistant, delivering high-quality point clouds and color images.",
        highlight: "Accuracy: <0.1mm",
      },
      {
        title: "Object Recognition Algorithms",
        description:
          "Pose-estimation algorithms for PV modules, mounting frames, logs, and more. Easily integrated into robots for arm guidance, precise measurement, and localization.",
        highlight: "Recognition accuracy: 99.8%",
      },
      {
        title: "All-Weather Outdoor Adaptation",
        description:
          "Purpose-built for challenging outdoor lighting — stable under strong sunlight, shadow, and backlight. Long-term validated at solar farms, forest plantations, and oil fields.",
        highlight: "IP65 ingress protection",
      },
    ],
    products: [
      {
        name: "Tensor Plus",
        specs: [
          { param: "Dimensions", value: "275×125×81.5mm" },
          { param: "Weight", value: "2.1kg" },
          { param: "Power Supply", value: "12V DC" },
          { param: "Peak Power", value: "30W" },
          { param: "Communication", value: "Gigabit Ethernet" },
          { param: "Operating Temperature", value: "-20°C to +60°C" },
          { param: "Ingress Protection", value: "IP65" },
        ],
        performance: [
          { param: "Resolution", value: "Color image: 4056×3040; 3D image: 4056×3040" },
          { param: "Field of View", value: "Horizontal: 76°, Vertical: 61°" },
          { param: "Imaging Speed", value: "8~12s@4K" },
          { param: "Working Distance", value: "0.8~2.5m" },
          { param: "Z Accuracy", value: "0.27mm@1.2m" },
          { param: "Output Data", value: "RGB + aligned 3D image" },
          { param: "Programming Interface", value: "C++ / Python SDK" },
        ],
      },
      {
        name: "Tensor Eye",
        specs: [
          { param: "Dimensions", value: "246×143×81mm" },
          { param: "Weight", value: "2.1kg" },
          { param: "Power Supply", value: "12V DC" },
          { param: "Peak Power", value: "15W" },
          { param: "Communication", value: "Gigabit Ethernet" },
          { param: "Operating Temperature", value: "-20°C to +60°C" },
          { param: "Ingress Protection", value: "IP65" },
        ],
        performance: [
          { param: "Resolution", value: "Color image: 3072×2048; 3D image: 3072×2048" },
          { param: "Field of View", value: "Horizontal: 55.6°, Vertical: 41.7°" },
          { param: "Imaging Speed", value: "4~8s@4K" },
          { param: "Working Distance", value: "0.8~2.5m" },
          { param: "Z Accuracy", value: "0.27mm@1.2m" },
          { param: "Output Data", value: "RGB + aligned 3D image" },
          { param: "Programming Interface", value: "C++ / Python SDK" },
        ],
      },
      {
        name: "Tensor Mini",
        specs: [
          { param: "Dimensions", value: "126×147×81mm" },
          { param: "Weight", value: "1.1kg" },
          { param: "Power Supply", value: "12V DC" },
          { param: "Power", value: "15W" },
          { param: "Communication", value: "Gigabit Ethernet" },
          { param: "Operating Temperature", value: "-20°C to +60°C" },
          { param: "Ingress Protection", value: "IP65" },
        ],
        performance: [
          { param: "Resolution", value: "Color image: 1536×1024; 3D image: 1536×1024" },
          { param: "Field of View", value: "Horizontal: 55.6°, Vertical: 41.7°" },
          { param: "Imaging Speed", value: "1~4s@4K" },
          { param: "Working Distance", value: "0.4~1.3m" },
          { param: "Z Accuracy", value: "0.10mm@0.4m" },
          { param: "Output Data", value: "RGB + aligned 3D image" },
          { param: "Programming Interface", value: "C++ / Python SDK" },
        ],
      },
    ],
    scenarios: [
      {
        name: "PV Module Installation Robot",
        description:
          "The 3D vision system precisely computes the installation pose of every PV module and guides the robotic arm through fully automated assembly, including bolt fastening.",
        points: [
          "Module pose estimation accurate to ±0.5mm, ±0.1°",
          "Supports a variety of PV modules and mounting frames",
          "Stable operation under strong sunlight",
        ],
      },
      {
        name: "Intelligent Log Measurement",
        description:
          "In forestry, 3D cameras rapidly scan log piles to precisely measure the diameter and volume of each log for trading, handover, and production management.",
        points: [
          "Single-scan measurement time <25s",
          "Average diameter error <±2mm",
          "Supports scaling standards worldwide",
        ],
      },
    ],
  },
  robot: {
    metaTitle: "Outdoor Operation Robots",
    metaDescription:
      "Outdoor operation robots with autonomous navigation (SLAM + path planning + obstacle avoidance) and autonomous execution, reliably performing complex tasks for agriculture, forestry, oil & gas, and power.",
    heroTitle: "Outdoor Operation Robots",
    heroTagline: "3D perception + autonomous navigation + autonomous execution",
    heroDescription:
      "Fully autonomous outdoor robots that fuse sub-millimeter 3D perception, all-terrain autonomous navigation, and high-precision execution into one closed loop from perception to action.",
    highlightsTitle: "Technology Highlights",
    highlightsSubtitle: "A fully autonomous closed loop from perception to execution",
    specsTitle: "Specifications",
    specsSubtitle: "Industrial all-terrain mobile platform parameters",
    techHighlights: [
      {
        title: "3D Perception",
        description:
          "Sub-millimeter 3D imaging accuracy on common materials under harsh outdoor conditions such as strong sunlight and backlight — stable and interference-resistant. High-quality point clouds and color images provide excellent input for vision algorithms.",
        highlight: "3D imaging accuracy: sub-millimeter",
        subItems: [
          { title: "Strong Sunlight", description: "Stable imaging under direct sunlight, immune to ambient light." },
          { title: "High Reflectivity", description: "Precise capture of metal, water, and other reflective surfaces with complete point clouds." },
          { title: "Backlight", description: "Image quality holds up in backlit scenes with no loss of detail." },
        ],
      },
      {
        title: "Autonomous Navigation",
        description:
          "Fully autonomous navigation over complex outdoor terrain — the robot explores, perceives its surroundings, plans its path, and controls chassis motion.",
        highlight: "RTK positioning accuracy: ±2cm",
        subItems: [
          { title: "Environmental Perception", description: "Multi-sensor 3D perception builds precise 3D digital maps and task maps." },
          { title: "Autonomous Control", description: "End-to-end path planning + chassis control fused with 3D-grid path planning for high precision and reliability, handling complex corner cases." },
        ],
      },
      {
        title: "Autonomous Execution",
        description:
          "Automatically plans tasks and generates execution schemes with minimal human intervention. High-precision 3D perception guides the robotic arm for accurate, reliable operation with multi-tool end-effector switching.",
        highlight: "Repeatable operation accuracy: ±0.5mm",
        subItems: [
          { title: "Task Planning", description: "Automatically decomposes tasks and generates execution sequences, minimizing human intervention." },
          { title: "End-Effector Switching", description: "Automatic switching between multiple tools to suit different tasks." },
          { title: "Precise Manipulation", description: "3D perception guides the arm with ±0.5mm repeatable accuracy." },
        ],
      },
    ],
    specs: [
      { param: "Dimensions", value: "1832×1100×1400mm" },
      { param: "Weight", value: "1750kg" },
      { param: "Power", value: "Electric" },
      { param: "Max Speed", value: "12km/h" },
      { param: "Max Gradeability", value: "30°" },
      { param: "Operating Temperature", value: "-20°C to +60°C" },
      { param: "Ingress Protection", value: "IP65" },
      { param: "Battery Life", value: "5h" },
      { param: "Control Mode", value: "Vision-guided autonomous + planning" },
      { param: "Chassis Type", value: "Tracked" },
    ],
  },
  product: {
    specParam: "Parameter",
    specValue: "Specification",
    specParams: "Specifications",
    performance: "Performance",
    productImage: "Product image",
    prevProduct: "Previous product",
    nextProduct: "Next product",
    productIndex: (n: number) => `Product ${n}`,
    techHighlightAlt: "technology highlights",
    scenarioAlt: "application scenario",
  },
  carousel: {
    prevImage: "Previous",
    nextImage: "Next",
    imageIndex: (n: number) => `Image ${n}`,
    noImage: "No image",
  },
  cases: {
    metaTitle: "Customer Stories",
    metaDescription:
      "TensorPlus customer case studies across solar, forestry, oil & gas, and power — outdoor robot 3D perception solutions.",
    heroTitle: "Customer Stories",
    heroTagline: "Real-world pain points, solved on the ground",
    heroDescription:
      "From solar to forestry, power to oil & gas — our solutions are proven with leading customers across industries, delivering measurable value for intelligent operations.",
    listTitle: "Delivered Cases",
    listSubtitle: "Every case is a commitment kept",
    all: "All",
    loading: "Loading...",
    emptyTitle: "Under Construction",
    emptyDesc: "Exciting case studies are coming soon — stay tuned.",
    prevPage: "Previous",
    nextPage: "Next",
    backToList: "Back to Cases",
  },
  about: {
    metaTitle: "About Us",
    metaDescription:
      "Beijing TensorPlus Technology Co., Ltd. — high-precision 3D perception and outdoor operation robot solutions.",
    heroTitle: "About Us",
    heroTagline: "A Tsinghua-founded team with years of deep technical expertise",
    heroDesc1: "We help every outdoor robot see the world and move on its own. From 3D perception to autonomous navigation, ",
    heroDesc2: "TensorPlus is redefining how machines interact with the physical world.",
    missionTitle: "Mission & Vision",
    missionSubtitle: 'Driven by technology innovation, we equip outdoor robots worldwide with reliable "eyes" and "brains"',
    missionCardTitle: "Our Mission",
    missionCardDesc: "Deliver highly reliable, high-precision perception and navigation solutions for outdoor robots, so they can work safely, precisely, and efficiently in the real world.",
    visionCardTitle: "Our Vision",
    visionCardDesc: 'Become a world-leading provider of intelligent systems for outdoor robots, giving every outdoor robot the ability to "see" and "move" intelligently.',
    timelineTitle: "Milestones",
    timelineSubtitle: "Every step from startup to industry leadership",
    addressTitle: "Find Us",
    addressSubtitle: "Welcome for a visit, technical exchange, and partnership",
    companyName: "Beijing TensorPlus Technology Co., Ltd.",
    milestones: [
      {
        year: "2018",
        title: "Company founded",
        desc: "Beijing TensorPlus Technology Co., Ltd. was founded in Zhongguancun Intelligent Manufacturing Street, Beijing, with a core team from Tsinghua University's Department of Computer Science.",
      },
      {
        year: "2022",
        title: "First 3D camera launched",
        desc: "Launched our first outdoor high-precision 3D camera with millimeter-level imaging, filling a market gap in outdoor high-precision 3D imaging.",
      },
      {
        year: "2024",
        title: "Breakthrough in the PV industry",
        desc: "The vision system for PV module installation robots signed with multiple robotics companies, becoming a leading 3D perception solution in the industry.",
      },
      {
        year: "2025",
        title: "Second-generation 3D camera launched",
        desc: "Imaging accuracy reached sub-millimeter level with greater stability, generating high-precision 3D images reliably in extreme outdoor conditions.",
      },
      {
        year: "2026",
        title: "Outdoor operation robot launched",
        desc: "Launched our outdoor operation robot, combining autonomous navigation and 3D perception, successfully applied in agriculture, forestry, and more.",
      },
    ],
  },
  contact: {
    metaTitle: "Book a Demo",
    metaDescription:
      "Book a TensorPlus product demo — one-on-one technical demos for our 3D perception solutions and outdoor operation robots.",
    heroTitle: "Book a Demo",
    heroTagline: "One-on-one technical demo, 24-hour response",
    heroDescription: "Fill in the form below and our technical experts will contact you within 24 hours to arrange a product introduction and a one-on-one on-site demo.",
    formTitle: "Send an Inquiry",
    infoTitle: "Contact Information",
    reassurance: "We will reply to your inquiry within 24 hours",
    infoCardTitle: "Contact Details",
    email: "Email",
    phone: "Phone",
    address: "Address",
    wechatOa: "WeChat Official Account",
    wechatVideo: "WeChat Channels",
    wechatOaAlt: "TensorPlus WeChat Official Account QR code",
    wechatVideoAlt: "TensorPlus WeChat Channels QR code",
    copyEmail: "Click to copy email",
    zhangName: "Mr. Zhang:",
    yangName: "Mr. Yang:",
    addressLine1: "No. 45 Chengfu Road, Haidian District, Beijing",
    addressLine2: "Room 206, 2F, Building G, Zhongguancun Intelligent Manufacturing Street",
  },
  contactForm: {
    name: "Name",
    namePlaceholder: "Your name",
    company: "Company / Organization",
    companyPlaceholder: "Company or organization name",
    phone: "Phone",
    phonePlaceholder: "Your phone number",
    email: "Email",
    emailPlaceholder: "your@company.com (optional)",
    message: "Project Details",
    messagePlaceholder: "Describe your application scenario and needs (at least 10 characters)",
    requiredName: "Please enter your name",
    requiredCompany: "Please enter your company/organization",
    requiredPhone: "Please enter your phone number",
    invalidEmail: "Please enter a valid email address",
    messageTooShort: "The description must be at least 10 characters",
    submit: "Submit Inquiry",
    success: "Submitted!",
    successDesc: "Thanks for your inquiry — we will get back to you within 24 hours.",
    submitFailed: "Submission failed, please try again later",
    networkError: "Network error, please try again later",
  },
};
