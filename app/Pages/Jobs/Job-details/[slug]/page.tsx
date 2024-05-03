
"use client"
import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../../../firbaseconfig';
import '../../../../globals.css';
import Image from 'next/image';
import Head from 'next/head';

export default function DetailsPage({ params }: any) {
  console.log("details", params)
  const router: any = useRouter();
  //   const {id} = router.query;
  const [details, setDetails] = useState<any>(null);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    async function fetchDetails() {
      if (!params.slug) return;
      const docRef = doc(db, 'jobs', params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const jobData = docSnap.data();
        console.log("jobdara", jobData)
        setDetails(jobData);

        // Company details start
        const companyId = jobData.company.id;
        const companyDocRef = doc(db, 'company', companyId);
        const companyDocSnap = await getDoc(companyDocRef);
        if (companyDocSnap.exists()) {
          setCompanyDetails(companyDocSnap.data());
        } else {
          console.log('Company details not found!');
        }
        // Company details End

        // categoryDetails details start
        const categoryIds = jobData.category.map((categoryRef: any) => categoryRef.id);
        const categoryDetailsPromises = categoryIds.map(async (categoryId: string) => {
          const categoryDocRef = doc(db, 'category', categoryId);
          const categoryDocSnap = await getDoc(categoryDocRef);
          if (categoryDocSnap.exists()) {
            return categoryDocSnap.data();
          } else {
            console.log(`Category details not found for ID: ${categoryId}`);
            return null;
          }
        });
        const categoryDetails = await Promise.all(categoryDetailsPromises);
        setCategories(categoryDetails.filter(Boolean));

        // categoryDetails details end

      } else {
        console.log('No such document!');
      }
    }
    fetchDetails();
  }, [params.slug]);

  if (!details || !companyDetails) {
    return <div>Loading...</div>;
  }

  const seoScript = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": "Software Engineer",
    "description": "<p>Google aspires to be an organization that reflects the globally diverse audience that our products and technology serve. We believe that in addition to hiring the best talent, a diversity of perspectives, ideas and cultures leads to the creation of better products and services.</p>",
    "identifier": {
      "@type": "PropertyValue",
      "name": "Google",
      "value": "1234567"
    },
    "datePosted": "2017-01-18",
    "validThrough": "2017-03-18T00:00",
    "employmentType": "CONTRACTOR",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Google",
      "sameAs": "https://www.google.com",
      "logo": "https://www.example.com/images/logo.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1600 Amphitheatre Pkwy",
        "addressLocality": "Mountain View",
        "addressRegion": "CA",
        "postalCode": "94043",
        "addressCountry": "US"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": 40.00,
        "unitText": "HOUR"
      }
    }
  }
    ;

  return (

    <div>
      <Head>

        <script type="application/ld+json">{JSON.stringify(seoScript)}</script>
      </Head>


      <div className="flex min-h-screen flex-col items-center justify-between">
        <div className="wrapper">

          <div className="body">
            <div className="job-wrpper details" >
              <div className="job-header">
                {/* <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/> */}
                {/* <Image src={details.image} width={32} height={32} alt='Company' /> */}
                {details.image ? (
                  <Image src={details.image} width={32} height={32} alt="Company" />
                ) : (
                  <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                )}
                <div>
                  <p>{details.title}</p>
                  <span>{companyDetails.name}</span>
                </div>
              </div>

              <div className="singleline">
                <div className="job-body">
                  <Image src="/icon/building-2.svg" width={16} height={16} alt="map" />
                  <span> {companyDetails.name}</span>
                </div>
                <div className="job-body">
                  <Image src="/icon/map-pin.svg" width={16} height={16} alt="map" />
                  <span> {companyDetails.location}</span>
                </div>
              </div>

            </div>
            <div className="job-card">
              <div className="job-wrppernew" >
                <div className="job-header">
                  <Image src="/icon/briefcase-business-gray.svg" width={16} height={16} alt="Logo" />
                  <div>
                    <span>Job type</span>
                    <p>Parttime</p>
                  </div>
                </div>
              </div>

              <div className="job-wrppernew" >
                <div className="job-header">
                  <Image src="/icon/wallet-gray.svg" width={16} height={16} alt="Logo" />
                  <div>
                    <span>Salary (monthly)</span>
                    <p>₹ {details.start_salary} - {details.end_salary}</p>
                  </div>
                </div>
              </div>

              <div className="job-wrppernew" >
                <div className="job-header">
                  <Image src="/icon/arrows-up-from-line-gray.svg" width={16} height={16} alt="Logo" />
                  <div>
                    <span>Age Limit</span>
                    <p>{details.start_age} to {details.end_age}</p>
                  </div>
                </div>
              </div>

              <div className="job-wrppernew" >
                <div className="job-header">
                  <Image src="/icon/clock-5-gray.svg" width={16} height={16} alt="Logo" />
                  <div>
                    <span>Timing</span>
                    <p>{details.working_days}</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="job-wrpper Requirementscard" >

              <div className="job-body-des">
                <span> Requirements</span>
              </div>
              {/* <h2>Categories:</h2>
              <ul>
                {categories.map((category: any) => (
                  <li key={category.id}>
                    <p>{category.name}</p>
                  </li>
                ))}
              </ul> */}

              <div className="job-body tag pb-4">
                {categories.map((category: any) => (
                  <div key={category.id}>
                    <span>{category.name}</span>
                  </div>

                ))}
              </div>


              <div className="job-body-des">
                <span> Job Description</span>
                <div className="job-body">
                  <span>{details.description}</span>
                </div>
              </div>
            </div>




            <div className="job-wrpper Requirementscard" >

              <div className="job-body-des pb-4">
                <span> About Company</span>
                <div className="job-body">
                  <span>{companyDetails.description}</span>
                </div>
              </div>

              <div className="job-body-des">
                <span> About Company</span>
                <div className="job-body">
                  <span>Lorem ipsum dolor sit amet consectetur. Ante risus dignissim sed id lectus pulvinar tortor. Ultrices ultrices phasellus luctus ut pretium urna ultrices. Metus quam amet suspendisse lobortis odio. Faucibus Read more...</span>
                </div>
              </div>
            </div>


            <div className="btn">
              <button>Apply Now</button>
            </div>



          </div>
        </div>



      </div>
    </div>
  );
}
