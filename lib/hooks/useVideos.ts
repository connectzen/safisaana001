import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  uploadDate: string;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all videos from Firestore
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const videosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
      setVideos(videosData);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Add a new video
  const addVideo = async (videoData: Omit<Video, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        uploadDate: new Date().toISOString(),
      });

      await fetchVideos();
      return docRef.id;
    } catch (err) {
      console.error('Error adding video:', err);
      throw new Error('Failed to add video');
    }
  };

  // Update an existing video
  const updateVideo = async (id: string, videoData: Partial<Video>) => {
    try {
      const docRef = doc(db, 'videos', id);
      await updateDoc(docRef, videoData);
      await fetchVideos();
    } catch (err) {
      console.error('Error updating video:', err);
      throw new Error('Failed to update video');
    }
  };

  // Delete a video
  const deleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
      await fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
      throw new Error('Failed to delete video');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    deleteVideo,
    refetch: fetchVideos,
  };
}
