import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from './Navbar';

import { placeOrder, getCartItems } from '../api'; // Import necessary functions

function OrderConfirmation() {
    const [cartItems, setCartItems] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // State for opening confirmation dialog
    const [responseMessage, setResponseMessage] = useState(""); // State for backend response
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for opening Snackbar

    // Fetch cart items from API when component mounts
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await getCartItems();
                setCartItems(response.data);
            } catch (err) {
                console.error("Error fetching cart items:", err);
            }
        };
        fetchCartItems();
    }, []);

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        const order = {
            userId: 1, // Replace with actual user ID
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity
            })),
            totalPrice: totalAmount,
            orderDate: new Date().toISOString(),
        };

        try {
            const response = await placeOrder(order);
            setOrderPlaced(true);
            setCartItems([]); // Clear cart
            setResponseMessage("Order placed successfully!");
            setOpenSnackbar(true); // Show the snackbar with response
        } catch (err) {
            setError("Error placing order. Please try again.");
            console.error("Error placing order:", err);
        }
    };

    const handleConfirmOrder = () => {
        setOpenDialog(false); // Close the dialog
        handlePlaceOrder(); // Place the order
    };

    const handleCancelOrder = () => {
        setOpenDialog(false); // Close the dialog without placing the order
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false); // Close snackbar
    };

    return (
        <div>
            <Navbar />

            <Box sx={{ padding: 3, backgroundColor: '#f9f9f9' }}>
                {!orderPlaced ? (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Order Confirmation
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper elevation={3}>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left"><strong>Product Name</strong></TableCell>
                                                    <TableCell align="center"><strong>Quantity</strong></TableCell>
                                                    <TableCell align="center"><strong>Price (Each)</strong></TableCell>
                                                    <TableCell align="center"><strong>Total</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cartItems.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell align="left">{item.productName}</TableCell>
                                                        <TableCell align="center">{item.quantity}</TableCell>
                                                        <TableCell align="center">${item.price.toFixed(2)}</TableCell>
                                                        <TableCell align="center">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6">Total: ${totalAmount.toFixed(2)}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setOpenDialog(true)} // Open confirmation dialog
                                        disabled={cartItems.length === 0}
                                        sx={{ padding: '12px 36px', fontSize: '16px', fontWeight: 'bold', borderRadius: '20px' }}
                                    >
                                        Place Order
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                        {error && <Typography color="error" sx={{ textAlign: 'center', marginTop: 2 }}>{error}</Typography>}
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center' }}>
                        <Paper elevation={3} sx={{ padding: 4, display: 'inline-block', backgroundColor: '#e8f5e9' }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 50 }} />
                            <Typography variant="h5" color="success" sx={{ marginTop: 2 }}>
                                Your order has been placed successfully!
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 2 }}>
                                Thank you for your purchase. We will process your order soon.
                            </Typography>
                        </Paper>
                    </Box>
                )}

            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Confirm Order</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to place the order?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelOrder} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmOrder} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for displaying response */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={responseMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </div>
    );
}

export default OrderConfirmation;
