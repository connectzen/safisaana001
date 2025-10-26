import { ref, uploadBytes, getDownloadURL, StorageError } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param folder - The folder name in Firebase Storage (e.g., 'products')
 * @returns The download URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: string = 'products'
): Promise<string> {
  try {
    // Validate storage is configured
    if (!storage) {
      throw new Error('Firebase Storage is not configured. Please check your environment variables.');
    }

    console.log('Starting image upload...', { fileName: file.name, size: file.size, type: file.type });
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      throw new Error('File must be an image (PNG, JPG, or similar)');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      throw new Error('Image size must be less than 5MB');
    }

    // Check for empty file
    if (file.size === 0) {
      throw new Error('File is empty. Please select a valid image file.');
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    console.log('Creating storage reference:', `${folder}/${fileName}`);

    // Create a reference to the file location
    const storageRef = ref(storage, `${folder}/${fileName}`);

    console.log('Uploading bytes to storage...');
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    console.log('Upload successful, getting download URL...');

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log('Image uploaded successfully!', { downloadURL });

    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      // Check for storage permission errors
      if (error.message.includes('storage/unauthorized') || error.message.includes('storage/forbidden')) {
        throw new Error('Permission denied. You may not have access to upload images.');
      }
      // Check for quota exceeded
      if (error.message.includes('storage/quota-exceeded')) {
        throw new Error('Storage quota exceeded. Please contact support.');
      }
      // Check for canceled upload
      if (error.message.includes('storage/canceled')) {
        throw new Error('Upload was canceled. Please try again.');
      }
      // Check for unknown storage errors
      if (error.message.includes('storage/unknown')) {
        throw new Error('Unknown storage error. Please try again.');
      }
      // Return original error message if it's informative
      if (error.message && !error.message.includes('Failed to upload image')) {
        throw error;
      }
    }
    
    throw new Error('Failed to upload image. Please check your internet connection and try again.');
  }
}

