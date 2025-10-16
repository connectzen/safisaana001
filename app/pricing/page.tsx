'use client';

import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePricing, type PricingItem } from '@/lib/hooks/usePricing';
import { useProducts } from '@/lib/hooks/useProducts';
import type { Product } from '@/types';

// Fallback data if no pricing in Firebase
const fallbackProducts = [
  {
    type: 'plugin',
    name: 'All Plugins Access',
    description: 'Unlock every plugin in our collection',
    price: 29.99,
    features: [
      'Access to all current plugins',
      'Future plugins included',
      'Lifetime updates',
      '1 year of premium support',
      'Commercial license'
    ],
    popular: true,
    productCount: 0,
    unlocksMessage: 'Access to all plugins'
  },
  {
    type: 'ebook',
    name: 'All E-books Access',
    description: 'Get every e-book we publish',
    price: 19.99,
    features: [
      'Access to all current e-books',
      'Future e-books included',
      'PDF, EPUB, and MOBI formats',
      'Lifetime updates',
      'Bonus content access'
    ],
    popular: false,
    productCount: 0,
    unlocksMessage: 'Access to all e-books'
  },
  {
    type: 'course',
    name: 'All Courses Access',
    description: 'Complete access to our course library',
    price: 99.99,
    features: [
      'Access to all current courses',
      'Future courses included',
      'Lifetime access',
      'Certificate of completion',
      'Downloadable resources',
      'Priority Q&A support'
    ],
    popular: false,
    productCount: 0,
    unlocksMessage: 'Access to all courses'
  }
];

// Fallback data if no bundles in Firebase
const fallbackBundles = [
  {
    name: 'Starter Bundle',
    description: 'Perfect for beginners',
    price: 39.99,
    originalPrice: 49.98,
    includes: ['All Plugins Access', 'All E-books Access'],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Pro Bundle',
    description: 'For serious learners',
    price: 129.99,
    originalPrice: 149.97,
    includes: ['All Plugins Access', 'All E-books Access', 'All Courses Access'],
    buttonText: 'Get Pro',
    popular: true
  },
  {
    name: 'Ultimate Access',
    description: 'Everything we offer',
    price: 199.99,
    originalPrice: 249.97,
    includes: ['All Plugins Access', 'All E-books Access', 'All Courses Access'],
    buttonText: 'Get Ultimate',
    popular: false
  }
];

export default function PricingPage() {
  const { getActivePricing, loading } = usePricing();
  const { getProducts } = useProducts();
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const [pricingData, productsData] = await Promise.all([
        getActivePricing(),
        getProducts()
      ]);
      
      setAllProducts(productsData);
      setPricingItems(pricingData);

      // Separate products and bundles
      const productPricing = pricingData.filter(item => item.type === 'product');
      const bundlePricing = pricingData.filter(item => item.type === 'bundle');

      // Map to display format and add product counts
      const mappedProducts = productPricing.map(item => {
        // Count products of this type
        const productCount = productsData.filter(p => p.type === item.productType).length;
        return {
          type: item.productType,
          name: item.name,
          description: item.description,
          price: item.price,
          features: item.features,
          popular: item.popular,
          productCount: productCount,
          unlocksMessage: `Access to all ${productCount} ${item.productType}${productCount !== 1 ? 's' : ''}`
        };
      });

      const mappedBundles = bundlePricing.map(item => ({
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice || item.price * 1.5,
        includes: item.includes?.map(planId => {
          // Find the plan in the pricing data
          const plan = pricingData.find(p => p.id === planId);
          return plan ? plan.name : planId;
        }) || [],
        buttonText: 'Get ' + item.name.split(' ')[0],
        popular: item.popular
      }));

      // Use Firebase data or fallback
      setProducts(mappedProducts.length > 0 ? mappedProducts : fallbackProducts);
      setBundles(mappedBundles.length > 0 ? mappedBundles : fallbackBundles);
    } catch (error) {
      console.error('Error loading pricing:', error);
      // Use fallback data
      setProducts(fallbackProducts);
      setBundles(fallbackBundles);
    }
  };

  const handlePurchase = (productName: string, price: number) => {
    // Redirect to checkout page with plan details
    window.location.href = `/checkout?plan=${encodeURIComponent(productName)}&price=${price}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Products for Your Success
          </h1>
          <p className="text-xl text-gray-600">
            High-quality plugins, e-books, and courses to boost your skills and productivity
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm">
            <span className="font-semibold text-blue-900">📅 Annual Billing</span>
            <span className="text-blue-700">• All subscriptions renew yearly</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Individual Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {products.map((product, index) => (
              <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className={`${product.popular ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''} rounded-t-lg`}>
                  <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold select-text">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-600">/year</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Billed annually</p>
                    {product.popular && (
                      <span className="inline-block mt-2 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <CardDescription className="mt-1">{product.description}</CardDescription>
                  {product.unlocksMessage && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-xs font-semibold text-green-800">
                        🔓 {product.unlocksMessage}
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                  <ul className="space-y-2">
                    {product.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handlePurchase(product.name, product.price)}
                  >
                    Get {product.name.split(' ')[0]}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-center mb-8">Save with Bundles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle, index) => (
              <Card key={index} className={`h-full flex flex-col ${bundle.popular ? 'border-2 border-blue-500' : ''}`}>
                {bundle.popular && (
                  <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 text-center rounded-t-md">
                    BEST VALUE
                  </div>
                )}
                <CardHeader className={`${bundle.popular ? 'pt-4' : 'pt-6'} px-6`}>
                  <CardTitle className="text-xl font-bold">{bundle.name}</CardTitle>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold select-text">
                        ${bundle.price.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-600">/year</span>
                    </div>
                    {bundle.originalPrice > bundle.price && (
                      <div className="mt-1">
                        <span className="text-sm text-gray-500 line-through select-text">
                          ${bundle.originalPrice.toFixed(2)}/year
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Billed annually • Auto-renews</p>
                  </div>
                  <CardDescription className="mt-1">{bundle.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-2 px-6">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Includes:</h4>
                    <ul className="space-y-2">
                      {bundle.includes.map((item: string, i: number) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-center select-text">
                      Save ${(bundle.originalPrice - bundle.price).toFixed(2)} ({Math.round((1 - bundle.price / bundle.originalPrice) * 100)}%)
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto px-6 pb-6">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    variant={bundle.popular ? 'default' : 'outline'}
                    onClick={() => handlePurchase(bundle.name, bundle.price)}
                  >
                    {bundle.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              💡 Subscription Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">📅</div>
                <p className="font-semibold text-gray-900">Annual Billing</p>
                <p className="text-gray-600 mt-1">All plans billed yearly</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <p className="font-semibold text-gray-900">Auto-Renewal</p>
                <p className="text-gray-600 mt-1">Renews automatically each year</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">❌</div>
                <p className="font-semibold text-gray-900">Cancel Anytime</p>
                <p className="text-gray-600 mt-1">No long-term commitments</p>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-600">
            <p>Need help choosing? Check out our <a href="/refund-policy" className="text-blue-600 hover:underline">30-day money-back guarantee</a></p>
            <p className="mt-2 text-sm">All digital products are backed by our satisfaction guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
