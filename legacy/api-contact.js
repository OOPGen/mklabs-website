// Vercel Serverless Function - /api/contact.js
// For deployment on Vercel (if using Vercel for mklabs.co.zw)
// Place in /api/contact.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const {name, company, email, phone, service, budget, message} = req.body;
  
  if(!name || !email || !message){
    return res.status(400).json({success:false, error:'Name, email, message required'});
  }

  // Here you can integrate Resend, SendGrid, etc.
  // For now, log and return success - wire to your email service
  console.log('New MKLabs Inquiry:', {name, company, email, phone, service, budget, message, date: new Date().toISOString()});

  // TODO: Integrate email service
  // Example with Resend:
  // await fetch('https://api.resend.com/emails', {method:'POST', headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify({from:'MKLabs <noreply@mklabs.co.zw>',to:'mklabs.techzw@gmail.com',subject:`New Inquiry - ${service} - ${name}`,text:`Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nBudget: ${budget}\nMessage: ${message}`})})

  return res.status(200).json({success:true, message:'Inquiry received! Check email mklabs.techzw@gmail.com or admin.html for local copy'});
}
