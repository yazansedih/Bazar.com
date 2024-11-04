<div align="center">
  <img src="https://github.com/user-attachments/assets/0fc9228c-7011-4bb1-bf09-d18123b8afad" width=500px/>
  <br />
  <br />

 ![GitHub repo size](https://img.shields.io/github/repo-size/yazansedih/Bazar.com) 
 ![GitHub repo file count (file type)](https://img.shields.io/github/directory-file-count/yazansedih/Bazar.com) 
 ![NPM Version](https://img.shields.io/npm/v/npm) 
 ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/yazansedih/Bazar.com/main) 
 ![GitHub issues](https://img.shields.io/github/issues/yazansedih/Bazar.com)
 ![GitHub contributors](https://img.shields.io/github/contributors/yazansedih/Bazar.com)
 ![GitHub All Releases](https://img.shields.io/github/downloads/yazansedih/Bazar.com/total)
 
</div>  

# Bazar.com: A Multi-tier Online Book Store

This project aims to implement Bazar.com, the world's smallest book store, with a two-tier web design employing microservices. The front-end tier accepts user requests, while the back-end consists of a catalog server and an order server. This README will guide you through setting up and testing the system.

## Project Structure

The project consists of three main components:

1. **Frontend**: Handles user requests and communicates with backend services.
2. **Catalog Server**: Manages the catalog of books and supports queries and updates.
3. **Order Server**: Handles purchase requests and updates stock accordingly.

Each component is implemented as a microservice and communicates with others via HTTP REST calls.

## Prerequisites

Before running the project, ensure you have the following installed:

- Docker
- Docker Compose
- Node.js (for local development)

## Setup and Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/yazansedih/Bazar.com.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Bazar.com
   ```

3. Build the Docker images and start the containers:

   ```bash
   docker-compose up --build
   ```

4. The system should now be running on Docker containers. You can access the frontend at `http://localhost:8082`.

## Technologies Used

- **Node.js:** Backend development platform.
- **Postman:** API building, testing and documentation tool.
- **Git:** Version control system.
- **Axios:** making and managing HTTP requests.

## API Documentation

The API is fully documented using Postman. Access the documentation [here](https://documenter.getpostman.com/view/33029075/2sAY4ydff3).

## Testing

#### Postman Testing Strategy

We have employed Postman for comprehensive API testing to ensure the functionality, reliability, and accuracy of the Bazar.com.

#### Demo 

Click on the following link to watch the testing [demo video](https://drive.google.com/file/d/1hybinyPHrOJ9HCezavnAx8vpcRBO604K/view?usp=sharing).

## Vision
Bazar.com lab2 coming soon...
