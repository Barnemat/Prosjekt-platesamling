# Prosjekt-platesamling
An application for managing record collections

## Examples of use
As there is currently no live application running, there's been added a few basic examples of use in the [examples folder](https://github.com/Barnemat/Prosjekt-platesamling/tree/master/examples).
An example of use (the adding of records) may also be seen below. ![Adding records example](https://github.com/Barnemat/Prosjekt-platesamling/blob/master/examples/add_records.gif)

## Setting up the project locally
The steps should be somewhat similar for all operating systems, but I run ubuntu linux. The commands in this guide will problably be different on other systems.
### First steps
You need to install [node](https://nodejs.org/en/) and preferably [yarn](https://yarnpkg.com/lang/en/docs/install/), but you could do without it if you are not adding new packages.

Clone the repository to your local computer, and go to the folder destination.

Then you will need to install the packages used by the project. `yarn install` does this.

Example commands for the above steps in a terminal:
```
git clone https://github.com/Barnemat/Prosjekt-platesamling.git
cd Prosjekt-platesamling
yarn install
```
The project should now be able to run, but you must also set up a local database (MongoDB) to enable the desired functionality.
The most important commands for running the project are `yarn dev`, which sets up a dev server running at [localhost:9000](http://localhost:9000) and `yarn serve`, which sets up an express server running at [localhost:8080](http://localhost:8080). 

The express server serves the page directly from the dist folder, and therefore the project needs to be built before this command can be run. `yarn build` or `yarn servebuild` accomplishes this.

The database service should also be running. This is described in the local database setup section.

The reason to use `yarn dev` in addition to `yarn serve` is because it picks up on all changes made in the src folder, so that the project must not manually be rebuilt, on every change of application code. When making webpack or server changes a full rebuild is needed. 
### Local database setup
You need to install a [MongoDB](https://docs.mongodb.com/manual/installation/#tutorial-installation) version. Community Edition should suffice.
Then you need to start a MongoDB process. There's probably not neccesary to manually set up a database beforehand, because mongoDB adds everything that does not already exist, but you could do it as a precaution.
```
sudo service mongod start                                        // Starts the mongoDB service on ubuntu linux (is possibly the only thing neccesary to start adding records directly from the apllication)
mongo                                                            // Starts a mongo shell
> use record_collection                                          // Adds a database
> db.records.insertOne({title: 'Test Title', date: new Date(), format: 'CD'})  // Adds a test document to the collection. This will save the database and collection.
```
The `sudo service mongod start` command must be run again each time you reboot your system.
