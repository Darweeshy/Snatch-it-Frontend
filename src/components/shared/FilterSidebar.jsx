import React from 'react';

const FilterSection = ({ title, options, selectedOptions, onOptionChange, keyName = 'id', valueName = 'name' }) => {
    if (!options || options.length === 0) return null;

    return (
        <div className="py-6 border-b border-secondary-200">
            <h3 className="font-semibold mb-3">{title}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {options.map(option => (
                    <label key={option[keyName]} className="flex items-center text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                            checked={selectedOptions.has(option[keyName])}
                            onChange={() => onOptionChange(option[keyName])}
                        />
                        <span className="ml-3 text-secondary-600">{option[valueName]}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const FilterSidebar = ({
    subcategories,
    availableBrands,
    availableSizes,
    selectedSubcategories,
    selectedBrands,
    selectedSizes,
    onSubcategoryChange,
    onBrandChange,
    onSizeChange,
    minPrice,
    maxPrice,
    onPriceChange
}) => {
    return (
        <aside className="bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-28">
            <h2 className="text-lg font-bold border-b pb-4">Filters</h2>
            
            <FilterSection
                title="Subcategory"
                options={subcategories}
                selectedOptions={selectedSubcategories}
                onOptionChange={onSubcategoryChange}
            />

            <div className="py-6 border-b border-secondary-200">
                <h3 className="font-semibold mb-3">Price Range (EGP)</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => onPriceChange('min', e.target.value)}
                        className="w-full rounded-md border-secondary-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => onPriceChange('max', e.target.value)}
                        className="w-full rounded-md border-secondary-300 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                </div>
            </div>

            <FilterSection
                title="Brand"
                options={availableBrands.map(b => ({id: b, name: b}))}
                selectedOptions={selectedBrands}
                onOptionChange={onBrandChange}
                keyName="id"
                valueName="name"
            />

            <FilterSection
                title="Size"
                options={availableSizes.map(s => ({id: s, name: s}))}
                selectedOptions={selectedSizes}
                onOptionChange={onSizeChange}
                keyName="id"
                valueName="name"
            />
        </aside>
    );
};

export default FilterSidebar;