# File Sharing Application

This project is a file sharing application built using React for the frontend and Node.js with Express for the backend. The application allows users to upload files, generate thumbnails for images and PDFs, store files on AWS S3, and manage files using MongoDB.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [License](#license)

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **File Storage**: AWS S3
- **Image Processing**: Sharp
- **Others**: Multer, UUID, Axios

## Features

- User authentication (token-based)
- File upload
- Image and PDF thumbnail generation
- File storage on AWS S3
- File listing and deletion

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine
- MongoDB installed and running
- AWS account with S3 bucket
- An .env file with the required environment variables

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/file-sharing-app.git
cd file-sharing-app
2. Install dependencies for both the backend and frontend:
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
Start Client & Server

3.Environment Variables
Create a .env file in the server directory with the following content:

PORT=3001
MONGODB_URI=mongodb://localhost:27017/file-sharing-app
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_ACCESS_KEY_SECRET=your_aws_access_key_secret
AWS_REGION=us-east-2
AWS_BUCKET_NAME=your_bucket_name


