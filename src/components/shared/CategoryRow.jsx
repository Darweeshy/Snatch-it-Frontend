import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const CategoryRow = ({ category, level = 0, onDeleteClick }) => {
    const navigate = useNavigate();
    
    return (
        <>
            <tr className="hover:bg-secondary-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900" style={{ paddingLeft: `${1.5 + level * 1.5}rem` }}>
                    {level > 0 && <span className="mr-2 text-secondary-400">↳</span>}
                    {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 max-w-sm truncate">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/categories/edit/${category.id}`)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDeleteClick(category)}>Archive</Button>
                </td>
            </tr>
            {category.children && category.children.map(child => (
                <CategoryRow key={child.id} category={child} level={level + 1} onDeleteClick={onDeleteClick} />
            ))}
        </>
    );
};

export default CategoryRow;