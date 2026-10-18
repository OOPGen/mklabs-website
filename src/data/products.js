/**
 * MKLabs Core ERP and the three systems it runs.
 * Each product drives its card on the home page and its own detail page
 * at /products/:slug — including the dashboard preview shown to customers.
 *
 * Every feature and price here matches the live app at core.mklabs.co.zw
 * (its own landing page holds the same list). If a price changes there,
 * change it here too.
 */

export const APP_ORIGIN = 'https://core.mklabs.co.zw'

/** The sign-up page, opened on the right system's form. */
const signupFor = (line) => `${APP_ORIGIN}/signup?product=${line}`

/** The platform the three systems live on — one sign-in, one support line. */
export const platform = {
  name: 'MKLabs Core ERP',
  url: APP_ORIGIN,
  label: 'core.mklabs.co.zw',
  signup: `${APP_ORIGIN}/signup`,
  tagline: 'One platform for your till, your books and your school.',
  summary:
    'MKLabs Core ERP is the platform behind MKLabs POS, MKLabs Accounting and MKLabs School. Every sale, fee and bill posts to a proper ledger as it happens, so the numbers in every system agree.',
  // true of every system — shown once instead of three times
  features: [
    { title: 'Books that keep themselves', body: 'Sales, fees, bills and payments post to a proper ledger as they happen. Your accountant gets their own login.' },
    { title: 'Made for Zimbabwe', body: 'USD and ZWG side by side, mobile money, VAT returns and ZIMRA fiscal receipts built in, not bolted on.' },
    { title: 'Load shedding ready', body: 'The till records every sale offline and syncs when the line is back. Fiscal receipts still print with their QR.' },
    { title: 'The right view for every job', body: 'Owner, manager, cashier, accountant, auditor, head, bursar and teacher each see only what they need.' },
    { title: 'No hardware to buy', body: 'Runs on the phone, tablet or laptop you already have. Install it from the browser like an app.' },
    { title: 'Support from the builders', body: 'Talk to the team that wrote the software on WhatsApp or email, not a reseller.' },
  ],
}

