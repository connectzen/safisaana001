# Firebase Integration Example

## How to Use Firebase Hooks in Your Dashboard

### Example: Images Page with Firebase

Here's how to integrate the `useImages` hook into your images page:

```typescript
"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useImages } from "@/lib/hooks"

export default function ImagesPage() {
  // Use the Firebase hook
  const { images, loading, error, deleteImage } = useImages();

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(id, imageUrl);
      } catch (err) {
        alert('Failed to delete image');
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading images...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Images</h1>
            <p className="text-muted-foreground mt-2">Manage your project and gallery images</p>
          </div>
          <Link href="/dashboard/images/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Image
            </Button>
          </Link>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{image.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{image.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded: {new Date(image.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleDelete(image.id, image.imageUrl)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {images.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground mb-4">Get started by uploading your first image</p>
              <Link href="/dashboard/images/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Image
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
```

### Example: Adding a New Image

Create a form component to add new images:

```typescript
"use client"

import { useState } from 'react';
import { useImages } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function NewImagePage() {
  const { addImage } = useImages();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Gallery',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    try {
      await addImage(
        {
          title: formData.title,
          category: formData.category,
          imageUrl: '', // Will be set by the hook
          uploadDate: '', // Will be set by the hook
        },
        file
      );
      router.push('/dashboard/images');
    } catch (err) {
      alert('Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Image Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="Gallery">Gallery</option>
        <option value="Ongoing Project">Ongoing Project</option>
        <option value="Completed Project">Completed Project</option>
      </select>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Add Image'}
      </Button>
    </form>
  );
}
```

## Next Steps

1. **Set up Firestore Collections**: Create collections in Firebase Console:
   - `images`
   - `videos`
   - `team`
   - `settings`

2. **Configure Storage Rules**: Set up Firebase Storage security rules

3. **Update Dashboard Pages**: Replace mock data with Firebase hooks in:
   - `/app/dashboard/images/page.tsx`
   - `/app/dashboard/videos/page.tsx`
   - `/app/dashboard/team/page.tsx`

4. **Add Authentication** (Optional): Protect dashboard routes with Firebase Auth

## Available Hooks

- `useImages()` - CRUD operations for images
- `useVideos()` - CRUD operations for videos
- `useTeam()` - CRUD operations for team members

All hooks return:
- `data` - Array of items
- `loading` - Loading state
- `error` - Error message (if any)
- `add*` - Function to add new item
- `update*` - Function to update item
- `delete*` - Function to delete item
- `refetch` - Function to manually refresh data
