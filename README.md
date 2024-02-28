# **NestJS Raw Data API**

Welcome to the NestJS Raw Data API! This API allows you to handle process upload .zip, .csv and .csv.gz and insert data to mongodb and how result data series.

## **Table of Contents**

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)
  - [Running in Docker](#running-in-docker)
- [Usage](#usage)
  - [Endpoints](#endpoints)
- [License](#license)

## **Getting Started**

### **Installation**

To install the this project, follow these steps:

```bash
# need node js version: 18.16.1
# npm version: 9.5.1

$ git clone https://github.com/bagusgandhi/backend-raw-data-graph.git

$ cd ./backend-raw-data-graph

$ npm install
```


### **Configuration**

Copy the .env.example file to .env and fill in the required values.


```bash
$ cp .env.sample .env
```

In .env file, the **MONGO_URI** content should be like this:


```bash
MONGO_URI="mongodb://user:password@host:port/?authMechanism=DEFAULT"
```

### **Running the app**

For running the app, you can choose as you needed 

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### **Running in Docker**

For running the app in Docker, first you need setup the database mongodb.

Run docker compose up

```bash
$ docker compose up -d --build
```

## **Usage**

### **Endpoints**

The Endpoints Documentation you can acces in this link:
[Link Api Docs](https://documenter.getpostman.com/view/7162317/2sA2rFRzdC)

## **Lisence**

This project is licensed under the MIT License.
