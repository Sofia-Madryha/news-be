# NC News

A link to the hosted version: https://news-be-spad.onrender.com

Project Overview:

The News API is a RESTful API built using Node.js, Express, and PostgreSQL. It allows users to fetch news articles, topics, users and comments, and supports full CRUD functionality.


Follow the steps below to run the project locally:

1. Clone the Repository - git clone https://github.com/Sofia-Madryha/news-be.git

2. Install dependencies - npm install

3. Set up databases - npm run setup-dbs

4. Seed local databases - npm run seed-dev

5. Run the server - npm start

6. Run tests - npm test


Environment Setup

1. To run the project locally, you'll need to create environment variable files for your databases:
     - .env.test (for the test database).
     - .env.development (for the development database).
     
2. Each file should contain the following environment variables:
     - PGDATABASE=example_database 
        and
     - PGDATABASE=example_database_test



Minimum Requirements:
Node.js: v18.0.0 or higher
PostgreSQL: v14 or higher