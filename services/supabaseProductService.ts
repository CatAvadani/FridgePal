import {
  CreateProductRequest,
  Product,
  ProductDisplay,
} from '@/types/interfaces';
import { convertToProductDisplay } from '@/utils/productUtils';
import { supabase } from './supabase';

export const getProducts = async (): Promise<ProductDisplay[]> => {
  try {
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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Convert to your existing Product interface format - simplified
    const products: Product[] = data.map(
      (item: any) =>
        ({
          itemId: item.id,
          productName: item.product_name,
          quantity: item.quantity,
          creationDate: item.created_at,
          expirationDate: item.expiration_date,
          notified: false, // Default value since not in database
          categoryId: item.category_id,
          categoryName: item.categories?.name || 'Unknown',
          imageUrl: item.image_url || undefined,
        }) as Product
    );

    return products.map(convertToProductDisplay);
  } catch (error) {
    console.error('Error fetching products:', error);
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
    const { error } = await supabase.from('products').delete().eq('id', itemId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Helper function to upload image to Supabase Storage
const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    // Convert URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Storage error:', error);
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
