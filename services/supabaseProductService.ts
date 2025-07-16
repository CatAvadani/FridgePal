import {
  CreateProductRequest,
  Product,
  ProductDisplay,
} from '@/types/interfaces';
import { convertToProductDisplay } from '@/utils/productUtils';
import { supabase } from './supabase';

export const getProducts = async (): Promise<ProductDisplay[]> => {
  try {
    console.log('Starting getProducts...');

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        categories (
          id,
          name
        )
      `
      )
      .order('created_at', { ascending: false });

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      console.log('No products found');
      return [];
    }

    console.log(`Found ${data.length} products`);

    // Convert to your existing Product interface format - simplified
    const products: Product[] = data.map(
      (item: any) =>
        ({
          itemId: item.id,
          productName: item.product_name,
          quantity: item.quantity,
          creationDate: item.created_at,
          expirationDate: item.expiration_date,
          notified: false,
          categoryId: item.category_id,
          categoryName: item.categories?.name || 'Unknown',
          imageUrl: item.image_url || undefined,
        }) as Product
    );

    return products.map(convertToProductDisplay);
  } catch (error) {
    console.error('💥 Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (
  productData: CreateProductRequest,
  imageUri?: string | null
): Promise<ProductDisplay> => {
  try {
    // Upload image if provided
    let imageUrl = null;
    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        product_name: productData.productName,
        quantity: productData.quantity,
        expiration_date: productData.expirationDate,
        category_id: productData.categoryId,
        image_url: imageUrl,
      })
      .select(
        `
        *,
        categories (
          id,
          name
        )
      `
      )
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Convert to your existing Product interface format
    const product: Product = {
      itemId: data.id,
      productName: data.product_name,
      quantity: data.quantity,
      creationDate: data.created_at,
      expirationDate: data.expiration_date,
      notified: false,
      categoryId: data.category_id,
      categoryName: data.categories?.name || 'Unknown',
      imageUrl: data.image_url || undefined,
    };

    return convertToProductDisplay(product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  itemId: string,
  updatedData: Partial<CreateProductRequest>,
  imageUri?: string | null
): Promise<ProductDisplay> => {
  try {
    // Upload new image if provided
    let imageUrl = undefined;
    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    } else if (imageUri === null) {
      imageUrl = null; // Explicitly remove image
    }

    const updateData: any = {};
    if (updatedData.productName)
      updateData.product_name = updatedData.productName;
    if (updatedData.quantity !== undefined)
      updateData.quantity = updatedData.quantity;
    if (updatedData.expirationDate)
      updateData.expiration_date = updatedData.expirationDate;
    if (updatedData.categoryId !== undefined)
      updateData.category_id = updatedData.categoryId;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', itemId)
      .select(
        `
        *,
        categories (
          id,
          name
        )
      `
      )
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Convert to your existing Product interface format
    const product: Product = {
      itemId: data.id,
      productName: data.product_name,
      quantity: data.quantity,
      creationDate: data.created_at,
      expirationDate: data.expiration_date,
      notified: false,
      categoryId: data.category_id,
      categoryName: data.categories?.name || 'Unknown',
      imageUrl: data.image_url || undefined,
    };

    return convertToProductDisplay(product);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (itemId: string): Promise<void> => {
  try {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', itemId)
      .single();

    if (fetchError) {
      console.error('Error fetching product for deletion:', fetchError);
    }

    // Delete the image from storage FIRST if it exists
    if (product?.image_url) {
      try {
        console.log('Full image URL:', product.image_url);

        // Extract filename from URL - handle Supabase storage URL format
        // URL format: https://project.supabase.co/storage/v1/object/public/product-images/filename.jpg
        const urlParts = product.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1]; // Get the last part

        console.log('Extracted filename:', fileName);

        if (fileName && fileName !== '') {
          console.log('Attempting to delete image from storage:', fileName);

          const { data: deleteData, error: storageError } =
            await supabase.storage.from('product-images').remove([fileName]);

          console.log('Storage deletion result:', {
            deleteData,
            storageError,
          });

          if (storageError) {
            console.warn(' Storage deletion failed:', storageError);
          } else {
            console.log('Image successfully deleted from storage');
          }
        } else {
          console.warn('Could not extract filename from URL');
        }
      } catch (imageError) {
        console.warn('Error during image deletion:', imageError);
      }
    } else {
      console.log('No image to delete');
    }

    // Delete the product from database
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', itemId);

    if (deleteError) {
      console.error('Supabase error:', deleteError);
      throw deleteError;
    }

    console.log('Product deleted from database');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Helper function to upload image to Supabase Storage
const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    console.log('Starting image upload...');
    console.log('Image URI:', imageUri);

    // For React Native, use FormData approach which works better on mobile
    const formData = new FormData();

    // Create unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
    console.log('Filename:', fileName);

    // Add file to FormData - React Native handles this natively
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    } as any);

    console.log('FormData created for React Native');

    // Use direct fetch to Supabase Storage API
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found');
    }

    const uploadUrl = `${supabaseUrl}/storage/v1/object/product-images/${fileName}`;
    console.log('Upload URL:', uploadUrl);

    console.log(' Uploading via direct API call...');
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    console.log(' Upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    // Build public URL manually
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${fileName}`;
    console.log(' Public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
