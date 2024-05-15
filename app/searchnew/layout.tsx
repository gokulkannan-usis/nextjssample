"use client"
import { db } from './../firbaseconfig';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

export default function DashboardLayout({ children, parames }: { children: any; parames: any }) { 
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
      if (parames?.searchParams?.search) {
          setSearchQuery(parames.searchParams.search);
      }
      if (parames?.searchParams?.location) {
          setSelectedLocation(parames.searchParams.location);
      }
      if (parames?.searchParams?.job_type) {
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
      router.push(`/searchnew?${queryString}`);

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
      router.push(`/searchnew?${queryString}`);
  };
  
  return (
    <section>     
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
                                  
                                {children}   

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

          
    </section>
  );
}