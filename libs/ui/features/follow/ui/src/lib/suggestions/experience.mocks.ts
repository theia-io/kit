import { Experience } from '@kitouch/shared/models';

export type ExperienceDates = Pick<
  Experience,
  'title' | 'startDate' | 'endDate'
>;

export const A: ExperienceDates = {
  title: 'A',
  startDate: '2022-03-31T22:00:00.000Z',
  endDate: '2023-06-31T22:00:00.000Z',
};

export const B: ExperienceDates = {
  title: 'B',
  startDate: '2020-03-31T22:00:00.000Z',
  endDate: '2021-06-31T22:00:00.000Z',
};

export const C: ExperienceDates = {
  title: 'C',
  startDate: '2020-03-31T22:00:00.000Z',
  endDate: '2022-11-31T22:00:00.000Z',
};

export const D: ExperienceDates = {
  title: 'D',
  startDate: '2020-03-31T22:00:00.000Z',
  endDate: '2024-03-31T22:00:00.000Z',
};
export const E: ExperienceDates = {
  title: 'E',
  startDate: '2022-04-31T22:00:00.000Z',
  endDate: '2023-02-31T22:00:00.000Z',
};
export const F: ExperienceDates = {
  title: 'F',
  startDate: '2022-05-31T22:00:00.000Z',
  endDate: '2024-02-31T22:00:00.000Z',
};

export const G: ExperienceDates = {
  title: 'G',
  startDate: '2024-01-31T22:00:00.000Z',
  endDate: '2024-05-31T22:00:00.000Z',
};
export const K: ExperienceDates = {
  title: 'K',
  startDate: '2022-03-31T22:00:00.000Z',
  endDate: null,
};
export const L: ExperienceDates = {
  title: 'L',
  startDate: '2024-01-31T22:00:00.000Z',
  endDate: null,
};

