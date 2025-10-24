"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useProducts } from "@/lib/hooks"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type ProductType = 'plugin' | 'ebook' | 'course'

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const [formData, setFormData] = useState({
    title: "",
    type: "" as ProductType,
    price: "",
    imageUrl: "",
    fileUrl: "",
    shortDescription: "",
    description: "",
    paymentLink: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { updateProduct } = useProducts()

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setFormData({
          title: data.title || "",
          type: data.type || "" as ProductType,
          price: data.price?.toString() || "",
          imageUrl: data.imageUrl || "",
          fileUrl: data.fileUrl || "",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          paymentLink: data.paymentLink || ""
        })
      } else {
        setError("Product not found")
      }
    } catch (err) {
      console.error('Error loading product:', err)
      setError("Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as ProductType
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.type) {
      setError("Please select a product type")
      return
    }

    if (!formData.imageUrl) {
      setError("Please provide an image URL")
      return
    }

    if (!formData.fileUrl) {
      setError("Please provide a file URL")
      return
    }

    try {
      setSaving(true)
      await updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price) || 0,
      })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error && !formData.title) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Update the details for your product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Product Type *</Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plugin">Plugin</SelectItem>
                      <SelectItem value="ebook">E-book</SelectItem>
                      <SelectItem value="course">Online Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Product Name *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL *</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileUrl">
                    {formData.type === 'plugin' ? 'Plugin File URL' : 
                     formData.type === 'ebook' ? 'E-book File URL' : 
                     'Course Access URL'} *
                  </Label>
                  <Input
                    id="fileUrl"
                    name="fileUrl"
                    type="url"
                    value={formData.fileUrl}
                    onChange={handleChange}
                    placeholder={
                      formData.type === 'plugin' ? 'https://example.com/plugin.zip' :
                      formData.type === 'ebook' ? 'https://example.com/ebook.pdf' :
                      'https://example.com/course-access'
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="A brief description of your product"
                    maxLength={160}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of your product"
                    rows={5}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="paymentLink">External Payment Link (Optional)</Label>
                  <Input
                    id="paymentLink"
                    name="paymentLink"
                    type="url"
                    value={formData.paymentLink}
                    onChange={handleChange}
                    placeholder="https://payment-provider.com/checkout/your-product"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Add a payment link from your preferred payment provider (Stripe, PayPal, Gumroad, etc.)
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
