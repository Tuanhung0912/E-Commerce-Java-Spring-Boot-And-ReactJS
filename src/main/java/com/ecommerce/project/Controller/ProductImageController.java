package com.ecommerce.project.Controller;

import com.ecommerce.project.payload.ProductImageDTO;
import com.ecommerce.project.service.ProductImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Product Image APIs", description = "APIs for managing product gallery images")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    // ─── Admin endpoints (ownership always checked) ──────────

    @Operation(summary = "Upload product images (Admin)", description = "Upload secondary images for a product you own")
    @PostMapping(value = "/admin/products/{productId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ProductImageDTO>> addProductImages(
            @PathVariable Long productId,
            @RequestParam("images") MultipartFile[] images) throws IOException {
        List<ProductImageDTO> savedImages = productImageService.addProductImages(productId, images);
        return new ResponseEntity<>(savedImages, HttpStatus.CREATED);
    }

    @Operation(summary = "Delete product image (Admin)", description = "Delete a secondary image from a product you own")
    @DeleteMapping("/admin/products/images/{imageId}")
    public ResponseEntity<ProductImageDTO> deleteProductImage(@PathVariable Long imageId) {
        ProductImageDTO deletedImage = productImageService.deleteProductImage(imageId);
        return new ResponseEntity<>(deletedImage, HttpStatus.OK);
    }

    // ─── Public endpoint ─────────────────────────────────────

    @Operation(summary = "Get product images", description = "Get all secondary images for a product (public)")
    @GetMapping("/public/products/{productId}/images")
    public ResponseEntity<List<ProductImageDTO>> getProductImages(@PathVariable Long productId) {
        List<ProductImageDTO> images = productImageService.getProductImages(productId);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    // ─── Seller endpoints (ownership always checked) ─────────

    @Operation(summary = "Upload product images (Seller)", description = "Upload secondary images for a product you own")
    @PostMapping(value = "/seller/products/{productId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ProductImageDTO>> addProductImagesSeller(
            @PathVariable Long productId,
            @RequestParam("images") MultipartFile[] images) throws IOException {
        List<ProductImageDTO> savedImages = productImageService.addProductImages(productId, images);
        return new ResponseEntity<>(savedImages, HttpStatus.CREATED);
    }

    @Operation(summary = "Delete product image (Seller)", description = "Delete a secondary image from a product you own")
    @DeleteMapping("/seller/products/images/{imageId}")
    public ResponseEntity<ProductImageDTO> deleteProductImageSeller(@PathVariable Long imageId) {
        ProductImageDTO deletedImage = productImageService.deleteProductImage(imageId);
        return new ResponseEntity<>(deletedImage, HttpStatus.OK);
    }
}
