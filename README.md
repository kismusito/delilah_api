# Delilah API
## _Acamica Three project_

[![N|Acamica](https://sc.acamica.com/icons/1j7w9h/social-300x300.png)](https://sc.acamica.com/icons/1j7w9h/social-300x300.png)

## Tech

- [NodeJS](hhttps://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [ExpressJS](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [BabelJS](https://babeljs.io/) - Babel is a JavaScript compiler
- [Mysql](https://www.mysql.com/) - MySQL Database Service is a fully managed database service to deploy cloud-native applications. 

## Installation

Delilah requires [Node.js](https://nodejs.org/) v10+ to run and mysql, i use xampp

### Important

For this project you need to start your mysql server, and import the database, you can find it in the database sql file in the root of the project

Configure .env

```sh
PRIVATE_KEY= private key for token

DBHOST= host
DBNAME= database name
DBUSER= database user
DBPASSWORD= database password
```

if this not works configure acces in src/config/index.js

Install the dependencies and devDependencies and start the server.

```sh
cd delilah_api
npm i
npm run dev
```

Now you can test the diferent enpoints,  you can find the api docs in the fle spect.yml or [Api swagger docs](https://app.swaggerhub.com/apis/kismusito/Delilah/1.0.0#/) 


## License

MIT