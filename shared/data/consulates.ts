/**
 * Consulate Contact Information by Country
 * For use in emergency contact cards and family preparedness planning
 */

export interface ConsulateInfo {
  country: string;
  countryEs: string;
  mainPhone: string;
  emergencyPhone?: string;
  website: string;
  email?: string;
  mainConsulate: {
    city: string;
    address: string;
    phone: string;
  };
}

export const consulates: ConsulateInfo[] = [
  {
    country: "Mexico",
    countryEs: "México",
    mainPhone: "1-877-639-4835",
    emergencyPhone: "1-520-623-7874",
    website: "https://consulmex.sre.gob.mx/",
    mainConsulate: {
      city: "Los Angeles, CA",
      address: "2401 W 6th St, Los Angeles, CA 90057",
      phone: "(213) 351-6800"
    }
  },
  {
    country: "Guatemala",
    countryEs: "Guatemala",
    mainPhone: "1-202-745-4952",
    emergencyPhone: "1-202-629-9747",
    website: "https://www.minex.gob.gt/",
    mainConsulate: {
      city: "Los Angeles, CA",
      address: "1975 N Vermont Ave #900, Los Angeles, CA 90027",
      phone: "(213) 365-9251"
    }
  },
  {
    country: "El Salvador",
    countryEs: "El Salvador",
    mainPhone: "1-202-595-7500",
    emergencyPhone: "1-202-595-7517",
    website: "https://rree.gob.sv/",
    mainConsulate: {
      city: "Los Angeles, CA",
      address: "3250 Wilshire Blvd #920, Los Angeles, CA 90010",
      phone: "(213) 234-9200"
    }
  },
  {
    country: "Honduras",
    countryEs: "Honduras",
    mainPhone: "1-202-966-7702",
    website: "https://www.sre.gob.hn/",
    mainConsulate: {
      city: "Houston, TX",
      address: "4151 Southwest Fwy #140, Houston, TX 77027",
      phone: "(713) 785-5944"
    }
  },
  {
    country: "Nicaragua",
    countryEs: "Nicaragua",
    mainPhone: "1-202-939-6570",
    website: "https://consuladodenicaragua.com/",
    mainConsulate: {
      city: "Los Angeles, CA",
      address: "3550 Wilshire Blvd #200, Los Angeles, CA 90010",
      phone: "(213) 252-1170"
    }
  },
  {
    country: "Colombia",
    countryEs: "Colombia",
    mainPhone: "1-202-387-8338",
    website: "https://www.cancilleria.gov.co/",
    mainConsulate: {
      city: "Miami, FL",
      address: "280 Aragon Ave, Coral Gables, FL 33134",
      phone: "(305) 441-1235"
    }
  },
  {
    country: "Ecuador",
    countryEs: "Ecuador",
    mainPhone: "1-202-234-7200",
    website: "https://www.cancilleria.gob.ec/",
    mainConsulate: {
      city: "New York, NY",
      address: "800 Second Ave #600, New York, NY 10017",
      phone: "(212) 808-0170"
    }
  },
  {
    country: "Peru",
    countryEs: "Perú",
    mainPhone: "1-202-833-9860",
    website: "https://www.gob.pe/rree",
    mainConsulate: {
      city: "Los Angeles, CA",
      address: "3450 Wilshire Blvd #410, Los Angeles, CA 90010",
      phone: "(213) 252-5910"
    }
  },
  {
    country: "Brazil",
    countryEs: "Brasil",
    mainPhone: "1-202-238-2700",
    website: "https://www.gov.br/mre/",
    mainConsulate: {
      city: "Miami, FL",
      address: "80 SW 8th St #2600, Miami, FL 33130",
      phone: "(305) 285-6200"
    }
  },
  {
    country: "Dominican Republic",
    countryEs: "República Dominicana",
    mainPhone: "1-202-332-6280",
    website: "https://mirex.gob.do/",
    mainConsulate: {
      city: "New York, NY",
      address: "1501 Broadway #410, New York, NY 10036",
      phone: "(212) 768-2480"
    }
  },
  {
    country: "Cuba",
    countryEs: "Cuba",
    mainPhone: "1-202-797-8518",
    website: "http://misiones.minrex.gob.cu/",
    mainConsulate: {
      city: "Washington, DC",
      address: "2630 16th St NW, Washington, DC 20009",
      phone: "(202) 797-8518"
    }
  },
  {
    country: "Haiti",
    countryEs: "Haití",
    mainPhone: "1-202-332-4090",
    website: "http://www.haiti.org/",
    mainConsulate: {
      city: "Miami, FL",
      address: "259 SW 13th St, Miami, FL 33130",
      phone: "(305) 859-2003"
    }
  },
  {
    country: "Jamaica",
    countryEs: "Jamaica",
    mainPhone: "1-202-452-0660",
    website: "https://www.mfaft.gov.jm/",
    mainConsulate: {
      city: "New York, NY",
      address: "767 Third Ave, New York, NY 10017",
      phone: "(212) 935-9000"
    }
  },
  {
    country: "Venezuela",
    countryEs: "Venezuela",
    mainPhone: "1-202-342-2214",
    website: "http://eeuu.embajada.gob.ve/",
    mainConsulate: {
      city: "Houston, TX",
      address: "2925 Briarpark Dr #900, Houston, TX 77042",
      phone: "(713) 974-0028"
    }
  },
  {
    country: "China",
    countryEs: "China",
    mainPhone: "1-202-495-2266",
    website: "http://www.china-embassy.org/",
    mainConsulate: {
      city: "New York, NY",
      address: "520 12th Ave, New York, NY 10036",
      phone: "(212) 244-9392"
    }
  },
  {
    country: "India",
    countryEs: "India",
    mainPhone: "1-202-939-7000",
    website: "https://www.indianembassyusa.gov.in/",
    mainConsulate: {
      city: "New York, NY",
      address: "3 E 64th St, New York, NY 10065",
      phone: "(212) 774-0600"
    }
  },
  {
    country: "Philippines",
    countryEs: "Filipinas",
    mainPhone: "1-202-467-9300",
    website: "https://www.philippineembassy-usa.org/",
    mainConsulate: {
      city: "Los Angeles, CA",
      address: "3600 Wilshire Blvd #500, Los Angeles, CA 90010",
      phone: "(213) 639-0980"
    }
  },
  {
    country: "Vietnam",
    countryEs: "Vietnam",
    mainPhone: "1-202-861-0737",
    website: "https://vietnamembassy-usa.org/",
    mainConsulate: {
      city: "San Francisco, CA",
      address: "1700 California St #580, San Francisco, CA 94109",
      phone: "(415) 922-1707"
    }
  },
  {
    country: "Korea (South)",
    countryEs: "Corea del Sur",
    mainPhone: "1-202-939-5600",
    website: "https://overseas.mofa.go.kr/us-en/",
    mainConsulate: {
      city: "Los Angeles, CA",
      address: "3243 Wilshire Blvd, Los Angeles, CA 90010",
      phone: "(213) 385-9300"
    }
  },
  {
    country: "Poland",
    countryEs: "Polonia",
    mainPhone: "1-202-499-1700",
    website: "https://www.gov.pl/web/usa",
    mainConsulate: {
      city: "Chicago, IL",
      address: "1530 N Lake Shore Dr, Chicago, IL 60610",
      phone: "(312) 337-8166"
    }
  }
];

// Helper function to search consulates
export function searchConsulates(query: string): ConsulateInfo[] {
  const normalizedQuery = query.toLowerCase().trim();
  return consulates.filter(
    c => c.country.toLowerCase().includes(normalizedQuery) ||
         c.countryEs.toLowerCase().includes(normalizedQuery)
  );
}
