
"use client"
import { db } from './../../firbaseconfig';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';



async function fetchDataFromFirestorefilter() {
    const postsRef = query(collection(db, "jobs"),)

    const querySnapshot = await getDocs(postsRef)
    // const querySnapshot = await getDocs(collection(db, "jobs"));
    const data: any = [];
    querySnapshot.forEach((doc) => {
        const message: any = { id: doc.id, ...doc.data() };
        data.push({ id: doc.id, ...doc.data() });
    });
    return data;
}



function formatTimeRange(start_time: any, end_time: any) {
    if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
        return " time not mention";
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


export default function Details(parames: any) {
    console.log(parames.searchParams.search);
    const router: any = useRouter();
    const [userData, setUserData] = useState([]);
    const [userDatafilter, setuserDatafilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [Selectedjob, setSelectedjob] = useState<string>('');

    const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>('');



    useEffect(() => {
        if (parames.searchParams.search) {
            setSearchQuery(parames.searchParams.search);
        }
        if (parames.searchParams.location) {
            setSelectedLocation(parames.searchParams.location);
        }
        if (parames.searchParams.job_type) {
            setSelectedjob(parames.searchParams.job_type);
        }
        async function fetchData() {
            const data = await fetchDataFromFirestore();
            const datafilter = await fetchDataFromFirestorefilter();
            setUserData(data);
            setuserDatafilter(datafilter);
            console.log("time", data)
        }
        fetchData();
    }, []);


    useEffect(() => {
        const queryParams: any = {};
        if (searchQuery) queryParams.search = searchQuery;
        if (selectedLocation) queryParams.location = selectedLocation;
        if (selectedSalaryRange) queryParams.salary = selectedSalaryRange;
        if (typeof router.pathname === 'string') {
            router.push({
                pathname: router.pathname,
                query: queryParams,
            });
        }

        console.log("comapny", searchQuery)
        console.log("Location", selectedLocation)
        console.log("Salary", selectedSalaryRange)
    }, [searchQuery, selectedLocation, selectedSalaryRange]);

    useEffect(() => {
        async function fetchData() {
            const data = await fetchDataFromFirestore();
            setUserData(data);
        }
        fetchData();
    }, [router.query]);

    async function fetchDataFromFirestore() {
        console.log("selectedLocation", selectedLocation);
        const queryConstraints = []
        if (parames.searchParams.location) {
            queryConstraints.push(where('location', '==', parames.searchParams.location));
        }
        if (parames.searchParams.search) {
            queryConstraints.push(where('title', '==', parames.searchParams.search));
        }
        if (parames.searchParams.job_type) {
            queryConstraints.push(where('job_type', '==', parames.searchParams.job_type));
        }
        const postsRef = query(collection(db, "jobs"), ...queryConstraints);

        const querySnapshot = await getDocs(postsRef)
        // const querySnapshot = await getDocs(collection(db, "jobs"));
        const data: any = [];
        querySnapshot.forEach((doc) => {
            const message: any = { id: doc.id, ...doc.data() };
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    }


    // Define the array of salary ranges
    const salaryRanges = [
        { label: "All", value: "" },
        { label: "0-10000", value: "0-10000" },
        { label: "10001-20000", value: "10001-20000" },
        { label: "20001-30000", value: "20001-30000" },
        { label: "30001-40000", value: "30001-40000" },
    ];

    // Function to handle salary range change
    const handleSalaryRangeChange = (range: string) => {
        setSelectedSalaryRange(range);
    };

    // Function to render salary range checkboxes
    const renderSalaryRangeCheckboxes = () => {
        return salaryRanges.map((range, index) => (
            <li key={index} className="w-full">
                <div className="flex items-center ps-3">
                    <input
                        id={`salaryRange-${index}`}
                        type="checkbox"
                        value={range.value}
                        checked={selectedSalaryRange === range.value}
                        onChange={() => handleSalaryRangeChange(range.value)}
                        className="w-4 h-4"
                    />
                    <label htmlFor={`salaryRange-${index}`} className="w-full py-3 ms-2">{range.label}</label>
                </div>
            </li>
        ));
    };

    console.log("router.query:", router.query);
    const { search, location } = router.query || {};

    const handleLocationChange = (location: string) => {
        // Toggle the location in selectedLocation state

        setSelectedLocation(selectedLocation === location ? '' : location);
        redirect(location, Selectedjob);
    };
    const handlejobtypeChange = (jobtype: string) => {
        // Toggle the location in selectedLocation state
        setSelectedjob(Selectedjob === jobtype ? '' : jobtype);
        redirect(selectedLocation, jobtype);
    };
    const redirect = (location: string, job_type: string) => {
        let queryString = "".toString();
        // Toggle the location in selectedLocation state
        queryString = queryString + "location=" + location;
        queryString = queryString + "&job_type=" + job_type;
        router.push(`/Pages/Filter?${queryString}`);

    };

    // const filteredData = userData.filter((job: any) => {
    //     const companyMatches = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    //     const locationMatches = !selectedLocation || job.location === selectedLocation;
    //     const salaryMatches = !selectedSalaryRange ||
    //         (
    //             !isNaN(job.start_salary) && !isNaN(job.end_salary) &&
    //             job.start_salary >= parseInt(selectedSalaryRange.split('-')[0]) &&
    //             job.end_salary <= parseInt(selectedSalaryRange.split('-')[1])
    //         );



    //     return companyMatches && locationMatches && salaryMatches;
    // });

    const handleSearch = () => {
        if (!searchQuery) {
            alert('Please enter a search query.');
            return;
        }

        const queryParams = new URLSearchParams();
        queryParams.set('search', searchQuery);
        if (selectedLocation) {
            queryParams.set('location', selectedLocation);
        }

        const queryString = queryParams.toString();

        if (queryString) {
            router.push(`/Pages/Filter?${queryString}`);
        } else {
            router.push('/Pages/Filter');
        }
    };


    return (
        <div>
            <h1>About details: {search}</h1>
            <p>Location: {location}</p>
            <form >
                <div className="Fillter">
                    <div className="header wrapper">

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                        />
                        {/* <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}> */}
                        {/* <option value="">All Locations</option>
                        {Array.from(new Set(userData.map((job: any) => job.location))).map(location => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select> */}
                        <button onClick={handleSearch}>Search</button>

                    </div>
                    <div className="Fillter-wrapper">
                        <div className="Fillter-left">
                            <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Job</h3>
                                <ul>
                                    <li className="w-full ">
                                        <div className="flex items-center ps-3">
                                            <input id="type" name='job_type[]' checked={Selectedjob === 'parttime'} onChange={() => handlejobtypeChange('parttime')} type="checkbox" value="parttime" className="w-4 h-4 " />
                                            <label htmlFor="Part-Time" className="w-full py-3 ms-2">Part Time</label>
                                        </div>
                                    </li>
                                    <li className="w-full">
                                        <div className="flex items-center ps-3">
                                            <input id="type1" name='job_type[]' checked={Selectedjob === 'fulltime'} onChange={() => handlejobtypeChange('fulltime')} type="checkbox" value="fulltime" className="w-4 h-4 " />
                                            <label htmlFor="Full-Time" className="w-full py-3 ms-2 ">Full Time</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                                <ul>
                                    <li key="all" className="w-full">
                                        <div className="flex items-center ps-3">
                                            <input
                                                id="all-locations"
                                                type="checkbox"
                                                value=""
                                                checked={selectedLocation === ''}
                                                onChange={() => handleLocationChange('')}
                                                className="w-4 h-4"
                                            />
                                            <label htmlFor="all-locations" className="w-full py-3 ms-2">All Locations</label>
                                        </div>
                                    </li>
                                    {Array.from(new Set(userDatafilter.map((job: any) => job.location))).map(location => (
                                        <li key={location} className="w-full">
                                            <div className="flex items-center ps-3">
                                                <input

                                                    id={location}
                                                    type="checkbox"
                                                    value={location}
                                                    checked={selectedLocation === location}
                                                    onChange={(e) => handleLocationChange(e.target.value)}
                                                    className="w-4 h-4"
                                                />
                                                <label htmlFor={location} className="w-full py-3 ms-2">{location}</label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Salary Range</h3>
                                <ul>
                                    {renderSalaryRangeCheckboxes()}

                                </ul>
                            </div>


                        </div>
                        <div className="Fillter-right">
                            <div className="body">
                                {userData.map((message: any) => (


                                    <div className="job-wrpper" key={message.id}>
                                        <Link href={`Jobs/Job-details/${message.id}`}>
                                            <div className="job-header">
                                                {/* <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/> */}
                                                {/* <Image src={message.image} width={32} height={32} alt="Logo"/> */}
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
                                                {/* <span>{formatTime(message.start_time)} - 7:00pm Mon - Fri</span> */}

                                                <span>{formatTimeRange(message.start_time, message.end_time)}  {message.working_days}</span>

                                            </div>
                                            <div className="job-body">
                                                <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
                                                <span>₹ {message.start_salary} - {message.end_salary} per month</span>
                                            </div>
                                            <div className="postby">
                                                {/* <span>Posted 2 days ago</span> */}
                                                <span>{formatPostedTime(message.publish_time)}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
        </div>


    );
}

