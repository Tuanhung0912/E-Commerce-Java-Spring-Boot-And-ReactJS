package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemDTO {
    private Long wishlistItemId;
    private Long productId;
    private String productName;
    private String productImage;
    private Double productPrice;
    private Double productSpecialPrice;
    private LocalDateTime createdAt;
}
