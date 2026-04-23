package com.ecommerce.project.Controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.payload.ReviewResponse;
import com.ecommerce.project.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Tag(name = "Review APIs", description = "APIs for managing product reviews")
    @Operation(summary = "Add review", description = "Add a review for a product (must have purchased)")
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ReviewDTO> addReview(@PathVariable Long productId,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO savedReview = reviewService.addReview(productId, reviewDTO);
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }

    @Tag(name = "Review APIs", description = "APIs for managing product reviews")
    @Operation(summary = "Update review", description = "Update your own review")
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long reviewId,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO updatedReview = reviewService.updateReview(reviewId, reviewDTO);
        return new ResponseEntity<>(updatedReview, HttpStatus.OK);
    }

    @Tag(name = "Review APIs", description = "APIs for managing product reviews")
    @Operation(summary = "Delete review", description = "Delete your own review")
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDTO> deleteReview(@PathVariable Long reviewId) {
        ReviewDTO deletedReview = reviewService.deleteReview(reviewId);
        return new ResponseEntity<>(deletedReview, HttpStatus.OK);
    }

    @Tag(name = "Review APIs", description = "APIs for managing product reviews")
    @Operation(summary = "Get reviews by product", description = "Get all reviews for a product (public)")
    @GetMapping("/public/products/{productId}/reviews")
    public ResponseEntity<ReviewResponse> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_REVIEWS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        ReviewResponse reviewResponse = reviewService.getReviewsByProduct(productId, pageNumber, pageSize, sortBy,
                sortOrder);
        return new ResponseEntity<>(reviewResponse, HttpStatus.OK);
    }
}
