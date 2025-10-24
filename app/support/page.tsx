'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support request:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    }, 3000);
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
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Get a response within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">support@safisaana.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Mon-Fri, 9am-5pm EST</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Response Time</CardTitle>
              <CardDescription>Average response time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Under 4 hours</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={handleCategoryChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="product">Product Inquiry</SelectItem>
                          <SelectItem value="account">Account Support</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
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
                <CardTitle>Office Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  123 Business Street<br />
                  Suite 100<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
