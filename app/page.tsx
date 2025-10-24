'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/types';

function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', emoji: '☀️' };
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', emoji: '🌤️' };
  } else if (hour >= 17 && hour < 22) {
    return { text: 'Good evening', emoji: '🌆' };
  } else {
    return { text: 'Good night', emoji: '🌙' };
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { getProducts } = useProducts();
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>('');
  const [greeting] = useState(getGreeting());
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadProducts();
  }, []);

  // Fetch user name if logged in
  useEffect(() => {
    async function fetchUserName() {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const name = userDoc.data()?.name;
            if (name) {
              setUserName(name);
              console.log('User name loaded:', name);
            } else {
              const fallbackName = user.email?.split('@')[0] || 'User';
              setUserName(fallbackName);
              console.log('Using email fallback:', fallbackName);
            }
          } else {
            const fallbackName = user.email?.split('@')[0] || 'User';
            setUserName(fallbackName);
            console.log('No user doc found, using fallback:', fallbackName);
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
          const fallbackName = user.email?.split('@')[0] || 'User';
          setUserName(fallbackName);
        }
      } else {
        setUserName('');
      }
    }
    fetchUserName();
  }, [user]);

  // Filter products based on search term and active filter
  useEffect(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(term) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => product.type === activeFilter);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, activeFilter, products]);

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      plugin: { label: 'Plugin', className: 'bg-blue-100 text-blue-800' },
      ebook: { label: 'E-book', className: 'bg-green-100 text-green-800' },
      course: { label: 'Course', className: 'bg-purple-100 text-purple-800' },
    };
    
    const { label, className } = typeMap[type] || { label: type, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {user && userName ? (
            <>
              <div className="text-5xl mb-3">{greeting.emoji}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {greeting.text}, {userName}!
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Welcome back! Discover more premium digital products to enhance your workflow
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to SAFISAANA</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Discover our premium digital products to enhance your workflow and knowledge
              </p>
            </>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Our Products</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('all')}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'plugin' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('plugin')}
            >
              Plugins
            </Button>
            <Button 
              variant={activeFilter === 'ebook' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('ebook')}
            >
              E-books
            </Button>
            <Button 
              variant={activeFilter === 'course' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('course')}
            >
              Courses
            </Button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      {getTypeBadge(product.type)}
                    </div>
                    {product.shortDescription && (
                      <CardDescription className="line-clamp-2">
                        {product.shortDescription}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <div className="mt-auto">
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button variant="outline" asChild>
                        <Link href={`/product/${product.id}`}>View Details</Link>
                      </Button>
                      <Button>Add to Cart</Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || activeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No products available at the moment.'}
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who are already using our products to boost their productivity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Browse All Products</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
