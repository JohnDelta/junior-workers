# Junior Workers

## Description

Junior Workers is a concept project of a professional networking web app platform used by undergraduate/postgraduate students and hirers. The main goal of the platform is to help both students and hirers cover their job search needs. Students can create their personal profiles and upload their CVs. Also, they can search job posts created by hirers. Hirers can search for students based on the position requirements they want to cover and create job posts to let students communicate with them.

### Built with
- Front-End
  - HTML5
  - CSS3
  - Js (ES6)
  - React framework (+ react-route-dom lib)
- Back-End (api)
  - Authentication JWT
  - PHP
  - MySQL

## Requirements to run on developer mode
- Front-end
  - Node.js (Currently on version 10.16.0)
- Back-end (API)
  - PHP Server (Using XAMPP/Apache for this example running on localhost)
  - MySQL server (Currently on version 8.0.13)

## Installation

  Clone the project to your machine and download all the necessary files
```bash
git clone https://github.com/JohnDelta/junior-workers.git
npm install
npm install react-router-dom
```

  Open MySQL and create a new database
```bash
CREATE DATABASE junior_workers;
```

  Enter the database and run the 'junior_workers.sql' script from project's files
```bash
use junior_workers;
source path\to\script\junior_workers.sql;
```

  Copy the 'api' folder from project's files to server's localhost files (ex. xampp/htdocs/junior-workers) folder and start the server. Note that some example users and their images are already uploaded in api's folder in 'uploads' folder.

  Run the react app from project's folder in developer mode
```bash
npm start
```

### Run built version of react app
The 2nd branch(gh-pages) contains the built version of the react app. In order to run it it's necessary to upload it on a web server. If you try to run it in localhost it won't work.

