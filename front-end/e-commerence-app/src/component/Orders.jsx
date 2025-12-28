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

const Order = ({ orders = [] }) => { // default to empty array

  const handleDelete = async (id) => {
    if (id) {
      try {
        await fetch(`http://localhost:3000/order/remove/${id}`, {
          method: "DELETE",
        });
        // optionally refresh orders after deletion
      } catch (err) {
        alert("Deletion failed");
      }    
    }
  };

  return (
    <Box className="px-5">
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", py: 3 }}>
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <Box>{order.user?.name || "-"}</Box>
                    <Box>({order.user?.email || "-"})</Box>
                  </TableCell>

                  <TableCell>
                    {order.products?.map((p) => (
                      <Typography key={p.productId || p._id}>{p.name}</Typography>
                    ))}
                  </TableCell>

                  <TableCell>
                    {order.products?.reduce((acc, p) => acc + (p.price * p.quantity), 0) || 0}
                  </TableCell>

                  <TableCell>
                    <FormControl sx={{ minWidth: 160 }}>
                      <Select value={order.status || "Pending"}>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell>{order.paymentDate || "-"}</TableCell>

                  <TableCell>
                    {order.status === "Pending" && (
                      <Button
                        onClick={() => handleDelete(order._id)}
                        className="bg-danger"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Orders Yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Order;