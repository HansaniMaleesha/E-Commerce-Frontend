// Action to fetch products
export const fetchProductsAction = () => async (dispatch) => {
    const response = await fetchProducts();
    dispatch({ type: FETCH_PRODUCTS, payload: response.data });
};

// Action to add an item to the cart without updating product quantity
export const addToCartAction = (cartItem) => async (dispatch) => {
    // Call the API to add the item to the cart
    await addToCart(cartItem);

    // Dispatch the action to update the cart state
    dispatch({ type: ADD_TO_CART, payload: cartItem });
};

// Action to get the current cart items
export const getCartItemsAction = () => async (dispatch) => {
    const response = await getCartItems();
    dispatch({ type: UPDATE_CART, payload: response.data });
};

// Action to update the quantity of an item in the cart
export const updateCartItemQuantityAction = (cartItemId, newQuantity) => async (dispatch) => {
    await updateCartItemQuantity(cartItemId, newQuantity);
    dispatch(getCartItemsAction());
};

// Action to delete an item from the cart
export const deleteCartItemAction = (cartItemId) => async (dispatch) => {
    await deleteCartItem(cartItemId);
    dispatch(getCartItemsAction());
};

// Action to place an order and update product quantities
export const placeOrderAction = (order) => async (dispatch, getState) => {
    // Place the order in the backend
    await placeOrder(order);

    // Get the current cart items from the Redux state
    const { cart } = getState();

    // Iterate over cart items and update product quantities in the backend
    for (const cartItem of cart) {
        const newQuantity = cartItem.productQuantity - cartItem.cartQuantity;
        await updateProductQuantity(cartItem.productId, { quantity: newQuantity });
    }

    // Clear the cart after placing the order
    dispatch({ type: PLACE_ORDER });
    dispatch(getCartItemsAction());
};
