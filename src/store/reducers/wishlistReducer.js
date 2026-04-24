const initialState = {
    wishlist: [],
    wishlistIds: [],
    pagination: {},
    isLoading: false,
}

export const wishlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_WISHLIST_LOADING":
            return { ...state, isLoading: true };

        case "SET_WISHLIST":
            return {
                ...state,
                wishlist: action.payload,
                wishlistIds: action.payload.map((item) => item.productId),
                pagination: action.pagination || {},
                isLoading: false,
            };

        case "ADD_WISHLIST_ITEM":
            return {
                ...state,
                wishlist: [action.payload, ...state.wishlist],
                wishlistIds: [...state.wishlistIds, action.payload.productId],
            };

        case "REMOVE_WISHLIST_ITEM":
            return {
                ...state,
                wishlist: state.wishlist.filter(
                    (item) => item.wishlistItemId !== action.payload
                ),
                wishlistIds: state.wishlistIds.filter(
                    (id) => id !== action.productId
                ),
            };

        case "CLEAR_WISHLIST":
            return initialState;

        default:
            return state;
    }
};
