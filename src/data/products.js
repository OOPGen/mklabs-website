/**
 * The four MKLabs flagship products.
 * Each entry drives its card on the home page and its own detail page
 * at /products/:slug — including the dashboard preview shown to customers.
 */

export const products = [
  {
    slug: 'pos',
    name: 'MKLabs POS',
    // has its own website; linked from the card, product page and menus
    site: { url: 'https://pos.mklabs.co.zw', label: 'pos.mklabs.co.zw' },
    category: 'Point of sale',
    icon: '🛒',
    logo: '/logo-pos.png',
    accent: '#4B0082',
    tagline: 'Sell fast. Even when the internet drops.',
    summary:
      'A point-of-sale and business management system built for Zimbabwean retail. It keeps working offline and syncs the moment your connection comes back.',
    clientImage: '/client-pos-cashier.webp',
    clientCaption: 'A cashier in Bulawayo running checkout on a tablet.',
    deviceImage: '/device-phone-pos.webp',
    deviceCaption: 'Phone at the till',
    audience: ['Shops and supermarkets', 'Hardware and wholesale', 'Restaurants and takeaways', 'Any counter with a queue'],
    features: [
      { title: 'Works offline first', body: 'Sales are recorded on the device and sync automatically when the network returns. A power cut or a dead line never stops a sale.' },
      { title: 'Stock that tracks itself', body: 'Every sale updates your stock instantly, with low-stock alerts before you run out of a fast mover.' },
      { title: 'Fast, touch-friendly checkout', body: 'Category tiles, search and barcode scanning. Trained in minutes, not days.' },
      { title: 'Daily takings at a glance', body: 'Know exactly what came through the till today, this week and this month — per branch and per cashier.' },
      { title: 'Receipts your way', body: 'Print to a thermal printer, or send a receipt by WhatsApp.' },
      { title: 'Multi-user with permissions', body: 'Cashiers see the till. Managers see the numbers. You decide who can discount or refund.' },
    ],
    dashboard: {
      title: 'MKLabs POS • Bulawayo Store',
      live: 'Today: ZWL 48,320',
      stats: [
        { label: 'Sales today', value: 'ZWL 48,320', trend: '+12.4%' },
        { label: 'Transactions', value: '184' },
        { label: 'Low stock', value: '3 items', warn: true },
      ],
      items: [
        { name: 'Coca-Cola 500ml', meta: 'ZWL 2.50 · 142 in stock' },
        { name: 'Bread loaf', meta: 'ZWL 1.80 · 63 in stock' },
        { name: 'Cooking oil 2L', meta: 'ZWL 6.40 · 28 in stock' },
      ],
    },
  },

  {
    slug: 'financeflow',
    name: 'FinanceFlow',
    category: 'Accounting & finance',
    icon: '💰',
    logo: '/logo-financeflow.png',
    accent: '#191970',
    tagline: 'Know exactly where your money is going.',
    summary:
      'Accounting, financial tracking and reporting in one dashboard — so you can make decisions from real numbers instead of guesswork.',
    clientImage: '/client-financeflow-boardroom.webp',
    clientCaption: 'FinanceFlow on the big screen in a Bulawayo boardroom.',
    deviceImage: '/device-laptop-finance.webp',
    deviceCaption: 'Laptop in the office',
    audience: ['Small and medium businesses', 'Accountants and bookkeepers', 'NGOs and project teams', 'Anyone tired of spreadsheets'],
    features: [
      { title: 'Income and expenses in one place', body: 'Record what comes in and what goes out, categorised, with receipts attached.' },
      { title: 'Cash flow you can see', body: 'A running six-month view of money in versus money out, so shortfalls stop being a surprise.' },
      { title: 'Invoices and quotations', body: 'Generate, send and track invoices. See at a glance who has paid and who is overdue.' },
      { title: 'Reports that make sense', body: 'Profit and loss, expense breakdowns and revenue trends — exportable for your accountant or your bank.' },
      { title: 'Multi-currency ready', body: 'Built for the reality of trading in more than one currency.' },
      { title: 'Boardroom-ready presentation', body: 'A dashboard clean enough to project on the wall at your next management meeting.' },
    ],
    dashboard: {
      title: 'FinanceFlow • Monthly overview',
      live: 'Updated live',
      stats: [
        { label: 'Revenue', value: '$48,240', trend: '+12.4%' },
        { label: 'Expenses', value: '$21,420' },
        { label: 'Profit', value: '$26,820', good: true },
      ],
      items: [
        { name: 'Invoices paid', meta: '38 of 44 this month' },
        { name: 'Overdue', meta: '6 invoices · $4,180' },
        { name: 'Largest expense', meta: 'Stock purchase · $9,600' },
      ],
    },
  },

  {
    slug: 'learncloud',
    name: 'LearnCloud',
    category: 'School management',
    icon: '🎓',
    logo: '/logo-learncloud.png',
    accent: '#6495ED',
    tagline: 'Run the whole school from one screen.',
    summary:
      'A complete digital platform for schools — students, academics, attendance, results and fees, all connected instead of scattered across registers and spreadsheets.',
    clientImage: '/client-learncloud-school.webp',
    clientCaption: 'LearnCloud in the classroom, on the whiteboard.',
    deviceImage: '/device-tablet-learn.webp',
    deviceCaption: 'Tablet in the classroom',
    audience: ['Primary and secondary schools', 'Colleges and training centres', 'School administrators and bursars', 'Class teachers'],
    features: [
      { title: 'One student record', body: 'Enrolment, guardians, class, subjects, medical notes and history — no more chasing paper files.' },
      { title: 'Attendance in seconds', body: 'Teachers mark a register on a tablet or phone. Patterns and absentees surface automatically.' },
      { title: 'Results and reports', body: 'Capture marks, calculate grades and generate term report cards ready to print or send.' },
      { title: 'Fees and balances', body: 'Track who has paid, what is outstanding and which parents to follow up — with receipts.' },
      { title: 'Parent communication', body: 'Send results, notices and fee reminders straight to guardians.' },
      { title: 'Roles for every user', body: 'Head, bursar, teacher and admin each see exactly what they should.' },
    ],
    dashboard: {
      title: 'LearnCloud • Bulawayo Academy',
      live: 'Term 2 · Week 6',
      stats: [
        { label: 'Students', value: '320' },
        { label: 'Attendance', value: '92%', good: true },
        { label: 'Fees due', value: '3 classes', warn: true },
      ],
      items: [
        { name: 'Form 3B attendance', meta: '28 of 30 present today' },
        { name: 'Reports ready', meta: '11 of 14 classes captured' },
        { name: 'Outstanding fees', meta: '$3,240 across 17 students' },
      ],
    },
  },

  {
    slug: 'lodgecloud',
    name: 'LodgeCloud',
    category: 'Hospitality',
    icon: '🏨',
    logo: '/logo-lodgecloud.png',
    accent: '#A78BFA',
    tagline: 'Every room, every booking, one board.',
    summary:
      'Bookings, room status, guests and occupancy for lodges and hotels — replacing the reception diary with a screen anyone on shift can read.',
    clientImage: '/client-lodgecloud-lodge.webp',
    clientCaption: 'LodgeCloud at reception in a boutique lodge.',
    deviceImage: '/device-laptop-finance.webp',
    deviceCaption: 'Reception desk',
    audience: ['Lodges and guesthouses', 'Boutique hotels', 'Self-catering and B&Bs', 'Reception and housekeeping teams'],
    features: [
      { title: 'A room board you can read at a glance', body: 'Occupied, arriving, departing, cleaning or free — colour coded across the whole property.' },
      { title: 'Bookings without double-booking', body: 'Reservations are checked against availability, so the same room never goes out twice.' },
      { title: 'Check-in and check-out', body: 'Guest details, ID, stay dates and balance captured in one flow at the desk.' },
      { title: 'Housekeeping status', body: 'Housekeeping updates room readiness live, so reception always knows what can be sold.' },
      { title: 'Occupancy and revenue', body: 'Nightly occupancy rate, average rate and revenue per period, tracked automatically.' },
      { title: 'Guest history', body: 'See returning guests, their preferences and what they spent last time.' },
    ],
    dashboard: {
      title: 'LodgeCloud • Reception',
      live: '88% occupancy',
      stats: [
        { label: 'Occupancy', value: '88%', good: true },
        { label: 'Arrivals today', value: '7' },
        { label: 'Rooms to clean', value: '4', warn: true },
      ],
      items: [
        { name: 'Room 101', meta: 'Occupied · departs tomorrow' },
        { name: 'Room 104', meta: 'Cleaning · ready by 14:00' },
        { name: 'Room 105', meta: 'Arriving 16:30 · M. Ncube' },
      ],
    },
  },
]

export function getProduct(slug) {
  return products.find((p) => p.slug === slug)
}
