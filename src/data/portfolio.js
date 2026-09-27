/**
 * Michael Junior Jere's portfolio — the page at /michael, written from his CV
 * (public/michael-junior-jere-cv.pdf). Update both together.
 *
 * `openToWork` switches the "Open to roles" badge and the availability panel
 * on and off without touching the rest of the page.
 */

export const portfolio = {
  path: '/michael',
  name: 'Michael Junior Jere',
  title: 'Full-Stack Software Developer',
  headline: 'C# · ASP.NET Core · React · TypeScript · PostgreSQL · Cloud',
  location: 'Bulawayo, Zimbabwe',
  photo: { small: '/michael-jere-480.webp', large: '/michael-jere-960.webp', width: 960, height: 1152 },
  cv: '/michael-junior-jere-cv.pdf',
  email: 'jeremichaeljunior@gmail.com',
  phones: [
    { label: '+263 786 233 766', tel: '+263786233766' },
    { label: '+263 718 621 427', tel: '+263718621427' },
  ],
  whatsapp: '263786233766',
  // paste full addresses here; empty ones are not shown
  links: [
    { label: 'LinkedIn', url: '' },
    { label: 'GitHub', url: '' },
  ],

  openToWork: true,
  availability: ['Full-time, contract or freelance', 'Remote, hybrid or on-site', 'Willing to relocate', 'References available on request'],

  summary: [
    'Full-stack software developer and founder of MKLabs, building, deploying and maintaining business software for real companies.',
    'I design systems end to end: relational databases in PostgreSQL and MySQL, REST APIs and business logic in C# and ASP.NET Core, and responsive front ends in React and TypeScript — deployed on Railway, Vercel, Supabase and Cloudflare.',
    'My flagship product, a live multi-user point-of-sale and inventory system, is shaped by more than eight years inside a large retail operation, so I build software that fits how sales, stock and cash actually move through a business. I communicate clearly with non-technical users and take ownership of systems in production.',
  ],

  highlights: [
    { value: '8+ years', label: 'inside a large retail operation' },
    { value: 'Live', label: 'multi-user POS in production' },
    { value: 'End to end', label: 'database, API, UI and hosting' },
  ],

  projects: [
    {
      name: 'MKLabs POS — Point-of-Sale & Inventory System',
      url: 'https://pos.mklabs.co.zw',
      urlLabel: 'pos.mklabs.co.zw',
      image: '/client-pos-cashier.webp',
      stack: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'React', 'TypeScript', 'PostgreSQL / MySQL', 'REST', 'Git/GitHub', 'Cloud hosting'],
      problem: 'Small and mid-sized trading businesses need accurate sales, stock and user control without costly enterprise software.',
      solution: 'A multi-user web application with REST APIs, a relational database and role-based access for owners, managers and cashiers.',
      result: 'A live, cloud-hosted system covering sales processing, product and inventory management, and reporting — with stock and reconciliation logic drawn from years of hands-on retail stock control.',
    },
    {
      name: 'MKLabs Company Website',
      url: 'https://mklabs.co.zw',
      urlLabel: 'mklabs.co.zw',
      image: '/og-image.jpg',
      stack: ['React', 'TypeScript', 'HTML5', 'CSS3', 'Custom domain & subdomains', 'SSL'],
      problem: "MKLabs needed a fast, secure home for its POS, accounting, school and lodge management solutions and IT services.",
      solution: 'A responsive production website, designed, built, deployed and maintained end to end — including domain, subdomain and SSL configuration.',
      result: 'This site: prerendered for search engines, secured with strict security headers, and quick on a phone connection.',
    },
  ],

  experience: [
    {
      role: 'Founder & Full-Stack Software Developer',
      org: 'MKLabs — Bulawayo',
      period: 'Jan 2026 – Present',
      note: 'Business software, websites, cloud solutions and IT support',
      points: [
        'Founded MKLabs to deliver software to local businesses, including point-of-sale and business management systems, company websites, cloud hosting and IT support.',
        'Architected and built a full-stack POS and inventory system in C#, ASP.NET Core, React and TypeScript, integrating the UI, API and database layers to run real sales, stock and reporting workflows.',
        'Designed normalised relational schemas in PostgreSQL and MySQL with Entity Framework Core, structured for accurate stock, sales and reconciliation reporting.',
        'Built REST APIs linking the front end to business logic and data, keeping the system maintainable and ready to integrate with other business tools.',
        'Implemented authentication and role-based authorisation so every user reaches only the functions and data their role requires.',
        'Deploy and host production systems on Railway, Vercel, Supabase and Cloudflare, managing domains, subdomains, DNS and SSL certificates.',
        'Manage all code with Git and GitHub for version control and controlled releases; test, debug and troubleshoot live systems.',
        'Gather requirements from business owners, translate them into working features, then support and train the people who use them.',
      ],
    },
    {
      role: 'Administration and Banking Clerk',
      org: 'Edgars Stores Limited — Bulawayo',
      period: 'Jul 2024 – Aug 2026',
      points: [
        'Reconciled daily takings against bank deposits and system reports, and reported variances to management with corrective recommendations.',
        'Received and issued stock against delivery notes, invoices and requisitions, and coordinated cycle counts and inventory audits against system records.',
      ],
    },
    {
      role: 'Customer Service Assistant and Cashier',
      org: 'Edgars Stores Limited — Bulawayo',
      period: 'Jun 2018 – Jun 2024',
      points: [
        'Used POS and customer account systems daily, processing high volumes of transactions accurately; promoted in 2024 for reliability and accuracy.',
        'This hands-on experience as a system user now shapes how I design software: fast, clear and hard to get wrong.',
      ],
    },
  ],

  skills: [
    { group: 'Programming languages', items: ['C#', 'TypeScript', 'JavaScript', 'SQL', 'C++', 'C', 'HTML5', 'CSS3'] },
    { group: 'Frameworks', items: ['.NET', 'ASP.NET Core', 'Entity Framework Core', 'React'] },
    { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'Supabase'] },
    { group: 'Cloud & DevOps', items: ['Railway', 'Vercel', 'Supabase', 'Cloudflare', 'Microsoft Azure (working knowledge)', 'Git', 'GitHub', 'DNS & domains', 'SSL/TLS'] },
    { group: 'Practices', items: ['REST APIs', 'Auth & RBAC', 'Relational design', 'Responsive UI', 'Testing & debugging', 'Requirements analysis'] },
  ],

  education: [
    { name: 'Diploma in Information Technology', org: 'Bulawayo Polytechnic College', period: 'Jan 2026 – Dec 2027 (in progress)' },
    { name: 'Certificate in Information Technology', org: 'Bulawayo Polytechnic College', period: 'Jan 2025 – Dec 2025' },
  ],

  strengths: [
    'End-to-end ownership, from requirements to production',
    'Clear communication with non-technical users',
    'Data accuracy and integrity',
    'Fast learner of new tools and platforms',
  ],

  languages: ['English — fluent', 'Ndebele — fluent', 'Shona — fluent'],
}
