package com.ecommerce.project.service;

import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.payload.ReviewResponse;

public interface ReviewService {
    ReviewDTO addReview(Long productId, ReviewDTO reviewDTO);

    ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO);

    ReviewDTO deleteReview(Long reviewId);

    ReviewResponse getReviewsByProduct(Long productId, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder);
}
