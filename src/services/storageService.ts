import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseStorage } from './firebase';

export const uploadFile = async (file: File, folder: string = 'uploads'): Promise<string> => {
  if (!firebaseStorage) {
    throw new Error('Firebase Storage is not configured.');
  }

  // Create a unique filename to prevent overwrites (or use original if preferred, but unique is safer)
  // Sanitize filename to remove special chars
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const timestamp = Date.now();
  const fullPath = `${folder}/${timestamp}_${sanitizedName}`;
  
  const storageRef = ref(firebaseStorage, fullPath);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
