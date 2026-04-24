package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.ProductImage;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.ProductImageDTO;
import com.ecommerce.project.repositories.ProductImageRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private AuthUtil authUtil;

    @Value("${project.image}")
    private String path;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Override
    public List<ProductImageDTO> addProductImages(Long productId, MultipartFile[] images) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        validateOwnership(product);

        List<ProductImageDTO> savedDTOs = new ArrayList<>();
        for (MultipartFile file : images) {
            String fileName = fileService.uploadImage(path, file);

            ProductImage productImage = new ProductImage();
            productImage.setImageName(fileName);
            productImage.setProduct(product);

            ProductImage saved = productImageRepository.save(productImage);
            savedDTOs.add(mapToDTO(saved));
        }
        return savedDTOs;
    }

    @Override
    public ProductImageDTO deleteProductImage(Long imageId) {
        ProductImage productImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "imageId", imageId));

        validateOwnership(productImage.getProduct());

        ProductImageDTO dto = mapToDTO(productImage);
        productImageRepository.delete(productImage);
        return dto;
    }

    @Override
    public List<ProductImageDTO> getProductImages(Long productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        List<ProductImage> images = productImageRepository.findByProductProductId(productId);
        return images.stream().map(this::mapToDTO).toList();
    }

    private void validateOwnership(Product product) {
        User currentUser = authUtil.loggedInUser();
        if (!product.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new APIException("You can only manage images for your own products");
        }
    }

    private ProductImageDTO mapToDTO(ProductImage productImage) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setImageId(productImage.getImageId());
        dto.setImageUrl(constructImageUrl(productImage.getImageName()));
        dto.setProductId(productImage.getProduct().getProductId());
        dto.setCreatedAt(productImage.getCreatedAt());
        return dto;
    }

    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }
}
