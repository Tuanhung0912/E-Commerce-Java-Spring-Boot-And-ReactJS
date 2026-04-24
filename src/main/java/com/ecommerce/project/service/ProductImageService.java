package com.ecommerce.project.service;

import com.ecommerce.project.payload.ProductImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductImageService {
    List<ProductImageDTO> addProductImages(Long productId, MultipartFile[] images) throws IOException;

    ProductImageDTO deleteProductImage(Long imageId);

    List<ProductImageDTO> getProductImages(Long productId);
}
