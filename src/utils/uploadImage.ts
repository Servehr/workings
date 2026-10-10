import { UploadApiResponse } from "cloudinary";
import cloudinary from "vendor/cloudinary/cloudinary";


export const uploadImage = async (base64String: string, folder: string = 'uploads'): Promise<UploadApiResponse> => {
  try 
  {
    // Cloudinary natively parses Base64 Data URIs passed directly as the file argument
    const response = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'image', // Ensures asset is treated as an image
    });

    return response;

  } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
  }
};