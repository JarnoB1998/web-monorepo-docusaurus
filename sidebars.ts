import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  theorieSidebar: [
  {
    "type": "doc",
    "id": "index",
    "label": "Introductie"
  },
  {
    "type": "category",
    "label": "Tooling",
    "items": [
      {
        "type": "doc",
        "id": "tooling/devcontainers",
        "label": "Devcontainers"
      },
      {
        "type": "doc",
        "id": "tooling/git",
        "label": "Git"
      },
      {
        "type": "doc",
        "id": "tooling/bash",
        "label": "Terminal en bash"
      }
    ]
  },
  {
    "type": "category",
    "label": "NodeJS + TypeScript",
    "items": [
      {
        "type": "doc",
        "id": "nodejs-+-typescript/wat-is-nodejs",
        "label": "Wat is NodeJS?"
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/waarom-typescript",
        "label": "Waarom TypeScript?"
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/projectmaken",
        "label": "Nieuw project"
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/input-lezen",
        "label": "Input lezen"
      },
      {
        "type": "category",
        "label": "Type Systeem",
        "link": {
          "type": "doc",
          "id": "nodejs-+-typescript/type-systeem/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/basic-types",
            "label": "Basic types"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/arrays",
            "label": "Arrays"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/interfaces",
            "label": "Interfaces"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/functions",
            "label": "Functions"
          }
        ]
      },
      {
        "type": "category",
        "label": "Array Functions",
        "link": {
          "type": "doc",
          "id": "nodejs-+-typescript/array-functions/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/map",
            "label": "Array.map()"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/filter",
            "label": "Array.filter()"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/reduce",
            "label": "Array.reduce()"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/find",
            "label": "Array.find()"
          }
        ]
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/exceptions",
        "label": "Exceptions"
      },
      {
        "type": "category",
        "label": "Modules & npm",
        "items": [
          {
            "type": "doc",
            "id": "nodejs-+-typescript/modules-npm/modules",
            "label": "Modules"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/modules-npm/npm-packages",
            "label": "Node Package Manager (npm)"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/modules-npm/quiz",
            "label": "Quiz"
          },
        ]
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/testing",
        "label": "Testing"
      },
      {
        "type": "category",
        "label": "Asynchroon Programmeren",
        "link": {
          "type": "doc",
          "id": "nodejs-+-typescript/asynchroon-programmeren/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/promises",
            "label": "Promises"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/async-await",
            "label": "Async/Await"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/fetch",
            "label": "Fetch"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/extra",
            "label": "Extra voorbeelden"
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Express.js",
    "items": [
      {
        "type": "doc",
        "id": "express.js/wat-is-een-backend-framework",
        "label": "Wat is een backend framework?"
      },
      {
        "type": "doc",
        "id": "express.js/basis",
        "label": "Basis"
      },
      {
        "type": "doc",
        "id": "express.js/nodemon",
        "label": "Nodemon"
      },
      {
        "type": "doc",
        "id": "express.js/statische-bestanden",
        "label": "Statische Bestanden"
      },
      {
        "type": "doc",
        "id": "express.js/ejs",
        "label": "EJS"
      },
      {
        "type": "category",
        "label": "Request",
        "link": {
          "type": "doc",
          "id": "express.js/requests/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "express.js/requests/get-request",
            "label": "GET Request"
          },
          {
            "type": "doc",
            "id": "express.js/requests/post-request",
            "label": "POST Request"
          },
          {
            "type": "doc",
            "id": "express.js/requests/multi-part-form-data",
            "label": "Multi-part form data"
          }
        ]
      },
      {
        "type": "doc",
        "id": "express.js/response",
        "label": "Response"
      },
      {
        "type": "doc",
        "id": "express.js/router",
        "label": "Router"
      },
      {
        "type": "doc",
        "id": "express.js/middleware",
        "label": "Middleware"
      },
      {
        "type": "doc",
        "id": "express.js/client-side-typescript",
        "label": "Client Side TypeScript"
      },
      {
        "type": "doc",
        "id": "express.js/deployment",
        "label": "Deployment"
      },
      {
        "type": "doc",
        "id": "express.js/testen",
        "label": "Express testen"
      }
    ]
  },
  {
    "type": "category",
    "label": "MongoDB",
    "items": [
      {
        "type": "doc",
        "id": "mongodb/wat-is-mongodb",
        "label": "Wat is MongoDB?"
      },
      {
        "type": "doc",
        "id": "mongodb/mongodb-driver",
        "label": "MongoDB driver"
      },
      {
        "type": "doc",
        "id": "mongodb/insert",
        "label": "Insert"
      },
      {
        "type": "doc",
        "id": "mongodb/find",
        "label": "Find"
      },
      {
        "type": "doc",
        "id": "mongodb/limit-and-sort",
        "label": "Limit & Sort"
      },
      {
        "type": "doc",
        "id": "mongodb/query-operators",
        "label": "Query Operators"
      },
      {
        "type": "doc",
        "id": "mongodb/update",
        "label": "Update"
      },
      {
        "type": "doc",
        "id": "mongodb/delete",
        "label": "Delete"
      },
      {
        "type": "doc",
        "id": "mongodb/text-search",
        "label": "Text Search"
      },
      {
        "type": "category",
        "label": "Gebruik in Express.js",
        "link": {
          "type": "doc",
          "id": "mongodb/gebruik-in-express.js"
        },
        "items": [
          {
            "type": "doc",
            "id": "mongodb/CRUD",
            "label": "CRUD"
          }
        ]
      },
      {
        "type": "doc",
        "id": "mongodb/mocking",
        "label": "Mocking"
      }
    ]
  },
  {
    "type": "category",
    "label": "Security",
    "items": [
      {
        "type": "doc",
        "id": "security/environment-variables",
        "label": "Environment Variables"
      },
      {
        "type": "doc",
        "id": "security/cookies",
        "label": "Cookies"
      },
      {
        "type": "doc",
        "id": "security/hashing",
        "label": "Hashing"
      },
      {
        "type": "category",
        "label": "Sessions",
        "link": {
          "type": "doc",
          "id": "security/sessions"
        },
        "items": [
          {
            "type": "doc",
            "id": "security/session-based-login",
            "label": "Session Based Login"
          }
        ]
      }
    ]
  },
],
  labosSidebar: [
      {
        "type": "doc",
        "id": "labos/labo1/index",
        "label": "1. Tooling"
      },
      {
        "type": "category",
        "label": "2. Basis",
        "link": {
          "type": "doc",
          "id": "labos/labo2/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/hello-name/README",
            "label": "Hello Name"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/bmi-calculator/README",
            "label": "BMI Calculator"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/bmi-calculator-multi/README",
            "label": "BMI Calculator Multi"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/interest-calculator/README",
            "label": "Interest Calculator"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/uren-en-minuten/README",
            "label": "Uren en Minuten"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/wisselgeld/README",
            "label": "Wisselgeld"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/name-from-email/README",
            "label": "Name from Email"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/text-box/README",
            "label": "Text Box"
          },
          {
            "type": "doc",
            "id": "labos/labo2/robot-readline",
            "label": "Robot Readline"
          }
        ]
      },
      {
        "type": "category",
        "label": "3. Arrays",
        "link": {
          "type": "doc",
          "id": "labos/labo3/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/som-van-getallen/README",
            "label": "Som van getallen"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/puntenboek/README",
            "label": "Puntenboek"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/rot13/README",
            "label": "Rot13"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/pokemon-team/README",
            "label": "Pokemon Team"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/todo-list-string/README",
            "label": "Todo List String"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/tic-tac-toe/README",
            "label": "Tick Tac Toe"
          },
          {
            "type": "doc",
            "id": "labos/labo3/robot-caesar",
            "label": "Robot Caesar"
          }
        ]
      },
      {
        "type": "category",
        "label": "4. Interfaces & functies",
        "link": {
          "type": "doc",
          "id": "labos/labo4/index"
        },
        "items": [
          {
            "type": "category",
            "label": "Interfaces",
            "link": {
              "type": "doc",
              "id": "labos/labo4/interfaces/index"
            },
            "items": [
              {
                "type": "doc",
                "id": "exercises/node-typescript/recepten/README",
                "label": "Recepten"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/movies-objects/README",
                "label": "Movies Objects"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/todo-list-objects/README",
                "label": "Todo List Objects"
              }
            ]
          },
          {
            "type": "category",
            "label": "Functies",
            "link": {
              "type": "doc",
              "id": "labos/labo4/functions/index"
            },
            "items": [
              {
                "type": "doc",
                "id": "exercises/node-typescript/math-fun/README",
                "label": "Math Fun"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/short-notation/README",
                "label": "Short Notation"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/array-sum/README",
                "label": "Array Sum"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/movies-functions/README",
                "label": "Movies Functions"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/filter-numbers/README",
                "label": "Filter Numbers"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/at-least-two/README",
                "label": "At Least Two"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "5. Async & fetch",
        "link": {
          "type": "doc",
          "id": "labos/labo5/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/fake-fetch/README",
            "label": "Fake Fetch"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/promise-all/README",
            "label": "Promise All"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/slow-sum/README",
            "label": "Slow Sum"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/todo-list-fetch/README",
            "label": "Todo List Fetch"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cocktails-promise-all/README",
            "label": "Cocktails Promise All"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/bitcoin-api/README",
            "label": "Bitcoin API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/joke-api/README",
            "label": "Joke API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/school-api/README",
            "label": "School API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cocktails-api/README",
            "label": "Cocktails API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/unix-timestamp-api/README",
            "label": "Unix Timestamp API"
          }
        ]
      },
      {
        "type": "category",
        "label": "6. Modules, npm & testing",
        "link": {
          "type": "doc",
          "id": "labos/labo6/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/math-module/README",
            "label": "Math Module"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/export-interfaces/README",
            "label": "Export Interfaces"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cowsay-module/README",
            "label": "Cowsay Module"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cat-gpt/README",
            "label": "Cat GPT"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/rainbow-chalk/README",
            "label": "Rainbow Chalk"
          },
          { "type": "doc", "id": "exercises/node-typescript/math-test/README", "label": "Math Test" },
          { "type": "doc", "id": "exercises/node-typescript/exceptions-test/README", "label": "Exceptions Test" },
          { "type": "doc", "id": "exercises/node-typescript/async-test/README", "label": "Async Test" },
          { "type": "doc", "id": "exercises/node-typescript/todo-list-test/README", "label": "Todo List Test" }
        ]
      },
      {
        "type": "category",
        "label": "7. Express",
        "link": {
          "type": "doc",
          "id": "labos/labo7/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/hello-express/README",
            "label": "Hello Express"
          },
          {
            "type": "doc",
            "id": "exercises/express/dadjoke-express/README",
            "label": "DadJoke Express"
          },
          {
            "type": "doc",
            "id": "exercises/express/bitcoin-current/README",
            "label": "Bitcoin current"
          }
        ]
      },
      {
        "type": "category",
        "label": "8. EJS + Static",
        "link": {
          "type": "doc",
          "id": "labos/labo8/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/hello-express-ejs/README",
            "label": "Hello Express EJS"
          },
          {
            "type": "doc",
            "id": "exercises/express/catstatic/README",
            "label": "Cat Static"
          },
          {
            "type": "doc",
            "id": "exercises/express/maaltafels-ejs/README",
            "label": "Maaltafels"
          },
          {
            "type": "doc",
            "id": "exercises/express/newspaper/README",
            "label": "Newspaper"
          }
        ]
      },
      {
        "type": "category",
        "label": "9. Get Request",
        "link": {
          "type": "doc",
          "id": "labos/labo9/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/hello-query/README",
            "label": "Hello Query"
          },
          {
            "type": "doc",
            "id": "exercises/express/math-service-express/README",
            "label": "Math Service"
          },
          {
            "type": "doc",
            "id": "exercises/express/newspaper-route/README",
            "label": "Newspaper Route"
          },
          {
            "type": "doc",
            "id": "exercises/express/newspaper-search/README",
            "label": "Newspaper Search"
          },
          {
            "type": "doc",
            "id": "exercises/express/steam/README",
            "label": "Steam"
          }
        ]
      },
      {
        "type": "category",
        "label": "10. Post Requests & testing",
        "link": {
          "type": "doc",
          "id": "labos/labo10/index"
        },
        "items": [
          {
            "type": "category",
            "label": "POST requests",
            "link": {
              "type": "doc",
              "id": "labos/labo10/index"
            },
            "items": [

              {
                "type": "doc",
                "id": "exercises/express/petshelter-form/README",
                "label": "Pet Shelter"
              },
              {
                "type": "doc",
                "id": "exercises/express/redirect-form/README",
                "label": "Redirect Form"
              },
              {
                "type": "doc",
                "id": "exercises/express/contact-form/README",
                "label": "Contact Form"
              }
            ]
          },
          {
            "type": "category",
            "label": "Express testen",
            "link": {
              "type": "doc",
              "id": "labos/labo10/index"
            },

            "items": [
              {
                "type": "doc",
                "id": "exercises/express/math-express-test/README",
                "label": "Math Express Test"
              },
              {
                "type": "doc",
                "id": "exercises/express/hello-query-test/README",
                "label": "Hello Query Test"
              },
              {
                "type": "doc",
                "id": "exercises/express/form-express-test/README",
                "label": "Form Express Test"
              },
              {
                "type": "doc",
                "id": "exercises/express/contact-form-test/README",
                "label": "Contact Form Test"
              },
              {
                "type": "doc",
                "id": "exercises/express/pet-shelter-express-test/README",
                "label": "Pet Shelter Test"
              },
            ]
          },
        ]
      },
      {
        "type": "category",
        "label": "11. Router en Middleware",
        "link": {
          "type": "doc",
          "id": "labos/labo11/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/router-combi/README",
            "label": "Router Combi"
          },
          {
            "type": "doc",
            "id": "exercises/express/utility-middleware/README",
            "label": "Utility Middleware"
          },
          {
            "type": "doc",
            "id": "exercises/express/rate-limiter-middleware/README",
            "label": "Rate Limiter"
          }
        ]
      },
      {
        "type": "category",
        "label": "12. Herhaling",
        "link": {
          "type": "doc",
          "id": "labos/labo12/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/twitter/README",
            "label": "Twitter"
          },
          {
            "type": "doc",
            "id": "exercises/express/word-guess/README",
            "label": "Word Guess"
          }
        ]
      },
      {
        "type": "category",
        "label": "13. Mongo Basics",
        "link": {
          "type": "doc",
          "id": "labos/labo13/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/guestbook/README",
            "label": "Guestbook"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/movies-db/README",
            "label": "MoviesDB"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/pokemon-team/README",
            "label": "Pokemon Team"
          }
        ]
      },
      {
        "type": "category",
        "label": "14. Mongo Queries",
        "link": {
          "type": "doc",
          "id": "labos/mongo-queries/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/pet-shelter/README",
            "label": "Pet Shelter"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/games-db/README",
            "label": "Games DB"
          }
        ]
      },
      {
        "type": "category",
        "label": "15. Mongo + Express",
        "link": {
          "type": "doc",
          "id": "labos/mongo-+-express/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/pet-shelter-express/README",
            "label": "Pet Shelter Express"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/guestbook-express/README",
            "label": "Guestbook Express"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/pokemon-team-express/README",
            "label": "Pokemon Team Express"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/pet-shelter-express-test/README",
            "label": "Pet Shelter Express Test"
          }
        ]
      },
      {
        "type": "category",
        "label": "16. CRUD",
        "link": {
          "type": "doc",
          "id": "labos/crud/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/users-crud-express/README",
            "label": "Users CRUD"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/pokedex-mongo-express/README",
            "label": "Pokedex"
          }
        ]
      },
      {
        "type": "category",
        "label": "17. Session & Cookies",
        "link": {
          "type": "doc",
          "id": "labos/session-and-cookies/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/security/shopping-cookie/README",
            "label": "Shopping Cookie"
          },
          {
            "type": "doc",
            "id": "exercises/security/view-counter-cookies/README",
            "label": "View Counter Cookies"
          },
          {
            "type": "doc",
            "id": "exercises/security/view-counter-sessions/README",
            "label": "View Counter Sessions"
          }
        ]
      },
      {
        "type": "category",
        "label": "18. Session based login",
        "link": {
          "type": "doc",
          "id": "labos/session-based-login/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/security/login-express/README",
            "label": "Login Express"
          },
          {
            "type": "doc",
            "id": "exercises/security/pokedex-express-sessions/README",
            "label": "Pokedex Express Sessions"
          }
        ]
      },
      {
        "type": "category",
        "label": "21. Herhaling",
        "link": {
          "type": "doc",
          "id": "labos/herhaling/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/herhaling/youtube-playlists/README",
            "label": "Youtube Favorites"
          },
          {
            "type": "doc",
            "id": "exercises/herhaling/beerster/README",
            "label": "Beerster"
          }
        ]
      },
      {
        "type": "category",
        "label": "Extra oefeningen",
        "link": {
          "type": "doc",
          "id": "labos/extra/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/dna-match/README",
            "label": "DNA Match"
          },
          {
            "type": "doc",
            "id": "exercises/express/viewcounter/README",
            "label": "View Counter"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/hogwarts-express-crud/README",
            "label": "Hogwarts Express CRUD"
          }
        ]
      },
      {
        "type": "doc",
        "id": "labos/circuit-crawler",
        "label": "Circuit Crawler"
      },
],
  projectSidebar: [
      {
        "type": "doc",
        "id": "project/dev-container",
        "label": "Voorbereiding (devcontainer + github)"
      },
      {
        "type": "category",
        "label": "Semester 2",
        "link": {
          "type": "doc",
          "id": "project/semester-2/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "project/semester-2/milestone-0-json",
            "label": "Milestone 0 - JSON"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-1-terminal-app",
            "label": "Milestone 1 - Terminal App"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-2-express",
            "label": "Milestone 2 - Express"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-3-mongodb",
            "label": "Milestone 3 - MongoDB"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-4-security",
            "label": "Milestone 4 - Security"
          }
        ]
      },
      {
        "type": "category",
        "label": "Semester 1",
        "link": {
          "type": "doc",
          "id": "project/semester-1/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "project/semester-1/node-client",
            "label": "Milestone 1 - Terminal App"
          },
          {
            "type": "doc",
            "id": "project/semester-1/milestone-2-express",
            "label": "Milestone 2 - Express"
          },
          {
            "type": "doc",
            "id": "project/semester-1/milestone-3-mongodb",
            "label": "Milestone 3 - MongoDB"
          },
          {
            "type": "doc",
            "id": "project/semester-1/milestone-4-security",
            "label": "Milestone 4 - Security"
          }
        ]
      }
]
};

export default sidebars;
