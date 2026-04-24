package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private Long imageId;
    private String imageUrl;
    private Long productId;
    private LocalDateTime createdAt;
}
