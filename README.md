# Our Bible API

> Backend resources for Our Bible

This Node.js/Express API, written in Typescript, is the primary backend package for [Our Bible](https://ourbible.io).

You'll need [Node.js](https://nodejs.org/en/download/) installed.

## Setup

Before running the API, take care of the following.

### Intall this repo

After cloning the repo, run `npm install` in the project's root directory.

### .env file

You must create a .env in the root directory of this project to move foward! The .env file contains database-related variables.

Your .env file should look like the following. For \*\_DB_DIALECT, you may use `mysql` or any other dialect supported by [Sequelize](https://www.npmjs.com/package/sequelize).

```
DEV_DB_DIALECT=yourDialect
DEV_DB_USERNAME=yourUsername
DEV_DB_PASSWORD=yourPassword
DEV_DB_HOST=yourDBHost

PROD_DB_DIALECT=mysql
PROD_DB_USERNAME=yourUsername
PROD_DB_PASSWORD=yourPassword
PROD_DB_HOST=yourDBHost
```

### Your database

Create two schema in your database: one named `dev_our_bible`, and one named `prod_our_bible`.

## Usage

Once you've completed setup, you're ready to run the API.

### Development mode

Run `npm run dev`.

If it's your first time running the API, bible data will be added to your database. This may take a while -- a few minutes on a decent machine with decent internet.

API endpoints will be exposed at `localhost:3006`.

### Production mode

Run `npm run prod`.

If it's your first time running the API, bible data will be added to your database. This may take a while -- a few minutes on a decent machine with decent internet.

API endpoints will be exposed on port 3007.

## Contribute

Find a bug? Want to make an improvement? Submit an issue or a pull request! 😃
