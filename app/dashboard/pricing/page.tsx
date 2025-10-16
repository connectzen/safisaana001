'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign, Loader2, X } from 'lucide-react';
import { usePricing, type PricingItem } from '@/lib/hooks/usePricing';
import { useProducts } from '@/lib/hooks/useProducts';
import type { Product } from '@/types';

export default function PricingManagementPage() {
  const { getPricing, addPricing, updatePricing, deletePricing, loading } = usePricing();
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [availablePlans, setAvailablePlans] = useState<PricingItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'product' as 'product' | 'bundle',
    productType: 'plugin' as 'plugin' | 'ebook' | 'course',
    price: '',
    originalPrice: '',
    description: '',
    features: '',
    popular: false,
    active: true,
  });

  // Load pricing items and products from Firebase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pricingData = await getPricing();
      setPricingItems(pricingData);
      // Only products (not bundles) can be included in bundles
      const productPlans = pricingData.filter(item => item.type === 'product');
      setAvailablePlans(productPlans);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pricingData = {
        name: formData.name,
        type: formData.type,
        productType: formData.type === 'product' ? formData.productType : undefined,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        description: formData.description,
        features: formData.features.split('\n').filter(f => f.trim()),
        includes: formData.type === 'bundle' ? selectedPlans : undefined,
        popular: formData.popular,
        active: formData.active,
      };

      if (editingItem) {
        await updatePricing(editingItem.id, pricingData);
        alert('Pricing updated successfully!');
      } else {
        await addPricing(pricingData);
        alert('Pricing created successfully!');
      }

      // Reload data
      await loadData();

      // Reset form
      setFormData({
        name: '',
        type: 'product',
        productType: 'plugin',
        price: '',
        originalPrice: '',
        description: '',
        features: '',
        popular: false,
        active: true,
      });
      setSelectedPlans([]);
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Failed to save pricing. Please try again.');
    }
  };

  const handleEdit = (item: PricingItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      productType: item.productType || 'plugin',
      price: item.price.toString(),
      originalPrice: item.originalPrice?.toString() || '',
      description: item.description,
      features: item.features.join('\n'),
      popular: item.popular,
      active: item.active,
    });
    setSelectedPlans(item.includes || []);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this pricing item?')) {
      try {
        await deletePricing(id);
        await loadData();
        alert('Pricing deleted successfully!');
      } catch (error) {
        console.error('Error deleting pricing:', error);
        alert('Failed to delete pricing. Please try again.');
      }
    }
  };

  const handlePlanToggle = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        return [...prev, planId];
      }
    });
  };

  const handleRemovePlan = (planId: string) => {
    setSelectedPlans(prev => prev.filter(id => id !== planId));
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pricing Management</h1>
            <p className="text-gray-600 mt-1">Manage your product pricing and bundles</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Pricing'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingItem ? 'Edit Pricing' : 'Add New Pricing'}</CardTitle>
              <CardDescription>
                Create or update pricing for products and bundles
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Premium Plugins"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="bundle">Bundle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.type === 'product' && (
                  <div>
                    <Label htmlFor="productType">Product Type (What this plan unlocks)</Label>
                    <Select value={formData.productType} onValueChange={(value) => handleSelectChange('productType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plugin">All Plugins</SelectItem>
                        <SelectItem value="ebook">All E-books</SelectItem>
                        <SelectItem value="course">All Courses</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Customers who buy this plan get access to all products of this type</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="29.99"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Original Price ($) - Optional</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="59.99"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Short description of the pricing option"
                    rows={2}
                    required
                  />
                </div>

                {formData.type === 'product' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Plan Access</p>
                      <p className="text-xs text-blue-700 mt-1">
                        This plan will unlock <span className="font-semibold">ALL {formData.productType}s</span> in your store
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="features">Plan Features (one per line)</Label>
                      <Textarea
                        id="features"
                        name="features"
                        value={formData.features}
                        onChange={handleInputChange}
                        placeholder="Access to all current and future {type}s&#10;Lifetime updates&#10;Priority support&#10;Commercial license"
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {formData.type === 'bundle' && (
                  <div className="space-y-3">
                    <Label>Select Pricing Plans to Include</Label>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      {availablePlans.length === 0 ? (
                        <p className="text-sm text-gray-500">No pricing plans available. Create pricing plans first.</p>
                      ) : (
                        <div className="space-y-2">
                          {availablePlans.map((plan) => (
                            <label key={plan.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedPlans.includes(plan.id)}
                                onChange={() => handlePlanToggle(plan.id)}
                                className="rounded"
                                disabled={editingItem?.id === plan.id}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{plan.name}</p>
                                  <Badge variant="outline" className="text-xs">{plan.productType}</Badge>
                                  {plan.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                                </div>
                                <p className="text-sm text-gray-500">${plan.price.toFixed(2)}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedPlans.length > 0 && (
                      <div className="mt-3">
                        <Label className="text-sm">Selected Plans ({selectedPlans.length})</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedPlans.map((planId) => {
                            const plan = availablePlans.find(p => p.id === planId);
                            return plan ? (
                              <Badge key={planId} variant="secondary" className="flex items-center gap-1">
                                {plan.name} (${plan.price.toFixed(2)})
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => handleRemovePlan(planId)}
                                />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <p className="font-medium">Total Value: ${availablePlans.filter(p => selectedPlans.includes(p.id)).reduce((sum, p) => sum + p.price, 0).toFixed(2)}</p>
                          <p className="text-xs text-gray-600 mt-1">Set your bundle price below to offer a discount</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span>Mark as Popular</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  {editingItem ? 'Update Pricing' : 'Create Pricing'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Pricing Items</CardTitle>
            <CardDescription>All pricing options for your products</CardDescription>
          </CardHeader>
          <CardContent>
            {pricingItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pricing items yet. Create your first one!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                        {item.popular && (
                          <Badge variant="secondary" className="ml-2">Popular</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.type === 'product' ? item.productType : 'bundle'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {item.price.toFixed(2)}
                          {item.originalPrice && (
                            <span className="text-xs text-gray-500 line-through ml-1">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.active ? 'default' : 'secondary'}>
                          {item.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
