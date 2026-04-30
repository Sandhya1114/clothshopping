'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductCard from '@/components/product/ProductCard';
import { getCategories, getProducts } from '@/lib/api';

const initialFilters = {
  search: '',
  category: 'all',
  size: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'default'
};

export default function ShopClient({ initialCategory = 'all' }) {
  const [filters, setFilters] = useState({
    ...initialFilters,
    category: initialCategory
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalItems: 0,
    totalPages: 0
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getCategories();
        setCategories(response.categories || []);
      } catch (loadError) {
        console.error(loadError);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      category: initialCategory
    }));
    setPage(1);
  }, [initialCategory]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const response = await getProducts({
          ...filters,
          page,
          limit: 9
        });

        setProducts(response.products || []);
        setPagination(response.pagination);
        setError('');
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [filters, page]);

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value
    }));
    setPage(1);
  }

  return (
    <div className="container section-spacing">
      <div className="shop-layout">
        <aside className="filter-panel">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="search"
              placeholder="Search by product name"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={filters.category}
              onChange={(event) => updateFilter('category', event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="size">Size</label>
            <select
              id="size"
              value={filters.size}
              onChange={(event) => updateFilter('size', event.target.value)}
            >
              <option value="all">All sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="ONE SIZE">One Size</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(event) => updateFilter('sort', event.target.value)}
            >
              <option value="default">Newest first</option>
              <option value="price-low-high">Price: Low to high</option>
              <option value="price-high-low">Price: High to low</option>
            </select>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="minPrice">Min price</label>
              <input
                id="minPrice"
                type="number"
                min="0"
                placeholder="0"
                value={filters.minPrice}
                onChange={(event) => updateFilter('minPrice', event.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="maxPrice">Max price</label>
              <input
                id="maxPrice"
                type="number"
                min="0"
                placeholder="150"
                value={filters.maxPrice}
                onChange={(event) => updateFilter('maxPrice', event.target.value)}
              />
            </div>
          </div>
        </aside>

        <div className="shop-results">
          <div className="results-summary">
            <div>
              <span className="eyebrow">Storefront API</span>
              <h2>{pagination.totalItems} products found</h2>
            </div>
            <p>Filter by category, size, or price and let the backend handle the query logic.</p>
          </div>

          {isLoading ? <LoadingSpinner label="Loading products..." /> : null}
          {error ? <p className="status-message error-message">{error}</p> : null}

          {!isLoading && !error && products.length === 0 ? (
            <EmptyState
              title="No products match these filters"
              text="Try widening the price range or switching to another category."
              actionHref="/shop"
              actionLabel="Reset filters"
            />
          ) : null}

          {!isLoading && !error && products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="pagination-bar">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
                </span>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(currentPage + 1, Math.max(pagination.totalPages, 1))
                    )
                  }
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
