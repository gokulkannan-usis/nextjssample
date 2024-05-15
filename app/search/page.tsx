"use client"
import { db } from './../firbaseconfig';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// export async function test() {
//     const joblist = await fetchDataFromFirestorefilter();
//     return {
//         props: { joblist },
//     };
// }

export const joblistdata= async() =>{
    const response = await fetch ('https://dummyjson.com/quotes',{
    cache:"force-cache",
    });
    
    const data = await response.json();
    return data.quotes;
}

async function fetchDataFromFirestorefilter() {
    const postsRef = query(collection(db, "jobs",))

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
export default function Details(parames:any) {
    // console.log(parames.searchParams.search);
    // console.log(parames);
    const [joblsitq, setJobListQ] = useState([]);
//    const joblsitq:any =  joblistdata();
   console.log("hari",joblsitq)


   useEffect(() => {
    const fetchData = async () => {
        try {
            const joblsitq: any = await joblistdata();
            console.log("hari", joblsitq);
            setJobListQ(joblsitq);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);
// const [data, setData] = useState([]);

// useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const result = await joblistdata();
//             console.log("Fetched data:", result); 
//             setData(result);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     fetchData();
// }, []);

// useEffect(() => {
//     console.log("hari", data); // Log the state data after it's updated
// }, [data]);

   const [joblsit, setJobList] = useState([]); 
   console.log(joblsit)
    const router: any = useRouter();
    const [userData, setUserData] = useState([]);
    const [userDatafilter, setuserDatafilter] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [Selectedjob, setSelectedjob] = useState<string>('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [userDataFilter, setUserDataFilter] = useState<any[]>([]);
    const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(2);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchTotalPages = () => {
        const totalPages = 5; 
        setTotalPages(totalPages);
    };

    useEffect(() => {
        // Fetch total pages when the component mounts or currentPage changes
        fetchTotalPages();
    }, [currentPage]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
            const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const data = await fetchDataFromFirestore(start, end);
            // const data = await fetchDataFromFirestore();
            const datafilter = await fetchDataFromFirestorefilter();
            setUserData(data);
            setuserDatafilter(datafilter);
            console.log("time", data)
        }
        fetchData();
    }, [currentPage, itemsPerPage]);

    async function fetchDataFromFirestore(start: number, end: number) {
        const queryConstraints = [];
        if (searchQuery) {
            queryConstraints.push(where('search', '==', searchQuery));
        }
        if (selectedLocation) {
            queryConstraints.push(where('location', '==', selectedLocation));
        }
        const postsRef = query(collection(db, "jobs"), ...queryConstraints);
        const querySnapshot = await getDocs(postsRef);
        const data: any = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data.slice(start, end);
    }

 

    const filteredData = userData.filter((job: any) => {
        const companyMatches = job.title.toLowerCase().includes(searchQuery.toLowerCase());
        const locationMatches = !selectedLocation || job.location === selectedLocation;
        const salaryMatches = !selectedSalaryRange ||
            (
                !isNaN(job.start_salary) && !isNaN(job.end_salary) &&
                job.start_salary >= parseInt(selectedSalaryRange.split('-')[0]) &&
                job.end_salary <= parseInt(selectedSalaryRange.split('-')[1])
            );
        return locationMatches && salaryMatches && companyMatches;
    });

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



    const handleLocationChange = (location: string) => {
        setSelectedLocation(selectedLocation === location ? '' : location);
        redirect(location, Selectedjob);
    };
    const handlejobtypeChange = (jobtype: string) => {
        setSelectedjob(Selectedjob === jobtype ? '' : jobtype);
        redirect(selectedLocation, jobtype);
    };
    const redirect = (location: string, job_type: string) => {
        let queryString = "".toString();
        queryString = queryString + "location=" + location;
        queryString = queryString + "&job_type=" + job_type;
        router.push(`/search?${queryString}`);

    };
    const handleSearch = async () => {
        const filteredResult = userData.filter((job: any) => {
            const companyMatches = job.title.toLowerCase().includes(searchQuery.toLowerCase());
            const locationMatches = !selectedLocation || job.location === selectedLocation;
            const salaryMatches = !selectedSalaryRange ||
                (
                    !isNaN(job.start_salary) && !isNaN(job.end_salary) &&
                    job.start_salary >= parseInt(selectedSalaryRange.split('-')[0]) &&
                    job.end_salary <= parseInt(selectedSalaryRange.split('-')[1])
                );
            return companyMatches && locationMatches && salaryMatches;
        });

        setUserDataFilter(filteredResult);
        const queryParams = new URLSearchParams();
        if (searchQuery) {
            queryParams.set('search', searchQuery);
        }
        if (selectedLocation) {
            queryParams.set('location', selectedLocation);
        }
        const queryString = queryParams.toString();
        router.push(`/search?${queryString}`);
    };





    return (
        <div className='h-full'>
            <div className="Fillter">
                <div className="header wrapper">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                    />
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
                        {/* {joblsit.map((message: any) => (
                            <div className="job-wrpper" key={message.id}>
                                
                                <div className="job-body">
                                            <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                                            <span> {message.quote}</span>
                                        </div>
                                        <div className="job-body">
                                            <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                                            <span> {message.author}</span>
                                        </div>
                                
                                </div>
                        ))} */}



{Array.isArray(joblsit) && joblsit.map((message: any) => (
                // Your rendering logic here
                <div key={message.id}>
                    <div className="job-body">
                        <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                        <span> {message.quote}</span>
                    </div>
                    <div className="job-body">
                        <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                        <span> {message.author}</span>
                    </div>
                </div>
            ))}

                            {filteredData.map((message: any) => (
                                // {userDataFilter.map((message: any) => (
                                <div className="job-wrpper" key={message.id}>
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

<div className='pagination'>
                {/* <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={nextPage}>Next</button> */}

                <button  onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
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
            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>


    );
}



// import { db } from './../firbaseconfig';
// import { collection, getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { FormEvent } from 'react'
// const getData = async () => {
//     try {
//         const querySnapshot = await getDocs(collection(db, "jobs"));
//         const data: any = [];
//         querySnapshot.forEach((doc) => {
//             data.push({ id: doc.id, ...doc.data() });
//         });
//         return data;
//     } catch (error: any) {
//         throw new Error("Failed to fetch data from Firestore: " + error.message);
//     }
// }
// function formatTimeRange(start_time: any, end_time: any) {
//     if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
//         return "Time not mentioned";
//     }
//     const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
//     const startDate = new Date(start_time.seconds * 1000);
//     const endDate = new Date(end_time.seconds * 1000);

//     const formattedStartTime = startDate.toLocaleTimeString('en-US', options);
//     const formattedEndTime = endDate.toLocaleTimeString('en-US', options);

//     return `${formattedStartTime} - ${formattedEndTime}`;
// }

// function formatPostedTime(publish_time: any) {
//     const timestamp = publish_time;
//     const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
//     const date = new Date(milliseconds);
//     const postDate = new Date(date);
//     const currentDate = new Date();
//     const timeDifference = currentDate.getTime() - postDate.getTime();
//     const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
//     if (daysDifference === 0) {
//         return "Posted today";
//     } else if (daysDifference === 1) {
//         return "Posted 1 day ago";
//     } else {
//         return `Posted ${daysDifference} days ago`;
//     }
// }
// const dashboard: any = async () => {
//     try {
//         const apiData = await getData();
//         return (
//             <>
//                 {/* <div className='centerpage'>
//         <h1 className="text-center ">Firebase Data</h1>
//         <h1 className="text-center p-10"> <Link href="/Pages/Profile">Profile</Link></h1>
//         <div className="text-center ">
//           <form action="/search/">
//             <input
//               type="text"
//               name='search'
//               placeholder="Search"
//             />
//             <button type='submit'>Search</button>

//           </form>

//           {apiData.map((item: any, index: any) => (
//             <div key={index}>
//               <div className="job-wrpper" key={item.id}>
//                 <div className="job-wrpper" key={item.id}>
//                   <Link href={`Pages/Jobs/Job-details/${item.id}`}>
//                     <div className="job-header">
//                       {item.image ? (
//                         <Image src={item.image} width={32} height={32} alt="Company" />
//                       ) : (
//                         <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
//                       )}
//                       <div>
//                         <p>{item.title}</p>
//                         <span>{item.title}</span>
//                       </div>
//                     </div>
//                     <div className="job-body">
//                       <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
//                       <span> {item.location}</span>
//                     </div>
//                     <div className="job-body">
//                       <Image src="/icon/clock.svg" width={16} height={16} alt="Logo" />
//                       <span>{formatTimeRange(item.start_time, item.end_time)}  {item.working_days}</span>
//                     </div>
//                     <div className="job-body">
//                       <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
//                       <span>₹ {item.start_salary} - {item.end_salary} per month</span>
//                     </div>
//                     <div className="postby">
//                       <span>{formatPostedTime(item.publish_time)}</span>
//                     </div>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         </div> */}

//                 <div className='h-full'>
//                     <div className="Fillter">
//                         <div className="header wrapper">
//                             {/* <input
//                                 type="text"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 placeholder="Search"
//                             />
//                             <button onClick={handleSearch}>Search</button> */}
//                         </div>
//                         <div className="Fillter-wrapper">
//                             <div className="Fillter-left">
//                                 <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                     <h3 className="font-semibold text-gray-900 dark:text-white">Job</h3>
//                                     <ul>
//                                         {/* <li className="w-full ">
//                                             <div className="flex items-center ps-3">
//                                                 <input id="type" name='job_type[]' checked={Selectedjob === 'parttime'} onChange={() => handlejobtypeChange('parttime')} type="checkbox" value="parttime" className="w-4 h-4 " />
//                                                 <label htmlFor="Part-Time" className="w-full py-3 ms-2">Part Time</label>
//                                             </div>
//                                         </li>
//                                         <li className="w-full">
//                                             <div className="flex items-center ps-3">
//                                                 <input id="type1" name='job_type[]' checked={Selectedjob === 'fulltime'} onChange={() => handlejobtypeChange('fulltime')} type="checkbox" value="fulltime" className="w-4 h-4 " />
//                                                 <label htmlFor="Full-Time" className="w-full py-3 ms-2 ">Full Time</label>
//                                             </div>
//                                         </li> */}
//                                     </ul>
//                                 </div>

//                                 <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                     <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
//                                     <ul>
//                                         <li key="all" className="w-full">
//                                             <div className="flex items-center ps-3">
//                                                 {/* <input
//                                                     id="all-locations"
//                                                     type="checkbox"
//                                                     value=""
//                                                     checked={selectedLocation === ''}
//                                                     onChange={() => handleLocationChange('')}
//                                                     className="w-4 h-4"
//                                                 /> */}
//                                                 <label htmlFor="all-locations" className="w-full py-3 ms-2">All Locations</label>
//                                             </div>
//                                         </li>
//                                         {/* {Array.from(new Set(userDatafilter.map((job: any) => job.location))).map(location => (
//                                             <li key={location} className="w-full">
//                                                 <div className="flex items-center ps-3">
//                                                     <input

//                                                         id={location}
//                                                         type="checkbox"
//                                                         value={location}
//                                                         checked={selectedLocation === location}
//                                                         onChange={(e) => handleLocationChange(e.target.value)}
//                                                         className="w-4 h-4"
//                                                     />
//                                                     <label htmlFor={location} className="w-full py-3 ms-2">{location}</label>
//                                                 </div>
//                                             </li>
//                                         ))} */}
//                                     </ul>
//                                 </div>

//                                 <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
//                                     <h3 className="font-semibold text-gray-900 dark:text-white">Salary Range</h3>
//                                     <ul>
//                                         {/* {renderSalaryRangeCheckboxes()} */}

//                                     </ul>
//                                 </div>


//                             </div>
//                             <div className="Fillter-right">
//                                 <div className="body">
                                  
//                                              {apiData.map((message: any, index: any) => (
//                                         // {userDataFilter.map((message: any) => (
//                                         <div className="job-wrpper" key={index.id}>
//                                             <Link href={`/Pages/Jobs/Job-details/${message.id}`}>
//                                                 <div className="job-header">
//                                                     {message.image ? (
//                                                         <Image src={message.image} width={32} height={32} alt="Company" />
//                                                     ) : (
//                                                         <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
//                                                     )}
//                                                     <div>
//                                                         <p>{message.title}</p>
//                                                         <span>{message.title}</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="job-body">
//                                                     <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
//                                                     <span> {message.location}</span>
//                                                 </div>
//                                                 <div className="job-body">
//                                                     <Image src="/icon/clock.svg" width={16} height={16} alt="Logo" />
//                                                     <span>{formatTimeRange(message.start_time, message.end_time)}  {message.working_days}</span>
//                                                 </div>
//                                                 <div className="job-body">
//                                                     <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
//                                                     <span>₹ {message.start_salary} - {message.end_salary} per month</span>
//                                                 </div>
//                                                 <div className="postby">
//                                                     <span>{formatPostedTime(message.publish_time)}</span>
//                                                 </div>
//                                             </Link>
//                                         </div>
//                                     ))}

//                                     {/* <div className='pagination'>

//                                         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
//                                         {Array.from({ length: totalPages }, (_, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => handlePageChange(index + 1)}
//                                                 disabled={currentPage === index + 1}
//                                                 className={currentPage === index + 1 ? 'selected' : 'unselected'}
//                                             >
//                                                 {index + 1}
//                                             </button>
//                                         ))}
//                                         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
//                                     </div> */}

//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </>
//         );
//     } catch (error: any) {
//         console.error(error);
//         return (
//             <>
//                 <h2>Profile</h2>
//                 <div>Error fetching data: {error.message}</div>
//             </>
//         );
//     }
// }

// export default dashboard;


// // Server side api fetching end 

