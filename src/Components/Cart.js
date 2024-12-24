import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Paper,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Navbar from './Navbar'; // Import the Navbar component
import { getCartItems, updateCartItemQuantity, deleteCartItem } from '../api'; // Import API functions

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getCartItems();
                setCartItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Handle quantity change
    const handleQuantityChange = async (id, quantity) => {
        if (quantity <= 0) return;

        try {
            await updateCartItemQuantity(id, quantity);
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        }
    };

    // Handle item removal
    const handleRemoveItem = async (id) => {
        try {
            await deleteCartItem(id);
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    // Navigate to the order page
    const handleOrderNow = () => {
        navigate('/order');
    };

    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (loading) {
        return <Typography align="center">Loading...</Typography>;
    }

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Cart Items */}
            <Box sx={{ padding: 3 }}>
                {cartItems.length === 0 ? (
                    <Typography variant="h6" align="center">
                        Your cart is empty!
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {cartItems.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        height: '100%',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}
                                        >
                                            {item.productName}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}
                                        >
                                            Price: ${item.price}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#d32f2f',
                                                fontSize: '1.4rem',
                                                marginTop: 1,
                                            }}
                                        >
                                            Total: ${item.price * item.quantity}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        sx={{
                                            justifyContent: 'space-between',
                                            padding: 2,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <RemoveCircleIcon />
                                            </IconButton>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    paddingX: 1.5,
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                }}
                                            >
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                <AddCircleIcon />
                                            </IconButton>
                                        </Box>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}

                        {/* <Grid item xs={12}>
                            <Paper
                                elevation={2}
                                sx={{
                                    padding: 2,
                                    marginY: 3,
                                    backgroundColor: '#e3f2fd', // Light Blue Background
                                    color: '#1976d2', // Blue Font Color
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    textAlign: 'center', // Center-align text in the whole section
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Why Shop With Us?
                                </Typography>
                                {/* Flexbox container for centering the list */}
                        {/* <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center', // Center the list in the middle of the page
                                    alignItems: 'center', // Align items vertically in the center
                                    textAlign: 'justify', // Justify the content of list items
                                    marginTop: '1rem',
                                }}>
                                    <ul style={{
                                        padding: 0,
                                        margin: 0,
                                        listStylePosition: 'inside', // Makes bullets inside the container
                                    }}>
                                        <li>Safe and reliable delivery, ensuring your products arrive on time and in perfect condition.</li>
                                        <li>Premium quality products carefully selected to meet your needs.</li>
                                        <li>Hassle-free returns and exchanges for your convenience.</li>
                                        <li>Secure payment options, so you can shop with confidence and peace of mind.</li>
                                        <li>Enjoy exclusive discounts and offers as a valued customer.</li>
                                    </ul>
                                </Box> */}
                        {/* <Typography
                                    variant="body2"
                                    sx={{ marginTop: 2, fontStyle: 'italic' }}
                                >
                                    *Refunds and exchanges are subject to our terms and conditions.
                                </Typography>
                            </Paper>
                        </Grid> */}


                        {/* Total Amount with Order Now Button - Aligned to Right */}
                        <Grid item xs={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: 3,

                                    backgroundColor: '#f5f5f5',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    marginBottom: 2,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2 }}
                                >
                                    Total Amount: ${totalAmount}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        paddingX: 4,
                                        paddingY: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        backgroundColor: '#1976d2', // Blue button color
                                        '&:hover': { backgroundColor: '#1565c0' },
                                        position: 'absolute', // Positioning the button in the right corner
                                        right: 50,
                                        bottom: 50,
                                    }}
                                    onClick={handleOrderNow}
                                >
                                    Order Now
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </div>
    );
}

export default Cart;
