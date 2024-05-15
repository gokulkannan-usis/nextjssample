import { db } from './../firbaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react'

const getData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const data: any = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error: any) {
        throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
}


function formatTimeRange(start_time: any, end_time: any) {
    if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
        return "Time not mentioned";
    }
    const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
    const startDate = new Date(start_time.seconds * 1000);
    const endDate = new Date(end_time.seconds * 1000);

    const formattedStartTime = startDate.toLocaleTimeString('en-US', options);
    const formattedEndTime = endDate.toLocaleTimeString('en-US', options);

    return `${formattedStartTime} - ${formattedEndTime}`;
}

function formatPostedTime(publish_time: any) {
    const timestamp = publish_time;
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const postDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    if (daysDifference === 0) {
        return "Posted today";
    } else if (daysDifference === 1) {
        return "Posted 1 day ago";
    } else {
        return `Posted ${daysDifference} days ago`;
    }
}
const dashboard: any = async (params: any) => {
    try {
        console.log("params", params.searchParams);
        let apiData = await getData();
        if (params.searchParams.search) {
            apiData = apiData.filter((data: any) => {
                return data.title.toLowerCase().includes(params.searchParams.search.toLowerCase())
            })
        }
        return (
            <>


                <div className='h-full'>
                    <div className="Fillter">
                        <div className="header wrapper">
                            {/* <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search"
                            />
                            <button onClick={handleSearch}>Search</button> */}
                        </div>
                        <div className="Fillter-wrapper">

                            <div className="Fillter-right">
                                <div className="body">

                                    {apiData.map((message: any, index: any) => (
                                        // {userDataFilter.map((message: any) => (
                                        <div className="job-wrpper" key={index.id}>
                                            <Link href={`/Pages/Jobs/Job-details/${message.id}`}>
                                                <div className="job-header">
                                                    {message.image ? (
                                                        <Image src={message.image} width={32} height={32} alt="Company" />
                                                    ) : (
                                                        <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                                                    )}
                                                    <div>
                                                        <p>{message.title}</p>
                                                        <span>{message.title}</span>
                                                    </div>
                                                </div>
                                                <div className="job-body">
                                                    <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                                                    <span> {message.location}</span>
                                                </div>
                                                <div className="job-body">
                                                    <Image src="/icon/clock.svg" width={16} height={16} alt="Logo" />
                                                    <span>{formatTimeRange(message.start_time, message.end_time)}  {message.working_days}</span>
                                                </div>
                                                <div className="job-body">
                                                    <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
                                                    <span>₹ {message.start_salary} - {message.end_salary} per month</span>
                                                </div>
                                                <div className="postby">
                                                    <span>{formatPostedTime(message.publish_time)}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}

                                    {/* <div className='pagination'>

                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(index + 1)}
                                                disabled={currentPage === index + 1}
                                                className={currentPage === index + 1 ? 'selected' : 'unselected'}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                                    </div> */}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    } catch (error: any) {
        console.error(error);
        return (
            <>
                <h2>Profile</h2>
                <div>Error fetching data: {error.message}</div>
            </>
        );
    }
}

export default dashboard;


// // Server side api fetching end 

