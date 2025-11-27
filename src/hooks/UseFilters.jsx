// In a new file: src/hooks/useFilters.js
import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';

export const useFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedSubcategories, setSelectedSubcategories] = useState(() => new Set(searchParams.getAll('subcategory').map(Number)));
    const [selectedBrands, setSelectedBrands] = useState(() => new Set(searchParams.getAll('brands')));
    const [selectedSizes, setSelectedSizes] = useState(() => new Set(searchParams.getAll('sizes')));
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'default');

    const updateSearchParams = useCallback(debounce((newParams) => {
        setSearchParams(newParams, { replace: true });
    }, 500), [setSearchParams]);

    // Handlers to update state and search params
    // ... implementation for handleSubcategoryChange, handleBrandChange etc.
    // Example for one handler:
    const handleBrandChange = (brand) => {
        const newBrands = new Set(selectedBrands);
        if (newBrands.has(brand)) newBrands.delete(brand);
        else newBrands.add(brand);
        setSelectedBrands(newBrands);
        
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('brands');
        newBrands.forEach(b => newParams.append('brands', b));
        updateSearchParams(newParams);
    };

    return { 
        /* return all states and handlers */
        selectedBrands, handleBrandChange
    };
};