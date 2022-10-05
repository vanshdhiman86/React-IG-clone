//import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post.js';
import {auth, db} from './firebase';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpneSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser){
        console.log(authUser);
        setUser(authUser);
      }
      
       else{
        setUser(null);
      }
    })

    return()  => {
      unsubscribe();
    }

  },[user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);


  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
     return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);

  } 

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpneSignIn(false);
  }

  return (
    <div className="App">

    <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style}>
        <form className='app__signup'>
          <center><img 
        className = "app__headerImage"
        src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />
        </center> 
        <Input
        placeholder='username'
        type='username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <Input
        placeholder='email'
        type='text'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <Input
        placeholder='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button onClick={signUp}>Sign Up</Button>
         </form>
          
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpneSignIn(false)}
      >
        <Box sx={style}>
        <form className='app__signup'>
          <center><img 
        className = "app__headerImage"
        src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />
        </center> 
        
        <Input
        placeholder='email'
        type='text'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <Input
        placeholder='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button onClick={signIn}>Sign In</Button>
         </form>
          
        </Box>
      </Modal>
      
      <div className = "app__header">
        <img 
        className = "app__headerImage"
        src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />
        
      {user ? (<Button onClick={() => auth.signOut()}>Logout</Button>)
      : (
      <div className='app__loginContainer'>
        <Button onClick={() => setOpneSignIn(true)}>Sign In</Button>
      <Button onClick={() => setOpen(true)}>Sign up</Button>
      </div>
      )}


      </div>

      <div className='app__posts'>
        <div>
        {
        posts.map(({id, post}) => (
          <Post key = {id} postId = {id} user = {user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
        </div>
      

      </div>

{user?.displayName ? (
        <ImageUpload username = {user.displayName}/>
      ): (
        <h3 className ='logout' > Sorry you need to login to upload</h3>
      )}

      
    </div>
  );
}

export default App;
