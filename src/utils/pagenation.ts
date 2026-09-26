import { Model, PopulateOptions } from 'mongoose';

// 1. Define the interfaces for inputs and outputs
export interface PaginationOptions {
  currentPage?: number;
  limit?: number;
  sort?: string | Record<string, any>;
  populate?: PopulateOptions | Array<PopulateOptions | string>;
  select?: string | Record<string, number>;
}

export interface PaginatedResult<T> {
  data: T[];
  totalDocs: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

/**
 * Reusable utility to paginate mongoose queries with multiple populations
 */
export async function paginate<T>(
  model: Model<T>,
  query: Record<string, any> = {},
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  // Normalize page and limit parameters
  const currentPage = Math.max(1, options.currentPage || 1);
  const limit = Math.max(1, options.limit || 10);
  const skip = (currentPage - 1) * limit;

  // Build the core database query
  const dbQuery = model.find(query).skip(skip).limit(limit);

  // Apply sorting if provided
  if (options.sort) {
    dbQuery.sort(options.sort);
  }

  // Apply selection fields if provided
  if (options.select) {
    dbQuery.select(options.select);
  }

  // Handle multiple populations dynamically
  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach((pop: any) => dbQuery.populate(pop));
    } else {
      dbQuery.populate(options.populate);
    }
  }

  // Execute both count and query operations in parallel for performance
  const [data, totalDocs] = await Promise.all([
    dbQuery.exec(),
    model.countDocuments(query).exec(),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    data,
    totalDocs,
    limit,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null,
  };
}
