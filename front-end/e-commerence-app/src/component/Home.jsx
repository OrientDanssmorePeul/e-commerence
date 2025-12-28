import { useState, useEffect } from 'react'
import { NavLink } from "react-router"
import { Typography, Box, Button, Grid, Card, Badge } from '@mui/material'
import axios from "axios"

function Home({setCart, user, cart}) {

  const [popUp, setPopUp] = useState(false)
  const [category, setCategory] = useState(["Consoles", "Games", "Accessories", "Subscriptions"])
  const [currentCategory, setThatCategory] = useState("All Categories")
  const [product, setProduct] = useState([])

  useEffect(()=>{
    const fetchProduct = async () => {
      if(currentCategory != "All Categories"){
        const response = await fetch(`http://localhost:3000/manage/specific?category=${currentCategory}`)
        const data = await response.json()
        setProduct(data)  
      }else{
        const response = await fetch('http://localhost:3000/manage/getAll')
        const data = await response.json()
        setProduct(data)        
      }
    }
    fetchProduct()
  }, [currentCategory])

  function find(e){
    setThatCategory(e.target.value)
  }

  // async function add(order) {
  //   const exists = cart.find((item) => item._id === order._id);
  //   if(order._id){
  //       const response = await axios.post('http://localhost:3000/cart/newCart', {
  //           user: user._id,
  //           products: 
  //             exists 
  //             ? 
  //             order.map((p)=>({
  //                 productId: p._id, 
  //                 name: p.name,
  //                 price: p.price,
  //                 quantity: p.quantity + 1
  //             }))
  //             :
  //             order.map((p)=>({
  //                 productId: p._id, 
  //                 name: p.name,
  //                 price: p.price,
  //                 quantity: 1
  //             }))
  //       })
  //       const data = response.data; 
  //       setCart(data)            
  //   }
  //   setPopUp(true)
  //   setTimeout(function() {
  //     setPopUp(false)
  //   }, 4000);
  // }
  async function add(order) {
      if (!order._id) return;

      try {
          // Send the product to the backend
          const response = await axios.post('http://localhost:3000/cart/newCart', {
              user: user._id,
              products: [
                  {
                      productId: order._id,
                      name: order.name,
                      price: order.price,
                      quantity: 1 // always 1, backend will handle increments
                  }
              ]
          });

          // Update frontend cart with backend response
          setCart(response.data.products);

          // Show popup
          setPopUp(true);
          setTimeout(() => setPopUp(false), 4000);
      } catch (err) {
          console.error(err);
      }
  }

  return (
    <>
    <Box className="px-5 position-relative">
      <Card sx={{display: !popUp ? "none" : "block"}} className="m-3 z-3 p-2 position-fixed bottom-0 end-0">
        Product Added To Cart!
      </Card>
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
      <hr />  
      <Box className="d-flex justify-content-between mt -2 mx-5">
        <Typography variant='h6' sx={{fontWeight: "bold"}}>Products</Typography>
        <Button 
          variant="contained" 
          sx={{ textTransform: 'none' }}
        >
          Add New
        </Button>
      </Box>  
      <select className='mx-5' onChange={find} defaultValue="All Categories">
        <option value="All Categories">All Categories</option>
        {
          category.map((c, index)=>(
              <option key={index}>{c}</option>            
          ))
        }
      </select>

      <Grid className="my-3 d-flex justify-content-center" container spacing={2}>
        {
          product.map((e)=>(
            <Card sx={{width: {xs: "100%", sm: "500px",md: "400px" }}} className="p-3 d-flex justify-content-center flex-column" key={e._id}>
              <Typography className='mb-3' variant='h6' sx={{fontWeight: "bold"}}>{e.name}</Typography>
              <Box className="d-flex justify-content-between">
                <Badge className="text-success-emphasis bg-success px-2" sx={{fontWeight: "bold", borderRadius: "50px"}}>
                  {e.price}
                </Badge>
                <Badge className="text-warning-emphasis bg-warning px-2" sx={{fontWeight: "bold", borderRadius: "50px"}}>
                  {e.category}
                </Badge>
              </Box>
              <Button onClick={()=>add(e)} className='bg-primary my-3' variant='contained' sx={{ textTransform: 'none' }}>Add To Cart</Button>
              <Box className='d-flex justify-content-between'>
                <Button className='bg-primary' variant='contained' sx={{ textTransform: 'none' }}>Edit</Button>
                <Button className='bg-danger' variant='contained' sx={{ textTransform: 'none' }}>Delete</Button>
              </Box>
            </Card>
          ))
        }
        
      </Grid>

    </Box>

    </>
  )
}

export default Home
