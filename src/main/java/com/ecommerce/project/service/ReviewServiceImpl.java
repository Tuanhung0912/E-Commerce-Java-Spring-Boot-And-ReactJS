package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Review;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.payload.ReviewResponse;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ReviewRepository;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AuthUtil authUtil;

    @Override
    public ReviewDTO addReview(Long productId, ReviewDTO reviewDTO) {
        User user = authUtil.loggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        // Check if user already reviewed this product
        if (reviewRepository.existsByUserUserIdAndProductProductId(user.getUserId(), productId)) {
            throw new APIException("You have already reviewed this product");
        }

        // Check if user has purchased this product
        boolean hasPurchased = hasPurchasedProduct(user.getEmail(), productId);
        if (!hasPurchased) {
            throw new APIException("You must purchase this product before reviewing");
        }

        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUser(user);
        review.setProduct(product);

        Review savedReview = reviewRepository.save(review);
        return mapToDTO(savedReview);
    }

    @Override
    public ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO) {
        User user = authUtil.loggedInUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "reviewId", reviewId));

        // Only the review owner can update
        if (!review.getUser().getUserId().equals(user.getUserId())) {
            throw new APIException("You can only update your own review");
        }

        if (reviewDTO.getRating() != null) {
            review.setRating(reviewDTO.getRating());
        }
        if (reviewDTO.getComment() != null) {
            review.setComment(reviewDTO.getComment());
        }

        Review updatedReview = reviewRepository.save(review);
        return mapToDTO(updatedReview);
    }

    @Override
    public ReviewDTO deleteReview(Long reviewId) {
        User user = authUtil.loggedInUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "reviewId", reviewId));

        // Only the review owner can delete
        if (!review.getUser().getUserId().equals(user.getUserId())) {
            throw new APIException("You can only delete your own review");
        }

        reviewRepository.delete(review);
        return mapToDTO(review);
    }

    @Override
    public ReviewResponse getReviewsByProduct(Long productId, Integer pageNumber, Integer pageSize,
            String sortBy, String sortOrder) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Review> reviewPage = reviewRepository.findByProductProductId(productId, pageable);

        List<ReviewDTO> reviewDTOs = reviewPage.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductProductId(productId);

        ReviewResponse response = new ReviewResponse();
        response.setContent(reviewDTOs);
        response.setPageNumber(reviewPage.getNumber());
        response.setPageSize(reviewPage.getSize());
        response.setTotalElements(reviewPage.getTotalElements());
        response.setTotalPages(reviewPage.getTotalPages());
        response.setLastPage(reviewPage.isLast());
        response.setAverageRating(averageRating != null ? averageRating : 0.0);
        response.setTotalReviews(totalReviews);

        return response;
    }

    private boolean hasPurchasedProduct(String email, Long productId) {
        List<Order> orders = orderRepository.findByEmailOrderByOrderDateDesc(email);
        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct().getProductId().equals(productId)) {
                    return true;
                }
            }
        }
        return false;
    }

    private ReviewDTO mapToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        dto.setUserId(review.getUser().getUserId());
        dto.setUserName(review.getUser().getUserName());
        dto.setProductId(review.getProduct().getProductId());
        dto.setProductName(review.getProduct().getProductName());
        return dto;
    }
}
