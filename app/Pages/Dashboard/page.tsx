"use client"
import { db } from './../../firbaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import '../../globals.css';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';

async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "Message"));
  const data:any = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

export default function Dashboard() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setUserData(data);
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Firebase Data</h1>
{/* 
      <Table className="custom-table">
        <TableHeader className="custom-table-header">
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Message</TableColumn>
        </TableHeader>
        <TableBody>
          {userData.map((message:any) => (
            <TableRow key={message.id}>
              <TableCell>{message.name}</TableCell>
              <TableCell>{message.email}</TableCell>
              <TableCell>{message.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}




      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                   Id
                </th>
                <th scope="col" className="px-6 py-3">
                   Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
                </th>
                <th scope="col" className="px-6 py-3">
                    Message
                </th>
               
            </tr>
        </thead>
        <tbody>
        {userData.map((message:any) => (
            <tr key={message.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {message.id}
                </th>
                <td className="px-6 py-4">
                {message.name}
                </td>
                <td className="px-6 py-4">
                {message.email}
                </td>
                <td className="px-6 py-4">
                {message.message}
                </td>
                
            </tr>
             ))}
        </tbody>
    </table>
</div>




   
    </main>
  );
}
