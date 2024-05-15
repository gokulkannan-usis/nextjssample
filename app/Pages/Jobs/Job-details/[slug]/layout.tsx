
export async function generateMetadata({ params, searchParams }: any, parent: any) {

 
    try {  
        return {
            // title: params.slug,
            // description: params.description,
            // openGraph: {
            //     images: [
            //         {
            //             url: "imageUrl",
            //         },
            //     ],
            // },
      //       "@context" : "https://schema.org/",
      // "@type" : "JobPosting",
      // "title" :  params.slug,
      // "description" : params.description,
      // "identifier": {
      //   "@type": "PropertyValue",
      //   "name": "Google",
      //   "value": "1234567"
      // },
      // "datePosted" : "2017-01-18",
      // "validThrough" : "2017-03-18T00:00",
      // "employmentType" : "CONTRACTOR",
      // "hiringOrganization" : {
      //   "@type" : "Organization",
      //   "name" : "Google",
      //   "sameAs" : "https://www.google.com",
      //   "logo" : "https://www.example.com/images/logo.png"
      // },
      // "jobLocation": {
      // "@type": "Place",
      //   "address": {
      //   "@type": "PostalAddress",
      //   "streetAddress": "1600 Amphitheatre Pkwy",
      //   "addressLocality": "Mountain View",
      //   "addressRegion": "CA",
      //   "postalCode": "94043",
      //   "addressCountry": "US"
      //   }
      // },
      // "baseSalary": {
      //   "@type": "MonetaryAmount",
      //   "currency": "USD",
      //   "value": {
      //     "@type": "QuantitativeValue",
      //     "value": 40.00,
      //     "unitText": "HOUR"
      //   }
      // }

        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null or default metadata in case of an error
    }
}

export default function Layout({ children }: any) {
    return <>{children}</>;
}
