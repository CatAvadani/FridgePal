import {
  CreateProductRequest,
  Product,
  ProductDisplay,
} from '@/types/interfaces';
import {
  convertToProductDisplay,
  mapSupabaseProductToProduct,
} from '@/utils/productUtils';
import { supabase } from './supabase';

const PRODUCT_IMAGES_BUCKET = 'product-images';

export const getProducts = async (): Promise<ProductDisplay[]> => {
  try {
    // Get current user first
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('User not authenticated:', userError);
      throw new Error('User not authenticated');
    }

    console.log(' Fetching products for user:', user.email);

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
      .eq('user_id', user.id) // Only get products for this user
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    console.log(`Found ${data.length} products for user`);

    const products: Product[] = data.map(mapSupabaseProductToProduct);
    return products.map(convertToProductDisplay);
  } catch (error) {
    console.log('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (
  productData: CreateProductRequest,
  imageUri?: string | null
): Promise<ProductDisplay> => {
  try {
    // Get current user first
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('User not authenticated:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Creating product for user:', user.email);

    let imageUrl = null;
    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
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

    if (error) throw error;
    if (!data) throw new Error('Product not created');

    const product: Product = mapSupabaseProductToProduct(data);
    return convertToProductDisplay(product);
  } catch (error) {
    console.log('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  itemId: string,
  updatedData: Partial<CreateProductRequest>,
  imageUri?: string | null
): Promise<ProductDisplay> => {
  try {
    // Get current user first
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('User not authenticated:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Updating product for user:', user.email);

    let imageUrl = undefined;
    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    } else if (imageUri === null) {
      imageUrl = null;
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
      .eq('user_id', user.id)
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

    if (error) throw error;
    if (!data) throw new Error('Product not updated');

    const product: Product = mapSupabaseProductToProduct(data);
    return convertToProductDisplay(product);
  } catch (error) {
    console.log('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (itemId: string): Promise<void> => {
  try {
    // Get current user first
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('User not authenticated:', userError);
      throw new Error('User not authenticated');
    }

    console.log(' Deleting product for user:', user.email);

    // First, get the product to find the image URL (and verify ownership)
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', itemId)
      .eq('user_id', user.id) // Ensure user can only delete their own products
      .single();

    if (fetchError)
      console.log('Error fetching product for deletion:', fetchError);

    // Delete image from storage if it exists
    if (product?.image_url) {
      try {
        const imageUrl = product.image_url;
        const filePath = imageUrl.split(`/${PRODUCT_IMAGES_BUCKET}/`)[1];

        if (filePath) {
          console.log('Deleting image:', filePath);
          const { error: storageError } = await supabase.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .remove([filePath]);
          if (storageError) {
            console.warn('Storage deletion failed:', storageError);
          } else {
            console.log('Image deleted from storage');
          }
        }
      } catch (imageError) {
        console.warn('Error during image deletion:', imageError);
      }
    }

    // Delete the product from database
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id); // Ensure user can only delete their own products

    if (deleteError) throw deleteError;

    console.log('Product deleted from database');
  } catch (error) {
    console.log('Error deleting product:', error);
    throw error;
  }
};

const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    // Get current user for unique file naming
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const formData = new FormData();
    // Include user ID in filename to avoid conflicts
    const fileName = `${user?.id || 'anon'}-${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    } as any);

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey)
      throw new Error('Supabase credentials not found');

    const uploadUrl = `${supabaseUrl}/storage/v1/object/${PRODUCT_IMAGES_BUCKET}/${fileName}`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.log('Error uploading image:', error);
    throw error;
  }
};
