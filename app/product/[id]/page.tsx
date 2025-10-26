'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/lib/hooks';
import type { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { getProducts } = useProducts();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        const foundProduct = products.find((p: Product) => p.id === id);
        
        if (!foundProduct) {
          setError('Product not found');
          return;
        }
        
        setProduct(foundProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleCheckout = () => {
    if (!product || !product.paymentLink) return;
    // Redirect to external payment URL
    window.open(product.paymentLink, '_blank');
  };


  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      plugin: { label: 'Plugin', className: 'bg-blue-100 text-blue-800' },
      ebook: { label: 'E-book', className: 'bg-green-100 text-green-800' },
      course: { label: 'Course', className: 'bg-purple-100 text-purple-800' },
    };
    
    const { label, className } = typeMap[type] || { label: type, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </Link>
          </Button>

          <div className="bg-white rounded-2xl shadow-xl lg:grid lg:grid-cols-2 lg:max-h-[calc(100vh-160px)]">
            {/* Product Image - Fixed/Sticky Left Side */}
            <div className="lg:sticky lg:top-0 lg:self-start lg:h-[calc(100vh-160px)] bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-8 lg:p-12">
              {product.imageUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
                    </div>
                  )}
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className={`max-h-full w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Details - Scrollable Right Side */}
            <div className="lg:overflow-y-auto lg:h-[calc(100vh-160px)]">
              <div className="p-8 lg:p-12">
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.title}</h1>
                  <div className="flex items-center gap-4 mb-6 flex-wrap">
                    {getTypeBadge(product.type)}
                    <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {product.shortDescription && (
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">{product.shortDescription}</p>
                )}

                {/* CTA Section */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white text-sm font-medium">Get instant access</span>
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-6 text-lg transition-all duration-200 hover:scale-105"
                      onClick={handleCheckout}
                      disabled={!product.paymentLink}
                    >
                      Buy Now - ${Number(product.price).toFixed(2)}
                    </Button>
                    
                    {product.paymentLink && (
                      <div className="mt-4 p-3 bg-transparent">
                        <p className="text-xs text-white text-center opacity-90">
                          💡 After successful payment, you'll be redirected to download this product
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {product.description && (
                  <div className="prose max-w-none mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">{product.description}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 pb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Product Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Type</span>
                      <span className="capitalize font-semibold text-gray-900">{product.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Added</span>
                      <span className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    {product.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Updated</span>
                        <span className="text-gray-900">{new Date(product.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
