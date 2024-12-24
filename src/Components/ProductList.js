import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// images
import laptop from '../images/Laptop.jpg';
import smartphone from '../images/smartphone.jpg';
import headphone from '../images/headphone.jpg';
// files
import Navbar from './Navbar';
import { fetchProducts, addToCart } from '../api';

function ProductList() {
    const [products, setProducts] = useState([]); //  products state
    const [loading, setLoading] = useState(true); //  loading state
    const [error, setError] = useState(''); // error state
    const [cart, setCart] = useState([]); // cart state
    const [open, setOpen] = useState(false); // State to manage dialog visibility
    const [selectedProduct, setSelectedProduct] = useState(null); // Store the selected product
    const [quantity, setQuantity] = useState(1); // Track quantity input
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message

    // images for the Swiper slider
    const sliderImages = [laptop, smartphone, headphone];

    // Fetch products from backend
    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await fetchProducts(); // Get products from API
                setProducts(response.data); // Update state with fetched products
            } catch (error) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false); // Set loading to false when the request is complete
            }
        };

        fetchProductList(); // Call fetch function on mount
    }, []);

    // Open the dialog and set the selected product
    const handleOpenDialog = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    // Close the dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedProduct(null);
        setQuantity(1); // Reset quantity
    };

    const handleAddToCart = async () => {
        try {
            // Validate selected product and quantity
            if (!selectedProduct || quantity <= 0) {
                setSnackbarMessage('Invalid product or quantity.');
                setSnackbarOpen(true);
                return;
            }

            // Create the cart data payload
            const cartData = {
                productId: selectedProduct.id,       // Product ID
                productName: selectedProduct.name,   // Product Name
                quantity: Number(quantity),          // Convert quantity to number
            };

            console.log("Sending cart data:", cartData); // Debugging log

            // Make the API call to add the product to cart
            const response = await addToCart(cartData);

            // Update cart state
            setCart((prevCart) => [...prevCart, response.data]);

            // Display success message
            setSnackbarMessage('Product added to cart successfully!');
            setSnackbarOpen(true);

            // Close the dialog
            handleCloseDialog();
        } catch (error) {
            console.error('Error adding product to cart:', error);

            // Display error message
            setSnackbarMessage('Failed to add product to cart. Please try again.');
            setSnackbarOpen(true);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Swiper Image Slider */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay]} // Register modules
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                style={{ width: '100%', height: '400px', marginBottom: '20px', marginTop: '20px' }}
            >
                {sliderImages.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain', // Ensure the full image is visible
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Products Grid */}
            <Grid container spacing={3} sx={{ padding: 2 }}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Card
                            sx={{
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effect
                                '&:hover': {
                                    transform: 'scale(1.05)', // Slightly increase the size on hover
                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Add a stronger shadow on hover
                                },
                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', // Initial shadow
                                height: '100%', // Make the card take full height of its container
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 1 }}>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price: ${product.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                    Available Quantity: {product.quantityInStock}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleOpenDialog(product)}
                                    sx={{
                                        '&:hover': {
                                            color: '#1976d2', // Change color on hover
                                        },
                                    }}
                                >
                                    <ShoppingCartIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add to Cart Dialog */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',  // Center horizontally
                    alignItems: 'center',      // Center vertically
                    minHeight: '100vh',
                    // Ensure the dialog covers the full height of the viewport
                }}
            >
                <DialogTitle sx={{ padding: '20px', fontSize: '20px', fontWeight: 'bold', color: '#007BFF', textAlign: 'center' }}>
                    Add to Cart
                </DialogTitle>
                <DialogContent sx={{ padding: '20px' }}>
                    {selectedProduct && (
                        <div>
                            <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                                {selectedProduct.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                                Price: ${selectedProduct.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                                Available Quantity: {selectedProduct.quantityInStock}
                            </Typography>
                            <TextField
                                type="number"
                                label="Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                fullWidth
                                sx={{ marginTop: 2 }}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        max: selectedProduct.quantityInStock, // Prevent selection of quantity greater than available stock
                                    },
                                }}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: '20px' }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="secondary"
                        sx={{
                            padding: '10px 20px', // Increase padding for the cancel button
                            fontSize: '16px',
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddToCart}
                        color="primary"
                        sx={{
                            padding: '10px 20px', // Increase padding for the add to cart button
                            fontSize: '16px',
                        }}
                    >
                        Add to Cart
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for alerts */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Auto-hide after 3 seconds
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ProductList;
