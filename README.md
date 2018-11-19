# Cucei Ayuda (QCInf)

QCInf RESTful API designed for the Web Programming course (2018-B) in Node.js.

### Description

This is the RESTful API for the CUCEI's help application. It is designed for giving all the information related to scheduling and orientation (maps) for students inside the campus. Also, it gives the information with regard to teachers, doubts and/or recommendations through a forum resource.

### REQUIRED

The app need some packages or specific programs to run, here is a list of all the dependencies:

+ "body-parser"
+ "dotenv"
+ "express"
+ "mysql"
+ "faker"

All of these packages are installed using node package manager.
To install npm refer to this official website with all the details https://www.npmjs.com/get-npm

For example to install body-parser use the following command in your terminal window:

```
  npm install body-parser
 ```
  
And do the same with all the other dependencies.

### BUILDING (LOCALLY)

To run this application locally, the user must clone/download this repo into his machine and run the [database script](https://github.com/SchwarzeFalke/cucei-ayuda/wiki/Database). The database is a relational database developed with MySQL, but any SQL manager should work with it.

![alt-text](https://i.imgur.com/zx2Ieza.png)

### DEPLOYMENT

To use this app in real time it's necesary to deploy the app to a server, for this app we choosed to use heroku's free app hosting.
Also we need to use ClearDB a package for heroku for connecting to a mysql database.

To use heroku you first need to create an account on heroku's official website https://heroku.com
. Install heroku CLI (Command Line Interface)
. create an app
. clone git repository
. configure heroku to use your newly created app
. install ClearDB
. Configure environment variables in heroku to use ClearDB
. Create the tables in your database using mysql

Use heroku open to open the app

### APP MODULES

#### USERS MODULE

This module allows to create users into database as well as handle the schedules and roads (for the map resource). Also, allows the user to request for its posts on the forum resource.

All the users can create schedules from the subject resource, but only that. Higher privilages are required to make another actions with the subject table.

#### MAP MODULE

This module is only used to see buildings and retrieve a specific building

#### SUBECT MODULE

This module is only for the administrator user; allows to create new subjects to create schedules for the users. This model is related to the building model, because it needs information about the bulding where the class is given.

The normal user cannot manipulate the data from this model.

#### FORUM MODULE

The forum allow users to create topics, which is usually a word describing the main theme of the topic. ej "Comida"

Inside each Topics users can create threads, the threads are composed by a sentences that describes his/her problem
or opinion related to the topic.

All users can make posts on the threads to answer the questions made by the author of the thread.

All the users can enter their subjects and with their schedule they can generate a map with routes to their daily classrooms.

For more information about the forum:
  + [Topics](https://github.com/SchwarzeFalke/cucei-ayuda/wiki/Topics)
  + [Threads](https://github.com/SchwarzeFalke/cucei-ayuda/wiki/Threads)
  + [Posts](https://github.com/SchwarzeFalke/cucei-ayuda/wiki/Posts)

## POSTMAN

### Collection

To get access to the API's Postman Collection, please visit [this link](https://www.getpostman.com/collections/26ad4e3449008ebf1c02)

### API Documentation
To see more documentation about the project, please visit [this link](https://documenter.getpostman.com/view/5136276/RWgryJ77)

## Authors

+ [Carlos Vara](https://github.com/SchwarzeFalke) 
+ [Brandon Diaz](https://github.com/BrandonDiazM) 
+ [Tyler Ruiz](https://github.com/tyler97)
+ [Julio Mariscal](https://github.com/JulioMariscal)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/SchwarzeFalke/cucei-ayuda/blob/master/LICENSE) file for details
