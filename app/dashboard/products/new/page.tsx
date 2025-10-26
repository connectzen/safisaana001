"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProducts } from "@/lib/hooks"
import { uploadImage } from "@/lib/utils/uploadImage"

type ProductType = 'plugin' | 'ebook' | 'course'

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    type: "" as ProductType,
    price: "",
    imageUrl: "",
    paymentLink: "",
    shortDescription: "",
    description: ""
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { addProduct } = useProducts()

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(false)
    setUploading(false)
    
    if (!formData.type) {
      setError("Please select a product type")
      return
    }

    if (!imageFile && !formData.imageUrl) {
      setError("Please upload an image or provide an image URL")
      return
    }

    if (!formData.paymentLink) {
      setError("Please provide a payment URL")
      return
    }

    try {
      let imageUrl = formData.imageUrl

      // Upload image if file is selected
      if (imageFile) {
        console.log('Starting image upload process...')
        setUploading(true)
        try {
          imageUrl = await uploadImage(imageFile, 'products')
          console.log('Image uploaded successfully:', imageUrl)
        } catch (uploadError: any) {
          console.error('Image upload failed:', uploadError)
          setError(uploadError.message || "Failed to upload image")
          setUploading(false)
          return
        }
        setUploading(false)
      }

      console.log('Adding product to database...')
      setLoading(true)
      await addProduct({
        ...formData,
        imageUrl,
        price: parseFloat(formData.price) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log('Product added successfully')
      router.push("/dashboard")
    } catch (err: any) {
      console.error('Error adding product:', err)
      setError(err.message || "Failed to add product")
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">Add a new product to your store</p>
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
            <CardDescription>Fill in the details for your new product</CardDescription>
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

                <div className="space-y-2 md:col-span-2">
                  <Label>Product Image *</Label>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="imageFile" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              {imagePreview ? "Image selected" : "Click to upload image"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      </Label>
                      <Input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    {imagePreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      OR
                    </div>
                    <Input
                      name="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg (Optional if uploading)"
                    />
                    <p className="text-xs text-gray-500">You can either upload an image or provide a URL</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentLink">External Payment URL *</Label>
                  <Input
                    id="paymentLink"
                    name="paymentLink"
                    type="url"
                    value={formData.paymentLink}
                    onChange={handleChange}
                    placeholder="https://example.com/pay"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">URL where users will be redirected to complete payment</p>
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

              </div>

              {error && (
                <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={loading || uploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                  {uploading ? 'Uploading Image...' : loading ? 'Adding...' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
