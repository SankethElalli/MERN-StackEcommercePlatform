import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../assets/styles/categoryBar.css';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';

const CategoryBar = () => {
  // Fetch categories from API
  const { data: categories } = useGetCategoriesQuery();
  
  // Only render if we have categories from the API
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="category-bar">
      <Container>
        <nav className="category-nav">
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category._id} className="category-item">
                <Link to={category.path} className="category-link">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
};

export default CategoryBar;
