package com.ecommerce.project.Controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.WishlistItemDTO;
import com.ecommerce.project.payload.WishlistResponse;
import com.ecommerce.project.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Wishlist APIs", description = "APIs for managing user wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Tag(name = "Wishlist APIs", description = "APIs for managing wishlist")
    @Operation(summary = "Add to wishlist", description = "Add a product to the logged-in user's wishlist")
    @PostMapping("/wishlist/products/{productId}")
    public ResponseEntity<WishlistItemDTO> addToWishlist(@PathVariable Long productId) {
        WishlistItemDTO savedItem = wishlistService.addToWishlist(productId);
        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
    }

    @Tag(name = "Wishlist APIs", description = "APIs for managing wishlist")
    @Operation(summary = "Remove from wishlist", description = "Remove a product from the logged-in user's wishlist")
    @DeleteMapping("/wishlist/{wishlistItemId}")
    public ResponseEntity<WishlistItemDTO> removeFromWishlist(@PathVariable Long wishlistItemId) {
        WishlistItemDTO removedItem = wishlistService.removeFromWishlist(wishlistItemId);
        return new ResponseEntity<>(removedItem, HttpStatus.OK);
    }

    @Tag(name = "Wishlist APIs", description = "APIs for managing wishlist")
    @Operation(summary = "Get my wishlist", description = "Get the logged-in user's wishlist (paginated)")
    @GetMapping("/wishlist")
    public ResponseEntity<WishlistResponse> getMyWishlist(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_WISHLIST_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        WishlistResponse wishlistResponse = wishlistService.getMyWishlist(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(wishlistResponse, HttpStatus.OK);
    }
}
