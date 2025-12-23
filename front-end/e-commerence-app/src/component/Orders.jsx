
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { NavLink } from "react-router";

const Order = ({orders}) => {


  return (
    <Box className="px-5">
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: "bold", py: 3 }}
      >
        My Orders
      </Typography>

      {/* NAV */}
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

      <hr />

      {/* TABLE */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Products</b></TableCell>
              <TableCell><b>Total Amount</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Payment Date</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Box>
                    {order.user.name}                    
                  </Box>
                  <Box>
                    ({order.user.email})                  
                  </Box>
                </TableCell>

                <TableCell>
                  {order.products.map((p) => (
                    <Typography key={p._id}>{p.name}</Typography>
                  ))}
                </TableCell>

                <TableCell>
                  {
                    order.products.reduce((acc, p)=>{
                      const itemTotal = p.price * p.quantity; 
                      return acc + itemTotal;
                    },0)
                  }
                </TableCell>

                <TableCell>
                  <FormControl sx={{ minWidth: 160 }}>
                    <Select value={order.status}>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  {order.paymentDate || "-"}
                </TableCell>

                <TableCell>
                  {
                    order.status == "Pending"
                    ?
                    <Button className="bg-danger" variant="contained">delete</Button>
                    :
                    null
                  }
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Order;