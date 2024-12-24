import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../Components/ProductList'; // Adjust path based on your structure
import { fetchProducts, addToCart } from '../api'; // Assuming you're mocking API calls
import '@testing-library/jest-dom';

// Mocking the API calls
jest.mock('../api', () => ({
    fetchProducts: jest.fn(),
    addToCart: jest.fn(),
}));

describe('ProductList', () => {
    beforeEach(() => {
        // Reset mocks before each test case
        jest.resetAllMocks();
    });

    it('renders loading state initially', () => {
        fetchProducts.mockResolvedValueOnce({ data: [] });

        render(<ProductList />);

        // Check if the "Loading..." text is rendered
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('renders products after data is fetched', async () => {
        // Mock product data
        const mockProducts = [
            { id: 1, name: 'Product 1', price: 100, quantityInStock: 5 },
            { id: 2, name: 'Product 2', price: 200, quantityInStock: 10 },
        ];

        fetchProducts.mockResolvedValueOnce({ data: mockProducts });

        render(<ProductList />);

        // Wait for products to be rendered
        await waitFor(() => screen.getByText('Product 1'));

        // Check if product names are rendered
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('displays error message if fetching products fails', async () => {
        fetchProducts.mockRejectedValueOnce(new Error('Failed to fetch products'));

        render(<ProductList />);

        // Wait for error message to appear
        await waitFor(() => screen.getByText(/Failed to fetch products/i));

        // Check if error message is displayed
        expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
    });

    it('opens the dialog when the "Add to Cart" button is clicked', async () => {
        const mockProducts = [
            { id: 1, name: 'Product 1', price: 100, quantityInStock: 5 },
        ];

        fetchProducts.mockResolvedValueOnce({ data: mockProducts });

        render(<ProductList />);

        // Wait for products to render
        await waitFor(() => screen.getByText('Product 1'));

        // Click the "Add to Cart" button
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        // Check if the dialog opens
        expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
    });

    it('closes the dialog when the cancel button is clicked', async () => {
        const mockProducts = [
            { id: 1, name: 'Product 1', price: 100, quantityInStock: 5 },
        ];

        fetchProducts.mockResolvedValueOnce({ data: mockProducts });

        render(<ProductList />);

        // Wait for products to render
        await waitFor(() => screen.getByText('Product 1'));

        // Click the "Add to Cart" button
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        // Check if the dialog is opened
        expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();

        // Click the cancel button to close the dialog
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

        // Check if the dialog is closed
        expect(screen.queryByText(/Add to Cart/i)).not.toBeInTheDocument();
    });

    it('adds product to the cart and displays success snackbar', async () => {
        const mockProduct = { id: 1, name: 'Product 1', price: 100, quantityInStock: 5 };

        fetchProducts.mockResolvedValueOnce({ data: [mockProduct] });
        addToCart.mockResolvedValueOnce({ data: { ...mockProduct, quantity: 1 } });

        render(<ProductList />);

        // Wait for products to render
        await waitFor(() => screen.getByText('Product 1'));

        // Click the "Add to Cart" button
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        // Type quantity and click "Add to Cart"
        fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: 1 } });
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        // Check if snackbar with success message is shown
        await waitFor(() => screen.getByText(/Product added to cart successfully/i));
        expect(screen.getByText(/Product added to cart successfully/i)).toBeInTheDocument();
    });

    it('displays error snackbar if add to cart fails', async () => {
        const mockProduct = { id: 1, name: 'Product 1', price: 100, quantityInStock: 5 };

        fetchProducts.mockResolvedValueOnce({ data: [mockProduct] });
        addToCart.mockRejectedValueOnce(new Error('Failed to add product'));

        render(<ProductList />);

        // Wait for products to render
        await waitFor(() => screen.getByText('Product 1'));

        // Click the "Add to Cart" button
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        // Type quantity and click "Add to Cart"
        fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: 1 } });
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        // Check if snackbar with error message is shown
        await waitFor(() => screen.getByText(/Failed to add product to cart/i));
        expect(screen.getByText(/Failed to add product to cart/i)).toBeInTheDocument();
    });
});
