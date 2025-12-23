import { NavLink } from "react-router"
import { Box, Button, Card, TableFooter, TextField, Typography } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect, useRef } from "react";

const Categories = () => {

    const [category, setCategory] = useState([])
    const createCategory = useRef()

    useEffect(()=>{
        const fetchProduct = async () => {
            const response = await fetch(`http://localhost:3000/categories/getAll`)
            const data = await response.json()
            setCategory(data)  
        }
        fetchProduct()
    }, [])

    const createNew = async () => {
        if(createCategory.current.value){
            const send = await fetch("http://localhost:3000/categories/newCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: createCategory.current.value}),
            })
            const updateData = await send.json()
            setCategory([...category, updateData])
            createCategory.current.value = ""            
        }

    }

    const handleDelete = async (categ) => {
        if(categ){
            try {
                const res = await fetch(`http://localhost:3000/categories/remove/${categ}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                alert("Deleted: " + JSON.stringify(data));

                setCategory(category.filter(cat => cat._id !== categ._id));
            } catch (err) {
                alert("Deletion failed");
            }
        }
    };

    return(
        <>
            <Box className="px-5">
                <Typography
                    variant="h4"
                    sx={{ textAlign: "center", fontWeight: "bold", py: 3 }}
                >
                    Welcome To My Store
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
                <Typography variant="h5">Categories</Typography>
                <Card className="p-3 d-flex">
                    <TextField inputRef={createCategory} sx={{width: "100%"}} label="Category Name"/>
                    <Button onClick={createNew} className="bg-primary" variant="contained">add</Button>
                </Card>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                category.map((c)=>(
                                    <TableRow key={c._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{c.name}</TableCell>
                                        <TableCell align="right">
                                            <Button className="bg-primary" variant="contained" sx={{textTransform: "none"}}>Edit</Button>
                                            <Button onClick={() => handleDelete(c._id)} className="bg-danger" variant="contained" sx={{textTransform: "none"}}>Delete</Button>
                                        </TableCell>
                                    </TableRow>                                      
                                ))
                            }
                                  
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default Categories