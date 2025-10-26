'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  const phoneNumber = '+254796105726';
  const email = 'safisaana001@gmail.com';
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello, I need assistance with...");
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">
            We're here to help! Get in touch with our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-[#25D366] mb-2" />
              <CardTitle>WhatsApp Support</CardTitle>
              <CardDescription>Chat with us instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{phoneNumber}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Get a response within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Mon-Fri, 9am-5pm EAT</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{phoneNumber}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* WhatsApp CTA */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#25D366]">
              <CardHeader className="text-center">
                <MessageCircle className="h-16 w-16 text-[#25D366] mx-auto mb-4" />
                <CardTitle className="text-3xl">Chat with Us on WhatsApp</CardTitle>
                <CardDescription className="text-lg">
                  Get instant support from our team
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-gray-600">
                  Have a question? Need help? Just click the button below to start a conversation with us on WhatsApp.
                </p>
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-lg font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  size="lg"
                >
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Open WhatsApp Chat
                </Button>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                  <div className="flex-1 text-center">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{phoneNumber}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ & Resources */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Documentation</h4>
                  <p className="text-sm text-muted-foreground">Browse our guides and tutorials</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">FAQ</h4>
                  <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Community Forum</h4>
                  <p className="text-sm text-muted-foreground">Connect with other users</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Nairobi, Kenya<br />
                  East Africa
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