export const DB_USERS_20240713 = [{
  "_id": {
    "$oid": "665f035a858ffd83be9e60f1"
  },
  "id": 2,
  "accountId": 2,
  "name": "Jane",
  "surname": "Doe",
  "middleName": "A",
  "gender": "female",
  "languages": [
    {
      "name": "English",
      "code": "en",
      "isPrimary": true
    },
    {
      "name": "Spanish",
      "code": "es"
    }
  ],
  "educations": [
    {
      "name": "University of California, Berkeley",
      "level": "Bachelor's Degree",
      "start": 2010,
      "url": "https://www.berkeley.edu/",
      "end": 2014
    }
  ],
  "certificates": [
    {
      "name": "AWS Certified Solutions Architect - Associate",
      "level": "Associate",
      "start": 2022,
      "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
      "end": 2022
    }
  ],
  "cvs": [
    {
      "id": 2,
      "educations": [
        {
          "name": "University of California, Berkeley",
          "level": "Bachelor's Degree",
          "start": 2010,
          "url": "https://www.berkeley.edu/",
          "end": 2014
        }
      ],
      "skills": [
        {
          "name": "Java",
          "level": "Expert"
        },
        {
          "name": "Python",
          "level": "Intermediate"
        }
      ],
      "projects": [
        {
          "name": "E-commerce platform",
          "description": "Developed a full-stack e-commerce platform using Java and Spring Boot.",
          "image": "https://example.com/ecommerce-platform.png",
          "link": "https://github.com/johndoe/ecommerce-platform"
        }
      ],
      "companies": [
        {
          "accountId": 12346,
          "profileId": 67891,
          "name": "Google",
          "description": "Worked as a software engineer at Google.",
          "businessType": "Outsource",
          "sector": "IT",
          "type": "Employ",
          "registration": "1234567890",
          "logo": "https://example.com/google-logo.png",
          "website": "https://www.google.com/",
          "customerInfo": {
            "contact": {
              "alias": "Jane Doe",
              "isPrimary": true,
              "email": "jane.doe@google.com",
              "phone": "+1 555-123-4567",
              "fax": "+1 555-123-4568",
              "address": "1600 Amphitheatre Parkway, Mountain View, CA 94043",
              "website": "https://www.google.com/"
            },
            "birthday": "1990-01-01",
            "experience": [
              {
                "title": "Software Engineer",
                "description": "Developed and maintained software applications for Google.",
                "image": "https://example.com/google-office.jpg",
                "link": "https://www.google.com/careers/"
              }
            ],
            "location": "Mountain View, CA"
          }
        }
      ]
    }
  ],
  "skills": [
    {
      "name": "Java",
      "level": "Expert"
    },
    {
      "name": "Python",
      "level": "Intermediate"
    }
  ],
  "projects": [
    {
      "name": "E-commerce platform",
      "description": "Developed a full-stack e-commerce platform using Java and Spring Boot.",
      "image": "https://example.com/ecommerce-platform.png",
      "link": "https://github.com/johndoe/ecommerce-platform"
    }
  ],
  "companies": [
    {
      "accountId": 12346,
      "profileId": 67891,
      "name": "Google",
      "description": "Worked as a software engineer at Google.",
      "businessType": "Outsource",
      "sector": "IT",
      "type": "Employ",
      "registration": "1234567890",
      "logo": "https://example.com/google-logo.png",
      "website": "https://www.google.com/",
      "customerInfo": {
        "contact": {
          "alias": "Jane Doe",
          "isPrimary": true,
          "email": "jane.doe@google.com",
          "phone": "+1 555-123-4567",
          "fax": "+1 555-123-4568",
          "address": "1600 Amphitheatre Parkway, Mountain View, CA 94043",
          "website": "https://www.google.com/"
        },
        "birthday": "1990-01-01",
        "experience": [
          {
            "title": "Software Engineer",
            "description": "Developed and maintained software applications for Google.",
            "image": "https://example.com/google-office.jpg",
            "link": "https://www.google.com/careers/"
          }
        ],
        "location": "Mountain View, CA"
      }
    }
  ],
  "roles": [
    "admin",
    "user"
  ],
  "customerInfo": {
    "contact": {
      "alias": "Jane Doe",
      "isPrimary": true,
      "email": "jane.doe@example.com",
      "phone": "+1 555-123-4567",
      "fax": "+1 555-123-4568",
      "address": "123 Main Street, Anytown, CA 12345",
      "website": "https://www.janedoe.com/"
    },
    "birthday": "1990-01-01",
    "experience": [
      {
        "title": "Software Engineer",
        "description": "Developed and maintained software applications for Google.",
        "image": "https://example.com/google-office.jpg",
        "link": "https://www.google.com/careers/"
      }
    ],
    "location": "Anytown, CA"
  },
  "privateFields": [
    "password",
    "services"
  ]
},
{
  "_id": {
    "$oid": "665f035a858ffd83be9e60f0"
  },
  "id": 1,
  "accountId": 1,
  "name": "John",
  "surname": "Doe",
  "middleName": "A",
  "gender": "male",
  "languages": [
    {
      "name": "English",
      "code": "en",
      "isPrimary": true
    },
    {
      "name": "Spanish",
      "code": "es"
    }
  ],
  "educations": [
    {
      "name": "University of California, Berkeley",
      "level": "Bachelor's Degree",
      "start": 2010,
      "url": "https://www.berkeley.edu/",
      "end": 2014
    }
  ],
  "certificates": [
    {
      "name": "AWS Certified Solutions Architect - Associate",
      "level": "Associate",
      "start": 2022,
      "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
      "end": 2022
    }
  ],
  "cvs": [
    {
      "id": 1,
      "educations": [
        {
          "name": "University of California, Berkeley",
          "level": "Bachelor's Degree",
          "start": 2010,
          "url": "https://www.berkeley.edu/",
          "end": 2014
        }
      ],
      "skills": [
        {
          "name": "Java",
          "level": "Expert"
        },
        {
          "name": "Python",
          "level": "Intermediate"
        }
      ],
      "projects": [
        {
          "name": "E-commerce platform",
          "description": "Developed a full-stack e-commerce platform using Java and Spring Boot.",
          "image": "https://example.com/ecommerce-platform.png",
          "link": "https://github.com/johndoe/ecommerce-platform"
        }
      ],
      "companies": [
        {
          "accountId": 12345,
          "profileId": 67890,
          "name": "Google",
          "description": "Worked as a software engineer at Google.",
          "businessType": "Outsource",
          "sector": "IT",
          "type": "Employ",
          "registration": "1234567890",
          "logo": "https://example.com/google-logo.png",
          "website": "https://www.google.com/",
          "customerInfo": {
            "contact": {
              "alias": "John Doe",
              "isPrimary": true,
              "email": "john.doe@google.com",
              "phone": "+1 555-123-4567",
              "fax": "+1 555-123-4568",
              "address": "1600 Amphitheatre Parkway, Mountain View, CA 94043",
              "website": "https://www.google.com/"
            },
            "birthday": "1990-01-01",
            "experience": [
              {
                "title": "Software Engineer",
                "description": "Developed and maintained software applications for Google.",
                "image": "https://example.com/google-office.jpg",
                "link": "https://www.google.com/careers/"
              }
            ],
            "location": "Mountain View, CA"
          }
        }
      ]
    }
  ],
  "skills": [
    {
      "name": "Java",
      "level": "Expert"
    },
    {
      "name": "Python",
      "level": "Intermediate"
    }
  ],
  "projects": [
    {
      "name": "E-commerce platform",
      "description": "Developed a full-stack e-commerce platform using Java and Spring Boot.",
      "image": "https://example.com/ecommerce-platform.png",
      "link": "https://github.com/johndoe/ecommerce-platform"
    }
  ],
  "companies": [
    {
      "accountId": 12345,
      "profileId": 67890,
      "name": "Google",
      "description": "Worked as a software engineer at Google.",
      "businessType": "Outsource",
      "sector": "IT",
      "type": "Employ",
      "registration": "1234567890",
      "logo": "https://example.com/google-logo.png",
      "website": "https://www.google.com/",
      "customerInfo": {
        "contact": {
          "alias": "John Doe",
          "isPrimary": true,
          "email": "john.doe@google.com",
          "phone": "+1 555-123-4567",
          "fax": "+1 555-123-4568",
          "address": "1600 Amphitheatre Parkway, Mountain View, CA 94043",
          "website": "https://www.google.com/"
        },
        "birthday": "1990-01-01",
        "experience": [
          {
            "title": "Software Engineer",
            "description": "Developed and maintained software applications for Google.",
            "image": "https://example.com/google-office.jpg",
            "link": "https://www.google.com/careers/"
          }
        ],
        "location": "Mountain View, CA"
      }
    }
  ],
  "roles": [
    "admin",
    "user"
  ],
  "customerInfo": {
    "contact": {
      "alias": "John Doe",
      "isPrimary": true,
      "email": "john.doe@example.com",
      "phone": "+1 555-123-4567",
      "fax": "+1 555-123-4568",
      "address": "123 Main Street, Anytown, CA 12345",
      "website": "https://www.johndoe.com/"
    },
    "birthday": "1990-01-01",
    "experience": [
      {
        "title": "Software Engineer",
        "description": "Developed and maintained software applications for Google.",
        "image": "https://example.com/google-office.jpg",
        "link": "https://www.google.com/careers/"
      }
    ],
    "location": "Anytown, CA"
  },
  "privateFields": [
    "password",
    "services"
  ]
},
{
  "_id": {
    "$oid": "6667ddfdf3390c2812c9baaf"
  },
  "accountId": {
    "$oid": "6667ddfdf3390c2812c9baaa"
  }
},
{
  "_id": {
    "$oid": "6667de3c9a9cbf8948c98bbb"
  },
  "accountId": {
    "$oid": "6667de3c9a9cbf8948c98bb6"
  }
},
{
  "_id": {
    "$oid": "6667fb5601c1d346a89f9b06"
  },
  "accountId": {
    "$oid": "6667fb5601c1d346a89f9afd"
  },
  "name": "Danylo",
  "surname": "B."
},
{
  "_id": {
    "$oid": "66689b50f1a8452b969718aa"
  },
  "accountId": {
    "$oid": "66689b50f1a8452b9697188f"
  },
  "name": "Danylo",
  "surname": "B."
},
{
  "_id": {
    "$oid": "666c36620788f371a935da57"
  },
  "accountId": {
    "$oid": "666c36620788f371a935da4e"
  },
  "name": "Олена",
  "surname": "Тихан"
},
{
  "_id": {
    "$oid": "668ecb4a6bf2c37d03eed80b"
  },
  "accountId": {
    "$oid": "668ecb4a6bf2c37d03eed7ec"
  },
  "name": "Danylo",
  "surname": "B.",
  "experiences": [
    {
      "title": "4",
      "type": null,
      "company": "",
      "location": "",
      "locationType": null,
      "startDate": null,
      "endDate": null,
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "das",
      "type": "Full-time",
      "company": "asda",
      "country": "",
      "city": "",
      "locationType": "Office",
      "startDate": {
        "$date": "2024-06-30T22:00:00.000Z"
      },
      "endDate": null,
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "Test",
      "type": "Full-time",
      "company": "Google",
      "country": "",
      "locationType": "Remote",
      "startDate": {
        "$date": "2024-07-10T22:00:00.000Z"
      },
      "endDate": {
        "$date": "2024-07-30T22:00:00.000Z"
      },
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "Test",
      "type": "Full-time",
      "company": "Jabil",
      "country": "",
      "locationType": "Remote",
      "startDate": {
        "$date": "2024-07-10T22:00:00.000Z"
      },
      "endDate": {
        "$date": "2024-07-30T22:00:00.000Z"
      },
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "Team Lead",
      "type": "Full-time",
      "company": "Neocles",
      "country": "Ukraine",
      "locationType": "Hybrid",
      "startDate": {
        "$date": "2020-06-30T22:00:00.000Z"
      },
      "endDate": {
        "$date": "2021-10-30T22:00:00.000Z"
      },
      "description": "",
      "skills": [
        "Angualr"
      ],
      "links": "",
      "media": []
    },
    {
      "title": "Expert Software Engineer",
      "type": "Contract",
      "company": "Ciklum",
      "country": "Ukraine",
      "locationType": "Office",
      "startDate": {
        "$date": "2021-11-30T23:00:00.000Z"
      },
      "endDate": {
        "$date": "2022-06-30T22:00:00.000Z"
      },
      "description": "",
      "skills": [
        "JavaScript"
      ],
      "links": "",
      "media": []
    },
    {
      "title": "CEO",
      "company": "Theia",
      "country": "Netherlands",
      "type": "Self-employed",
      "locationType": "Remote",
      "startDate": {
        "$date": "2024-07-28T22:00:00.000Z"
      },
      "endDate": null,
      "description": "gmails, mobile phones and Linkendin do not really works ",
      "skills": "",
      "links": "",
      "media": []
    }
  ]
},
{
  "_id": {
    "$oid": "66913194cb062cd32a5b1055"
  },
  "accountId": {
    "$oid": "66913194cb062cd32a5b0ab4"
  },
  "name": "Danylo",
  "surname": "B.",
  "experiences": [
    {
      "title": "Test",
      "type": "Full-time",
      "company": "Jabil",
      "country": "Ukraine",
      "locationType": "Hybrid",
      "startDate": {
        "$date": "2022-03-31T22:00:00.000Z"
      },
      "endDate": null,
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "",
      "type": null,
      "company": "",
      "country": "",
      "locationType": null,
      "startDate": null,
      "endDate": null,
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "",
      "type": null,
      "company": "",
      "country": "",
      "locationType": null,
      "startDate": null,
      "endDate": null,
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "",
      "type": null,
      "company": "",
      "country": "",
      "locationType": null,
      "startDate": null,
      "endDate": null,
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "Jab",
      "type": "Full-time",
      "company": "EPAM",
      "country": "Ukraine",
      "locationType": "Office",
      "startDate": {
        "$date": "2018-12-31T23:00:00.000Z"
      },
      "endDate": {
        "$date": "2020-03-31T22:00:00.000Z"
      },
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "Sr. Software Engineer",
      "type": "Full-time",
      "company": "Luxoft",
      "country": "Germany",
      "locationType": "Office",
      "startDate": {
        "$date": "2020-03-31T22:00:00.000Z"
      },
      "endDate": {
        "$date": "2021-03-31T22:00:00.000Z"
      },
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "TestOverlap",
      "company": "TestOverlap",
      "country": "Netherlands",
      "type": "Full-time",
      "locationType": "Remote",
      "startDate": {
        "$date": "2019-12-31T23:00:00.000Z"
      },
      "endDate": {
        "$date": "2024-06-30T22:00:00.000Z"
      },
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    },
    {
      "title": "Test2",
      "company": "Test",
      "country": "",
      "type": "Full-time",
      "locationType": "Office",
      "startDate": {
        "$date": "2024-07-01T22:00:00.000Z"
      },
      "endDate": {
        "$date": "2024-07-12T22:00:00.000Z"
      },
      "description": "",
      "skills": "",
      "links": "",
      "media": []
    }
  ]
}];