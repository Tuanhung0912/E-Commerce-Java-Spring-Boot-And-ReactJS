package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.model.WishlistItem;
import com.ecommerce.project.payload.WishlistItemDTO;
import com.ecommerce.project.payload.WishlistResponse;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.WishlistItemRepository;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthUtil authUtil;

    @Override
    public WishlistItemDTO addToWishlist(Long productId) {
        User user = authUtil.loggedInUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        if (wishlistItemRepository.existsByUserUserIdAndProductProductId(user.getUserId(), productId)) {
            throw new APIException("Product is already in your wishlist");
        }

        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setUser(user);
        wishlistItem.setProduct(product);

        WishlistItem savedItem = wishlistItemRepository.save(wishlistItem);
        return mapToDTO(savedItem);
    }

    @Override
    public WishlistItemDTO removeFromWishlist(Long wishlistItemId) {
        User user = authUtil.loggedInUser();

        WishlistItem wishlistItem = wishlistItemRepository
                .findByWishlistItemIdAndUserUserId(wishlistItemId, user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("WishlistItem", "wishlistItemId", wishlistItemId));

        wishlistItemRepository.delete(wishlistItem);
        return mapToDTO(wishlistItem);
    }

    @Override
    public WishlistResponse getMyWishlist(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        User user = authUtil.loggedInUser();

        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<WishlistItem> wishlistPage = wishlistItemRepository.findByUserUserId(user.getUserId(), pageable);

        List<WishlistItemDTO> wishlistDTOs = wishlistPage.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        WishlistResponse response = new WishlistResponse();
        response.setContent(wishlistDTOs);
        response.setPageNumber(wishlistPage.getNumber());
        response.setPageSize(wishlistPage.getSize());
        response.setTotalElements(wishlistPage.getTotalElements());
        response.setTotalPages(wishlistPage.getTotalPages());
        response.setLastPage(wishlistPage.isLast());

        return response;
    }

    private WishlistItemDTO mapToDTO(WishlistItem item) {
        WishlistItemDTO dto = new WishlistItemDTO();
        dto.setWishlistItemId(item.getWishlistItemId());
        dto.setProductId(item.getProduct().getProductId());
        dto.setProductName(item.getProduct().getProductName());
        dto.setProductImage(item.getProduct().getImage());
        dto.setProductPrice(item.getProduct().getPrice());
        dto.setProductSpecialPrice(item.getProduct().getSpecialPrice());
        dto.setCreatedAt(item.getCreatedAt());
        return dto;
    }
}