export const products = [
  {
    slug: 'pos',
    name: 'MKLabs POS',
    signup: signupFor('Pos'),
    category: 'Point of sale & stock',
    icon: '🛒',
    logo: '/logo-pos.webp',
    accent: '#4B0082',
    tagline: 'The till, the stockroom and the books. Even offline.',
    // search: the phrase people type, and this page's title and description
    seo: {
      keyword: 'POS system',
      title: 'MKLabs POS — Point of Sale & Stock System for Zimbabwe',
      description:
        'POS and stock system for shops, salons, bottle stores and hardware in Zimbabwe. Sells offline, takes USD and ZWG and prints ZIMRA fiscal receipts. $25 a month.',
    },
    summary:
      'A till that keeps selling through load shedding, stock across branches and warehouses, shifts and cash-up — with ZIMRA fiscal receipts and the books kept for you.',
    price: {
      amount: '$25',
      per: '/ month',
      note: 'or $250 a year — save $50',
      points: ['Up to 5 users and 1 branch', 'Each extra branch at the same price, with 5 more users', 'Warehouses free', 'Accounting, VAT and ZIMRA included', '14-day free trial'],
    },
    clientImage: '/client-pos-cashier.webp',
    clientCaption: 'A cashier in Bulawayo running checkout on a tablet.',
    deviceImage: '/device-phone-pos.webp',
    deviceCaption: 'Phone, tablet or laptop at the till',
    audience: ['Shops and supermarkets', 'Salons, barbers and repairs', 'Bottle stores and restaurants', 'Hardware and wholesale'],
    features: [
      { title: 'Touch checkout', body: 'Products and services on one till — stock, a haircut, a repair or a custom amount — with barcode scanning and held sales.' },
      { title: 'ZIMRA fiscal receipts', body: 'A virtual fiscal device per branch, built to ZIMRA’s fiscal system: every receipt signed and printed with its QR code. No fiscal box to buy.' },
      { title: 'Four currencies at the till', body: 'USD, ZWG, Rand and Pula cash at the day’s rate, plus card and mobile money. Cash-up counts each one on its own.' },
      { title: 'Shifts and cash-up', body: 'Cash floats, shift open and close, cash drops and an end-of-day sign-off with every variance shown.' },
      { title: 'Stock that fits your shop', body: 'Sizes, serial numbers, units and expiry dates. Purchase orders and goods received keep the cost right.' },
      { title: 'Branches and warehouses', body: 'Stock per branch, transfers with delivery notes and requests. Each manager sees their shop; you see them all.' },
      { title: 'Quotations that close', body: 'Branded PDF quotations with a QR code. The customer opens and accepts them online, and you turn them into a sale.' },
      { title: 'Reports that agree', body: 'Daily, weekly and monthly sales and profit, branch against branch, with VAT kept out of profit.' },
      { title: 'Sells through load shedding', body: 'The till records every sale offline and syncs the moment the line is back.' },
    ],
    dashboard: {
      title: 'MKLabs POS • Fresh Mart, Bulawayo',
      live: 'Shift open',
      stats: [
        { label: 'Sales today', value: '$1,284.50', trend: '+8.2%' },
        { label: 'Receipts', value: '146' },
        { label: 'Low stock', value: '3 items', warn: true },
      ],
      items: [
        { name: 'Cash-up', meta: 'USD $812 · ZWG 4,920 · EcoCash $214' },
        { name: 'Fiscal day', meta: 'Open · 146 receipts signed' },
        { name: 'Branch transfer', meta: 'Main → Nkulumane · 24 items' },
      ],
    },
  },

  {
    slug: 'accounting',
    name: 'MKLabs Accounting',
    signup: signupFor('Accounting'),
    category: 'Accounting & finance',
    icon: '📒',
    logo: '/logo-accounting.webp',
    accent: '#191970',
    tagline: 'Invoices, bills, the bank and VAT. Done properly.',
    // search: the phrase people type, and this page's title and description
    seo: {
      keyword: 'accounting software',
      title: 'MKLabs Accounting — Accounting Software for Zimbabwe',
      description:
        'Double-entry accounting for Zimbabwean businesses: quotes and invoices, supplier bills, bank reconciliation, ZIMRA VAT returns and statements. $5 per user a month.',
    },
    summary:
      'Full double-entry accounting for consultants, contractors, agencies and any business without a till. Quote, invoice, pay suppliers, reconcile the bank and file VAT from one place.',
    price: {
      amount: '$5',
      per: '/ user a month',
      note: 'Pay only for the people who use it',
      points: ['No user limit — add people any time', 'A new user is on your next bill', 'Invoices, bills and banking', 'VAT returns and statements', '14-day free trial'],
    },
    clientImage: '/client-accounting-boardroom.webp',
    clientCaption: 'Month-end figures from MKLabs Accounting on the big screen.',
    deviceImage: '/device-laptop-accounting.webp',
    deviceCaption: 'Laptop in the office',
    audience: ['Consultants and agencies', 'Contractors and trades', 'Accountants and bookkeepers', 'NGOs and project teams'],
    features: [
      { title: 'Double-entry, automatically', body: 'Every invoice, bill, payment and expense posts to a full chart of accounts. Lock a period once it’s done.' },
      { title: 'Quotations to invoices', body: 'Branded PDF quotes the customer accepts online, turned into an invoice in one click. Statements and who owes you what.' },
      { title: 'Suppliers and bills', body: 'Supplier bills, what is due when, and payments — with an aged list of what you owe.' },
      { title: 'Banking, reconciled', body: 'Import a bank statement, match it to the books and prove the balance — for every bank, safe and mobile money account.' },
      { title: 'VAT returns, worked out', body: 'Standard, zero-rated and exempt, checked against your books and ready to file with ZIMRA.' },
      { title: 'Financial statements', body: 'Income statement, balance sheet and cash flow for any period, compared with the last, in Excel or PDF.' },
    ],
    dashboard: {
      title: 'MKLabs Accounting • Dube Consulting',
      live: 'October',
      stats: [
        { label: 'Income', value: '$18,420', trend: '+12.4%' },
        { label: 'Expenses', value: '$7,960' },
        { label: 'Profit', value: '$10,460', good: true },
      ],
      items: [
        { name: 'Unpaid invoices', meta: '6 · $4,180 · 2 overdue' },
        { name: 'Bank reconciled', meta: 'CBZ USD · to 30 Sep' },
        { name: 'VAT return', meta: 'Jul–Aug · ready to file' },
      ],
    },
  },

  {
    slug: 'school',
    name: 'MKLabs School',
    signup: signupFor('School'),
    category: 'School management',
    icon: '🎓',
    logo: '/logo-school.webp',
    accent: '#6495ED',
    tagline: 'Fees, registers and report cards. Parents in the loop.',
    // search: the phrase people type, and this page's title and description
    seo: {
      keyword: 'school management system',
      title: 'MKLabs School — School Management System for Zimbabwe',
      description:
        'School management system for Zimbabwe: fees and receipts, EcoCash and card payments, daily registers, report cards and parents on WhatsApp. First term free.',
    },
    summary:
      'Pupils, fees, registers, exams and report cards in one system — with parents paying online and hearing from the school on WhatsApp. The school’s books are kept as you go.',
    price: {
      amount: '$0.50',
      per: '/ pupil a month',
      note: 'Pay by the term and get one month free',
      points: ['Your first term is free', 'Every staff member included', 'Fees, registers, exams and report cards', 'Online payments and WhatsApp', 'The school’s books included'],
    },
    clientImage: '/client-school-classroom.webp',
    clientCaption: 'MKLabs School on the classroom screen: today’s register and fees.',
    deviceImage: '/device-tablet-school.webp',
    deviceCaption: 'Tablet or phone in the classroom',
    audience: ['Primary and secondary schools', 'Day and boarding schools', 'Heads, bursars and admin', 'Class and subject teachers'],
    features: [
      { title: 'Pupils and guardians', body: 'Every pupil with their class, guardians and photo. Bring the whole school in from Excel in one go.' },
      { title: 'Fees and balances', body: 'Bill the term, take part payments and print receipts. Every balance updates everywhere at once.' },
      { title: 'Parents pay online', body: 'Send a pay link: EcoCash, OneMoney and cards through Paynow or Pesepay, receipted on their own.' },
      { title: 'Parents on WhatsApp', body: 'Balances, receipts, absence alerts and report cards sent to parents, with email reminders too.' },
      { title: 'Daily registers', body: 'Teachers take the register on a phone. Parents hear the same day when a child is absent.' },
      { title: 'Exams and report cards', body: 'Tests and exams per subject, ZIMSEC-style grading, class positions and printable report cards.' },
      { title: 'ID cards with QR', body: 'Print class sets of pupil ID cards. Anyone can scan the QR to check a card is real.' },
      { title: 'The head’s dashboard', body: 'Fees collected, who owes, attendance and marking for the term on one page.' },
    ],
    dashboard: {
      title: 'MKLabs School • Bulawayo Academy',
      live: 'Term 3 · Week 6',
      stats: [
        { label: 'Pupils', value: '482' },
        { label: 'Present today', value: '94%', good: true },
        { label: 'Fees owing', value: '$8,240', warn: true },
      ],
      items: [
        { name: 'Form 2B register', meta: '38 of 40 present' },
        { name: 'Report cards', meta: '11 of 14 classes ready' },
        { name: 'Paid online this week', meta: '23 payments · EcoCash and card' },
      ],
    },
  },
]

/**
 * The old product pages, forwarded so links and search results keep working:
 * FinanceFlow became MKLabs Accounting, LearnCloud became MKLabs School, and
 * LodgeCloud (not part of the platform yet) goes to the product list.
 */
export const retiredProducts = {
  '/products/financeflow': '/products/accounting',
  '/products/learncloud': '/products/school',
  '/products/lodgecloud': '/products',
}

export function getProduct(slug) {
  return products.find((p) => p.slug === slug)
}
