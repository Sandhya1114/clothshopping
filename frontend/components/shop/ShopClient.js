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

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'ONE SIZE'];

function formatCategoryLabel(value) {
  if (!value) {
    return '';
  }

  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function ShopClient({
  initialCategory = 'all',
  title = 'All Collections',
  description = 'Discover the full collection and filter pieces without losing the live store behavior.'
}) {
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

  const totalPages = Math.max(pagination.totalPages, 1);
  const currentCategoryLabel =
    filters.category === 'all' ? 'All categories' : formatCategoryLabel(filters.category);
  const allCategoryCount = categories.reduce((total, category) => total + category.count, 0);
  const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="shop-page">
      <div className="container section-spacing">
        <div className="shop-intro">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="shop-layout luxe-shop-layout">
          <aside className="filter-panel shop-sidebar">
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
              <label htmlFor="sort">Sort By</label>
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

            <div className="filter-group">
              <div className="sidebar-heading-row">
                <label>Categories</label>
                <button
                  type="button"
                  className="text-button filter-reset-button"
                  onClick={() => {
                    setFilters({ ...initialFilters, category: initialCategory });
                    setPage(1);
                  }}
                >
                  Reset
                </button>
              </div>
              <div className="category-filter-list" role="list">
                <button
                  type="button"
                  className={filters.category === 'all' ? 'category-filter active' : 'category-filter'}
                  onClick={() => updateFilter('category', 'all')}
                >
                  <span>All</span>
                  <span>{String(allCategoryCount).padStart(2, '0')}</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    className={
                      filters.category === category.slug ? 'category-filter active' : 'category-filter'
                    }
                    onClick={() => updateFilter('category', category.slug)}
                  >
                    <span>{category.name}</span>
                    <span>{String(category.count).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="size">Sizes</label>
              <select
                id="size"
                className="visually-hidden-select"
                value={filters.size}
                onChange={(event) => updateFilter('size', event.target.value)}
              >
                <option value="all">All sizes</option>
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size === 'ONE SIZE' ? 'One Size' : size}
                  </option>
                ))}
              </select>
              <div className="size-filter-grid">
                <button
                  type="button"
                  className={filters.size === 'all' ? 'size-filter-chip active' : 'size-filter-chip'}
                  onClick={() => updateFilter('size', 'all')}
                >
                  All
                </button>
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={filters.size === size ? 'size-filter-chip active' : 'size-filter-chip'}
                    onClick={() => updateFilter('size', size)}
                  >
                    {size === 'ONE SIZE' ? 'One Size' : size}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="filter-row price-filter-row">
                <div className="filter-group">
                  <label htmlFor="minPrice" className="subtle-filter-label">
                    Min
                  </label>
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
                  <label htmlFor="maxPrice" className="subtle-filter-label">
                    Max
                  </label>
                  <input
                    id="maxPrice"
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(event) => updateFilter('maxPrice', event.target.value)}
                  />
                </div>
              </div>
            </div>
          </aside>

          <div className="shop-results">
            <div className="results-summary luxe-results-summary">
              <div>
                <span className="eyebrow">Curated Selection</span>
                <h2>{pagination.totalItems} pieces</h2>
              </div>
              <p>{currentCategoryLabel} / Page {pagination.page || 1} of {totalPages}</p>
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
                <div className="product-grid luxe-product-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="pagination-bar luxe-pagination">
                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    {'<'}
                  </button>
                  <div className="pagination-pages">
                    {paginationPages.map((paginationPage) => (
                      <button
                        key={paginationPage}
                        type="button"
                        className={paginationPage === page ? 'pagination-page active' : 'pagination-page'}
                        onClick={() => setPage(paginationPage)}
                        aria-label={`Go to page ${paginationPage}`}
                      >
                        {paginationPage}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
                    disabled={pagination.page >= pagination.totalPages}
                    aria-label="Next page"
                  >
                    {'>'}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
