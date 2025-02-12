import { useState } from 'react';
import "../styles/signUp.css"
import { toast } from 'react-toastify';
import API_URL from "../config"
const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerButtonDisable, setRegisterButtonDisable] = useState(false);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (!email || !password || !userName) {
      toast.warn("Fill all fields");
      return;
    }
    const data={
      email:email,
      username:userName,
      password:password,
    }
    try{
      const response = await fetch(`${API_URL}/api/signup`,{
        method:"POST",
        headers:{
          'content-Type':'application/json'
        },
        body:JSON.stringify(data)
      })
      const responseData= await response.json()
      if(!response.ok){
        toast.error(responseData);
        return;
      }

    }catch(e){
      console.log("error is ->",e)
    }
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      
        <input 
          type="text" 
          placeholder="Name" 
          value={userName}
          onChange={(e) => setUserName(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleSubmit}>Sign Up</button>
      
    </div>
  )
}

export default SignUp