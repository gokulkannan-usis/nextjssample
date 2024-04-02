"use client"
import {db} from './firbaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import React,{useState} from 'react';

async function AddDatatoFirebase(name: any,email: any,password:any,message: any){
  try{
    const docRef = await addDoc(collection(db, "Message"),{
      name : name,
      password:password,
      email: email,
      message:message
    });
    return true;
  }catch(error){
    console.error("error",error)
    return false;
  }

}

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e:any) =>{
    e.preventDefault();
    const added = await AddDatatoFirebase(name, email,password, message);
    if(added){
      setName("");
      setEmail("");
      setpassword("")
      setMessage("");
      alert("firbase upload successfully")
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <form onSubmit={submit} className='max-w-md mx-auto p-4 bg-white shadow-md rounded-lg '>
      <div className='mb-4'>
        <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>Name</label>
        <input type="text" id="name" value={name} 
        onChange={(e)=> setName(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
        />
      </div>
      <div className='mb-4'>
        <label htmlFor="email"  className='block text-gray-700 font-bold mb-2'>Email</label>
        <input type="text" id="email" value={email} 
        onChange={(e)=> setEmail(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor="password"  className='block text-gray-700 font-bold mb-2'>password</label>
        <input type="password" id="password" value={password} 
        onChange={(e)=> setpassword(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
        />
      </div>
      <div className='mb-4'>
        <label htmlFor="message"  className='block text-gray-700 font-bold mb-2'>Message</label>
        <textarea 
        rows={5}
        id="message" value={message} 
        onChange={(e)=> setMessage(e.target.value)}
        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
        >
          </textarea>
      </div>
      <div className='text-center'>
        <button type='submit'
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded-lg'>
          Submit
        </button>
      </div>
      </form>
    </main>
  );
}
