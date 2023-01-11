# Junior Workers

## Description

Junior Workers is a concept project of a professional networking web app platform used by undergraduate/postgraduate students and hirers. The main goal of the platform is to help both students and hirers cover their job search needs. Students can create their personal profiles and upload their CVs. Also, they can search job posts created by hirers. Hirers can search for students based on the position requirements they want to cover and create job posts to let students communicate with them.

For this project, I:
- Developed REST API controllers utilizing CRUD functions
with Java (JAXRS-Jersey)
- Applied JWT to ensure authentication
- Developed a web application using React to handle the
users'views
- Utilized react-route for asynchronous routing through the
web application
- Designed normalized relational database

### The project is Built with
- Front-End
  - HTML5
  - CSS3
  - Js (ES6)
  - React framework (+ react-route-dom lib)
- Back-End (api)
  - Authentication JWT
  - Java
  - MySQL

## Requirements to run on developer mode
- Front-end
  - Node.js (Currently on version 10.16.0)
- Back-end (API)
  - JDK 1.8+
  - Maven 3.8+
  - MySQL server (Currently on version 8.0.13)

## Instructions to run the project in a local testing environment

To setup the project's API follow the instructions [here](https://github.com/JohnDelta/JuniorWorkersAPI)

  Clone the project to your machine and download all the necessary files
```bash
git clone https://github.com/JohnDelta/junior-workers.git
npm install
npm install react-router-dom
```

  Run the react app from project's folder in developer mode
```bash
npm start
```

### Run built version of react app
The 2nd branch(gh-pages) contains the built version of the react app. In order to run it it's necessary to upload it on a web server. If you try to run it in localhost it won't work.

