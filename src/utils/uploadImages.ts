import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

/**
 * Reusable utility to upload multiple images concurrently to Cloudinary
 * @param files Array of file paths, base64 strings, or data URIs
 * @param folder Optional destination folder inside Cloudinary
*/
export async function uploadImages(files: { image: string, folder: string }[]): Promise<UploadApiResponse[]> 
{
  try 
  {
     // Map each file to a Cloudinary upload promise
     const uploadPromises = files.map((file: any) =>  cloudinary.uploader.upload(file, { folder: file?.folder, resource_type: 'image'}));

     // Execute all uploads concurrently
     const results = await Promise.all(uploadPromises);
     return results;

  } catch (error) {

     console.error('Error uploading multiple files to Cloudinary:', error);
     throw new Error('Failed to upload images to Cloudinary');
  }
}