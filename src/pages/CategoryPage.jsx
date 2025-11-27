// ========== FILE: src/pages/public/CategoryPage.jsx ==========
import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import API from '@/api/client';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

import Container from '@/components/ui/Container';
import Spinner from '@/components/ui/Spinner';
import ProductCard from '@/components/shared/ProductCard';
import CategoryCard from '@/components/shared/CategoryCard';
import PageHeader from '@/components/shared/PageHeader';
import FilterSidebar from '@/components/shared/FilterSidebar';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [availableBrands, setAvailableBrands] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const getInitialFilters = useCallback(() => ({
        subcategories: new Set(searchParams.getAll('subcategory').map(id => parseInt(id, 10))),
        brands: new Set(searchParams.getAll('brands')),
        sizes: new Set(searchParams.getAll('sizes')),
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'default',
    }), [searchParams]);

    const [filters, setFilters] = useState(getInitialFilters);
    const isParentCategory = category?.children?.length > 0;

    const fetchProducts = useCallback(async (page = 0, loadMore = false) => {
        if (!category) return;
        if (loadMore) setIsLoadingMore(true);
        else setIsLoading(true);

        const isParent = category.children && category.children.length > 0;
        const params = new URLSearchParams();

        filters.subcategories.forEach(id => params.append('subcategory', id));
        filters.brands.forEach(brand => params.append('brands', brand));
        filters.sizes.forEach(size => params.append('sizes', size));
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort !== 'default') params.append('sort', filters.sort);
        params.append('page', page);

        const productsApiUrl = isParent
            ? `/api/categories/${categoryId}/products?${params.toString()}`
            : `/api/products?categoryId=${categoryId}&${params.toString()}`;

        try {
            const res = await API.get(productsApiUrl);
            setProducts(prev => loadMore ? [...prev, ...res.data.content] : res.data.content);
            setPagination({ page: res.data.number, totalPages: res.data.totalPages });
        } catch (err) {
            toast.error('Could not load products.');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [categoryId, category, filters]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [catRes, brandsRes, sizesRes] = await Promise.all([
                    API.get(`/api/categories/${categoryId}`),
                    API.get('/api/products/filters/brands'),
                    API.get('/api/products/filters/sizes')
                ]);
                setCategory(catRes.data);
                setAvailableBrands(brandsRes.data);
                setAvailableSizes(sizesRes.data);
            } catch (error) {
                toast.error("Could not load category details.");
                if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
                if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
                if (newFilters.sort !== 'default') params.set('sort', newFilters.sort);
                setSearchParams(params, { replace: true });
            }, 300), [setSearchParams]);

    useEffect(() => {
        updateUrlParams(filters);
    }, [filters, updateUrlParams]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => {
            const newSet = new Set(prev[filterName]);
            if (newSet.has(value)) newSet.delete(value);
            else newSet.add(value);
            return { ...prev, [filterName]: newSet, page: 0 };
        });
    };

    const handlePriceChange = (name, value) => {
        const cleanedValue = value.replace(/[^0-9.]/g, '');
        const priceName = name === 'min' ? 'minPrice' : 'maxPrice';
        setFilters(prev => ({ ...prev, [priceName]: cleanedValue, page: 0 }));
    };

    const handleSortChange = (e) => {
        setFilters(prev => ({ ...prev, sort: e.target.value, page: 0 }));
    };

    const loadMoreProducts = () => {
        fetchProducts(pagination.page + 1, true);
    };

    return (
        <Container className="py-12">
            <PageHeader title={category?.name} subtitle={category?.description} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div className="lg:col-span-1">
                    <FilterSidebar
                        subcategories={isParentCategory ? category.children.filter(c => !c.archived) : []}
                        availableBrands={availableBrands}
                        availableSizes={availableSizes}
                        selectedSubcategories={filters.subcategories}
                        selectedBrands={filters.brands}
                        selectedSizes={filters.sizes}
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        onSubcategoryChange={(id) => handleFilterChange('subcategories', id)}
                        onBrandChange={(brand) => handleFilterChange('brands', brand)}
                        onSizeChange={(size) => handleFilterChange('sizes', size)}
                        onPriceChange={handlePriceChange}
                    />
                </div>

                <div className="lg:col-span-3">
                    <div className="flex justify-end mb-4">
                        <Select value={filters.sort} onChange={handleSortChange} className="w-full sm:w-auto">
                            <option value="default">Default Sorting</option>
                            <option value="price,asc">Price: Low to High</option>
                            <option value="price,desc">Price: High to Low</option>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center h-96"><Spinner size="lg" /></div>
                    ) : isParentCategory && filters.subcategories.size === 0 ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.children.filter(c => !c.archived).map(subcat => (
                                    <CategoryCard key={subcat.id} category={subcat} />
                                ))}
                            </div>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map(product => <ProductCard key={product.id} product={product} />)}
                            </div>
                            {pagination.page < pagination.totalPages - 1 && (
                                <div className="flex justify-center mt-12">
                                    <Button onClick={loadMoreProducts} disabled={isLoadingMore}>
                                        {isLoadingMore ? <Spinner size="sm" color="white" /> : 'Load More'}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold">No Products Found</h3>
                            <p className="text-secondary-500 mt-2">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default CategoryPage;