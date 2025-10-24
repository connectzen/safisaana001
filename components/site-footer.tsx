'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      items: [
        { name: 'All Products', href: '/' },
        { name: 'Plugins', href: '/?filter=plugin' },
        { name: 'E-books', href: '/?filter=ebook' },
        { name: 'Courses', href: '/?filter=course' },
        { name: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Support',
      items: [
        { name: 'Documentation', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'FAQs', href: '#' },
        { name: 'Community', href: '#' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'License Agreement', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold">SAFISAANA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering creators to sell digital products with ease. 
              Start, manage, and grow your digital product business with our all-in-one platform.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} SAFISAANA. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
