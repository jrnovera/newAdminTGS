import { supabase } from './supabase';

export const uploadFile = async (file: File, bucket: string = 'photo') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`Uploading to bucket: "${bucket}", path: "${filePath}"`);

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
};

export const deleteFile = async (url: string, bucket: string = 'photo') => {
    // Extract file path from URL
    // Example URL: https://xyz.supabase.co/storage/v1/object/public/photo/filename.jpg
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];

    const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

    if (error) {
        console.error('Error deleting file:', error);
    }
};
