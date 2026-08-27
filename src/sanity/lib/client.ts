import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'
import { sanityFetch } from '@/sanity/lib/live'
import { Product, ProductCategory } from '@/sanity.types'

const isConfigured = projectId !== 'placeholder'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const emptyArray: never[] = []

export const getAllProducts = async (): Promise<Product[]> => {
  if (!isConfigured) return emptyArray as Product[]
  try {
    const query = `*[_type == "product"]`
    const products = await sanityFetch({ query: query })
    return products.data as Product[];
  } catch {
    return emptyArray as Product[]
  }
}

export const getAllCategories = async (): Promise<ProductCategory[]> => {
  if (!isConfigured) return emptyArray as ProductCategory[]
  try {
    const query = `*[_type == "productCategory"]`
    const categories = await sanityFetch({ query: query })
    return categories.data as ProductCategory[];
  } catch {
    return emptyArray as ProductCategory[]
  }
}

export const getCategoryBySlug = async (slug: string): Promise<ProductCategory | null> => {
  if (!isConfigured) return null
  try {
    const query = `*[_type == "productCategory" && slug.current == $slug][0]`
    const category = await sanityFetch({ query: query, params: { slug } });
    return category.data as ProductCategory;
  } catch {
    return null
  }
}

export const getProductsByCategorySlug = async (slug: string): Promise<Product[]> => {
  if (!isConfigured) return emptyArray as Product[]
  try {
    const query = `*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug][0]._id)]`
    const products = await sanityFetch({ query: query, params: { slug } });
    return products.data as Product[];
  } catch {
    return emptyArray as Product[]
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!isConfigured) return null
  try {
    const query = `*[_type == "product" && _id == $id][0]`;
    const product = await sanityFetch({ query: query, params: { id } });
    return product.data as Product;
  } catch {
    return null
  }
}

export const searchProducts = async (searchQuery: string): Promise<Product[]> => {
  if (!isConfigured) return emptyArray as Product[]
  try {
    const query = `*[_type == "product" && (
      title match "*" + $searchQuery + "*" ||
      description match "*" + $searchQuery + "*" ||
      category->title match "*" + $searchQuery + "*" ||
      category->slug.current match "*" + $searchQuery + "*"
    )]`;

    const products = await sanityFetch({ query: query, params: { searchQuery } });
    return products.data as Product[];
  } catch {
    return emptyArray as Product[]
  }
}
