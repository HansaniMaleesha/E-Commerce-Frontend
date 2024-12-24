import {
    FETCH_PRODUCTS,
    ADD_TO_CART,
    UPDATE_CART,
    DELETE_CART_ITEM,
    PLACE_ORDER,
} from './actions';

const initialState = {
    products: [],  // Holds the product inventory
    cart: [],      // Holds the cart items
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS:
            // Populate products when fetched
            return { ...state, products: action.payload };

        case ADD_TO_CART:
            // Add product to cart, ensure no product inventory is changed
            return { ...state, cart: [...state.cart, action.payload] };

        case UPDATE_CART:
            // Update the cart with the modified items
            return { ...state, cart: action.payload };

        case DELETE_CART_ITEM:
            // Remove a product from the cart by filtering it out
            return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) };

        case PLACE_ORDER:
            // Empty the cart once the order is placed
            return { ...state, cart: [] };

        default:
            return state;
    }
};
