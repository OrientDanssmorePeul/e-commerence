import { NavLink } from "react-router"
import { Box, Button, TableFooter, Typography } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios'

const Cart = ({products, setCart, user, setOrder}) => {
    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const remove = (productId) => {
        const removedItem = products.filter((p) => p.productId !== productId);
        setCart(removedItem);
    }
    
    const addOrder = async () => {
        if (products.length === 0) return;

        try {
            // 1. Create a new order
            const orderResponse = await axios.post('http://localhost:3000/order/newOrder', {
                user: user._id,
                products: products.map(p => ({
                    productId: p._id,
                    name: p.name,
                    price: p.price,
                    quantity: p.quantity
                }))
            });

            setOrder(orderResponse.data);

            // 2. Delete the cart for this user
            await axios.delete(`http://localhost:3000/cart/deleteCartByUser/${user._id}`);

            // 3. Clear cart state on frontend
            setCart([]);

        } catch (err) {
            console.error("Failed to add order or clear cart:", err);
        }
    };
    return(
        <>
        <Box className="px-5">
            <Typography
                variant="h4"
                sx={{ textAlign: "center", fontWeight: "bold", py: 3 }}
            >
                Cart
            </Typography>    
            <nav className="navbar navbar-expand-lg d-flex justify-content-center">
                <ul className="navbar-nav gap-2">
                {[
                    { label: "Home", to: "/" },
                    { label: "Cart", to: "/cart" },
                    { label: "Order", to: "/orders" },
                    { label: "Categories", to: "/category" }
                ].map((item) => (
                    <li key={item.to} className="nav-item">
                    <NavLink
                        to={item.to}
                        style={{ borderRadius: 6 }}
                        className={({ isActive }) =>
                        isActive
                            ? "nav-link bg-primary text-white"
                            : "nav-link bg-light text-primary"
                        }
                    >
                        {item.label}
                    </NavLink>
                    </li>
                ))}
                </ul>
            </nav>
            <hr/>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            products.length > 0 
                            ?
                            products.map((p)=>{
                                return(
                                    <TableRow key={p.productId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{p.name}</TableCell>
                                        <TableCell align="right">{p.price}</TableCell>
                                        <TableCell align="right">{p.quantity}</TableCell>
                                        <TableCell align="right">{p.quantity*p.price}</TableCell>
                                        <TableCell align="right"><Button onClick={() => remove(p.productId)} className="bg-danger" variant="contained" sx={{ textTransform: "none" }}>Remove</Button></TableCell>
                                    </TableRow>                                    
                                )                              
                            })
                            :
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">No Product Added Yet!</TableCell>
                            </TableRow>                          
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} align="right" sx={{fontWeight: "bold"}}>{total}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5} align="right" sx={{fontWeight: "bold"}}>
                                <Button onClick={addOrder} className="bg-primary" variant="contained" sx={{textTransform: "none"}} >Checkout</Button>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>            
            </Box>
        </>

    )
}

export default Cart