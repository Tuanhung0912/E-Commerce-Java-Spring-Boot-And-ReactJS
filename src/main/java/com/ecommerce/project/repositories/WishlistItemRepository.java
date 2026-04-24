package com.ecommerce.project.repositories;

import com.ecommerce.project.model.WishlistItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    Page<WishlistItem> findByUserUserId(Long userId, Pageable pageable);

    boolean existsByUserUserIdAndProductProductId(Long userId, Long productId);

    Optional<WishlistItem> findByWishlistItemIdAndUserUserId(Long wishlistItemId, Long userId);
}
