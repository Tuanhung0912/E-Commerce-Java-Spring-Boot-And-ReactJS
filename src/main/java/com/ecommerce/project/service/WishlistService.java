package com.ecommerce.project.service;

import com.ecommerce.project.payload.WishlistItemDTO;
import com.ecommerce.project.payload.WishlistResponse;

public interface WishlistService {
    WishlistItemDTO addToWishlist(Long productId);

    WishlistItemDTO removeFromWishlist(Long wishlistItemId);

    WishlistResponse getMyWishlist(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
