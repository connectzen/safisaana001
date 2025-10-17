'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { checkUserOwnsProduct } from '@/lib/purchases';
import { ShoppingCart, CheckCircle2, Lock } from 'lucide-react';
import type { Product } from '@/types';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownsProduct, setOwnsProduct] = useState(false);
  const [checkingOwnership, setCheckingOwnership] = useState(true);
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
        
        // Check if user owns this product
        if (user) {
          setCheckingOwnership(true);
          const owns = await checkUserOwnsProduct(user.uid, id as string);
          setOwnsProduct(owns);
          setCheckingOwnership(false);
        } else {
          setOwnsProduct(false);
          setCheckingOwnership(false);
        }
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
  }, [id, user]);

  const handleBuyNow = () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=/product/${id}`);
      return;
    }
    
    // Redirect to checkout with product details
    router.push(`/checkout?plan=${encodeURIComponent(product?.title || '')}&price=${product?.price}&productId=${id}`);
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
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </Button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="max-h-96 w-auto object-contain"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center mb-4">
                    {getTypeBadge(product.type)}
                    <span className="ml-4 text-2xl font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {product.shortDescription && (
                <p className="text-gray-700 text-lg mb-6">{product.shortDescription}</p>
              )}

              {product.description && (
                <div className="prose max-w-none mb-8">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>
              )}

              <div className="flex flex-col space-y-4 mt-8">
                {checkingOwnership ? (
                  <Button size="lg" className="w-full py-6 text-lg" disabled>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Checking ownership...
                  </Button>
                ) : ownsProduct ? (
                  <>
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-900 font-semibold text-lg">You Own This Product!</p>
                      <p className="text-green-700 text-sm mt-1">Access your purchase below</p>
                    </div>
                    {product.fileUrl && (
                      <Button size="lg" className="w-full py-6 text-lg bg-green-600 hover:bg-green-700" asChild>
                        <a href={product.fileUrl} target="_blank" rel="noopener noreferrer">
                          Access Product
                        </a>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button size="lg" className="w-full py-6 text-lg" onClick={handleBuyNow}>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Buy Now - ${Number(product.price).toFixed(2)}
                    </Button>
                    {!user && (
                      <p className="text-sm text-center text-muted-foreground">
                        <Lock className="inline h-3 w-3 mr-1" />
                        Please log in to purchase
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <div className="flex">
                    <span className="w-24 text-gray-500">Type</span>
                    <span className="capitalize">{product.type}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-500">Added</span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  {product.updatedAt && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Updated</span>
                      <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
