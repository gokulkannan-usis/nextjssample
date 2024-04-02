"use client"
import { db } from './firbaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

async function AddDatatoFirebase(name:any, email:any, password:any, message:any) {
  try {
    const docRef = await addDoc(collection(db, "Message"), {
      name: name,
      password: password,
      email: email,
      message: message
    });
    return true;
  } catch (error) {
    console.error("error", error)
    return false;
  }
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = name !== '' && email !== '' && password !== '' && message !== '';

  const submit = async (e:any) => {
   
    e.preventDefault();
    if (!isFormValid) {
      return;
    }
    const added = await AddDatatoFirebase(name, email, password, message);
    if (added) {
      setName("");
      setEmail("");
      setPassword("");
      setMessage("");
      alert("Firebase upload successful");
      router.push('/Pages/Dashboard');
    }
  }

  return (
    <main className=" items-center justify-between p-24">
      <form onSubmit={submit} className='max-w-md mx-auto p-4 bg-white shadow-md rounded-lg '>
        <div className='mb-4'>
          <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>Name</label>
          <input type="text" id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>Email</label>
          <input type="text" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>Password</label>
          <input type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="message" className='block text-gray-700 font-bold mb-2'>Message</label>
          <textarea
            rows={5}
            id="message" value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
          ></textarea>
        </div>
        <div className='text-center'>
          <button type='submit'
            disabled={!isFormValid}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded-lg ${isFormValid ? '' : 'cursor-not-allowed opacity-50'}`}>
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
