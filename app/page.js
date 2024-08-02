"use client"
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { collection, doc, getDoc, getDocs, setDoc, query } from 'firebase/firestore'

export default function Home(){
  const [items, setItems] = useState([]) //For the current list in inventory. Default value of empty array
  const [open, setOpen] = useState(false) //For modal
  const [itemName, setItemName] = useState("") //For the typed out item (for add and removal)

  const updateInventory = async () => { //async function means it won't block our code (website freeze) while fetching from database
    //This helper function is called by others to fetch inventory data
    const snapshot = query(collection(firestore, 'Pantry'))  //This is to get what the new and old we have in the database. Uses firestore instance and collection name
    const docs =  await getDocs(snapshot) //Getting the docs in the collection
    const inventoryList = []
    docs.forEach((doc) => { //for each document
      inventoryList.push({ //push a new object into the list
        name: doc.id,
        ...doc.data(),
      })
    })
    setItems(inventoryList)  //Update the inventory state variable
  } 

  const addItems = async(item) => { //Parameter 'item' is needed
    //A helper function in order add items to the list
    const docRef = doc(collection(firestore, 'Pantry'), item) //Able to get the exact document with the item
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){ //If document exists, just add the count
      const {count} = docSnap.data() //Getting the count field from the doc data
      await setDoc(docRef, {count: count + 1})
    }else{ //Create new item
      await setDoc(docRef, {count: 1})
    }
    await updateInventory()
  }

  const removeItems = async(item) => { //Parameter 'item' is needed
    //A helper function in order remove items or data from the list
    const docRef = doc(collection(firestore, 'Pantry'), item) //Able to get the exact document with the item
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {count} = docSnap.data() //Getting the count field from the doc data
      if(count ===  1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {count: count - 1})
      }
    }
    await updateInventory()
  }

  useEffect(() => { //Runs the following code at the rendering of a page. Empty dependency array means running once. 
    updateInventory()
  }, [])

  //Model functions
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
      
  return(
    <Box
    width = "100vw" //The full length of the screen
    height = "100vh"
    display='flex'
    flexDirection={'column'}
    justifyContent="center" //Centers it horizontally
    alignItems='center' //Centers it vertically
    gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}>
          <Box //The properties are to make the box truly centered
          position='absolute'
          top='50%' left='50%'
          width={400} bgcolor='white'
          border='2px solid #000'
          boxShadow={24} p={4} display='flex' flexDirection='column' gap={3}
          sx={{ //Using custom style instead of pre-built components
            transform:'translate(-50%,-50%)'
          }}>
            <Typography variant='h6'>Add Item</Typography>
            <Stack //Organizes everything inside in a stack format 
            width='100%'
            direction='row' //stacks in a horizontal way
            spacing={2} //So verything isn't smushed
            >  
              <TextField //Saves the value of user input
              variant='outlined' 
              fullwidth 
              value={itemName} 
              onChange={(e)=>{
                setItemName(e.target.value)
              }}/>
              <Button variant="outlined" onClick={() => {
                addItems(itemName) //Calls helper function
                setItemName('') //Refresh state variable
                handleClose() //Close model
              }}>Add</Button>
            </Stack>
          </Box>
      </Modal>

      <Button variant='contained' onClick={handleOpen}>
        Add New Item
      </Button>

      <Box border='1px solid #333'>
        <Box
        width='800px'
        height='100px'
        bgcolor='#ADD8E6'
        display = 'flex'
        alignItems='center'
        justifyContent='center'
        >
          <Typography variant='h2' color='#333' textAlign="center">
            Inventory Items
          </Typography>
        </Box>
      </Box>
      <Stack width='800px' height='300px' spacing={2} overflow='auto'>
       {
          
          items.map(({name, count}) => (
          <Box
          key={name}
          width='100%'
          minHeight='150px'
          display='flex'
          justifyContent='space-between'
          alignitems='center'
          bgcolor='#f0f0f0'
          paddingX={5}
          >
            <Typography variant='h3' color='#333' >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant='h3' color='#333' alignItems={'center'}>
              {count}
            </Typography>
            <Stack direction='row' spacing={2}>
              <Button variant='contained' onClick={() => addItems(name)}>Add</Button>
              <Button variant='contained' onClick={() => removeItems(name)}>Remove</Button>
            </Stack>
          </Box>))

          
          
        }

      </Stack>
    </Box>
  )
}