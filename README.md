# URL Shortener

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Technologies](#technologies)

## About <a name = "about"></a>
- This is a URL shortener service that takes a long URL and converts it into a short URL.
- The short URL is generated based on the long URL and the code that is chosen by the user.
- The short URL is stored in a database and is used to redirect the user to the long URL.
- The app uses a Redis database to store the metrics of how many times each URL has been accessed.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them.

- [Node.js](https://nodejs.org/en/)
- Package Manager - [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/). I used `pnpm` in this project.
- [Docker](https://www.docker.com/)
- [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Visual Studio Code Extension or any other REST client tool
### Installing

A step by step series of examples that tell you how to get a development env running.

1. Clone the repository or download the zip file

2. Install the dependencies

```bash
npm install
```
or 
```bash
yarn install
```
or 
```bash
pnpm install
```

3. Run the database using Docker

```bash
docker-compose up -d
```

4. Run the application

```bash
npm run dev
```
or 
```bash
yarn dev
```
or 
```bash
pnpm dev
```
## Usage <a name = "usage"></a>

This instructions will show you how to use the application.

### Routes
If you are using Visual Studio Code, you can use the [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to test the routes. To do this, just open the `requests.http` file and click on the `Send Request` button that appears on the right side of the route.

#### Create a short URL
- Request:
```http
POST http://localhost:3333/api/links
Content-Type: application/json
```

- Body:
```json
{
    "code": "google",
    "url": "https://www.google.com"
}
```

- Response:
```json
{
  "shortLinkId": 1
}
```

#### Access a short URL
- Request:
```http
GET http://localhost:3333/:code
```

- Parameters:
  - `code`: The code of the short URL

- Response:
The user will be redirected to the long URL. If you're using the REST Client, you can see the page HTML in the response body. If you're using a browser, you will be redirected to the long URL.

#### Get all short URLs
- Request:
```http
GET http://localhost:3333/api/links
```

- Response:
```json
[
  {
    "id": 1,
    "code": "google",
    "original_url": "https://www.google.com",
    "created_at": "2024-03-20T16:22:20.428Z"
  }
]
```

#### Get metrics of a short URL
- Request:
```http
GET http://localhost:3333/api/metrics
```

- Response:
```json
[
  {
    "shortLinkId": 3,
    "clicks": 9
  }
]
```

## Technologies <a name = "technologies"></a>
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [Fastify](https://www.fastify.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Zod](https://zod.dev)