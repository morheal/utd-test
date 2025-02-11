# Products Parser

This project is a NestJS application that fetches products from an external API and stores them in a PostgreSQL database. It also provides endpoints to retrieve and manage the products.

## Features

- Fetch products from an external API and store them in a PostgreSQL database.
- Use Bull for background job processing.
- Use Swagger for API documentation.
- Search products by title.
- Pagination support for retrieving products.

## Prerequisites

- Node.js
- Docker
- Docker Compose

## Installation

1. Clone the repository:

```sh
git clone https://github.com/your-repo/products-parser.git
cd products-parser
```

2. Install dependencies:

```sh
npm install
```

3. Create a .env file in the root directory and add the following environment variables:

```sh
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=postgres
REDIS_HOST=redis
REDIS_PORT=6379
```

## Running the Application
1. Start the Docker containers:

```sh
docker-compose up -d
```

2. Create database via pgAdmin at http://localhost:5050 and connect it to application in .env file

Now you can access api endpoints at http://localhost:3000
Access the API Swagger documentation at http://localhost:3000/api.

## Project Structure
- src
- - app.module.ts: The root module of the application.
- - main.ts: The entry point of the application.
- - products/
- - - products.controller.ts: The controller for handling product-related requests.
- - - products.service.ts: The service for handling product-related business logic.
- - - entities/
- - - - product.entity.ts: The entity representing the product model.
- - bg-jobs/
- - - jobs.module.ts: The module for handling background jobs.
- - - jobs.service.ts: The service for handling background job logic.
- - - jobs.processor.ts: The processor for handling job processing logic.