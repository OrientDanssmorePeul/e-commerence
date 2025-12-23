import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './component/Home'
import Cart from './component/Cart'
import Order from './component/Orders'
import Categories from './component/Categories'
import { Box, Button, Card, TextField, Typography } from "@mui/material"


function App() {

  const getCart = () => {
    try{
      let storage = JSON.parse(localStorage.getItem("cart"))
      if(storage != undefined || storage != null){
        return storage
      }else{
        return []
      }
    }catch(error){
      console.log(Error, "error")
    }
  }




  const [cart, setCart] = useState(getCart)
  const [orders, setOrders] = useState([])
  const [login, setLogin] = useState(
    ()=>{
      const status = sessionStorage.getItem("login")
      return status ? JSON.parse(status) : null;   
    }
  )


  useEffect(() => {
      const cartToSave = login ? cart : [];
      localStorage.setItem("cart", JSON.stringify(cartToSave));
  }, [cart, login]); 
  
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`http://localhost:3000/order/getOrder?user=${login._id}`);
      const data = await response.json();
      setOrders(data);
    };

    if (login?._id) {
      fetchOrders();
    }
  }, [orders, login])



  const name = useRef()
  const email = useRef()
  const password = useRef()






  const register = async () => {
    if(name.current.value && email.current.value && password.current.value){
      const send = await fetch("http://localhost:3000/user/newUser", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.current.value,
            email: email.current.value,
            password: password.current.value
          }),
      })
      name.current.value = ""
      email.current.value = ""
      password.current.value = ""
      if(await send.json()){
        console.log("Successfully Created")            
      }  
    }
  }
  const signIn = async () => {
    if(name.current.value && email.current.value && password.current.value){
      const send = await fetch("http://localhost:3000/user/post", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.current.value,
            email: email.current.value,
            password: password.current.value
          }),
      })
      name.current.value = ""
      email.current.value = ""
      password.current.value = ""

      const data = await send.json()

      if( data ){
        setLogin(data)
        sessionStorage.setItem("login", JSON.stringify(data))        
      }
    }
  }





  if(login){
    return (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home setCart={setCart}/>}/>
            <Route path='/cart' element={<Cart products={cart} setCart={setCart} user={login} setOrder={setOrders}/>}/>
            <Route path='/orders' element={<Order orders={orders}/>}/>
            <Route path='/category' element={<Categories/>}/>
          </Routes>
        </BrowserRouter>
    )
  }else{
      return(
      <Box sx={{minHeight: "100vh"}} className="d-flex justify-content-center align-items-center flex-column">
          <Typography variant='h5'>Login</Typography>
          <Card className='p-3 d-flex flex-column' sx={{width: "60%"}}>
              <TextField inputRef={name} className='m-1' label="Name" required/>
              <TextField inputRef={email} className='m-1' label="Email" required/>
              <TextField inputRef={password} className='m-1' label="Password" required/>
              <Box>
                <Button onClick={signIn} className='m-1'>Login</Button>
              </Box>
              <Box>
                <Button onClick={register} className='m-1'>Register</Button>
              </Box>
          </Card>
      </Box>
    )
  }

}

export default App