import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    E-Commerce App
                </Typography>
                <Button color="inherit" href="/">
                    Home
                </Button>
                <Button color="inherit" href="/cart">
                    Cart
                </Button>
                <Button color="inherit" href="/order">
                    Order
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
