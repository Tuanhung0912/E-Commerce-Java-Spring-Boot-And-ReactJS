package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category findByCategoryName(String categoryName);

    // Soft delete filter queries
    Page<Category> findByIsDeletedFalse(Pageable pageable);

    Category findByCategoryNameAndIsDeletedFalse(String categoryName);
}
