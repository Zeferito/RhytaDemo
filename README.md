# RhytaDemo

[issues-shield]: https://img.shields.io/github/issues/Zeferito/RhytaDemo.svg?style=for-the-badge

[issues-url]: https://github.com/Zeferito/RhytaDemo/issues

[license-shield]: https://img.shields.io/github/license/Zeferito/RhytaDemo.svg?style=for-the-badge

[license-url]: https://github.com/Zeferito/RhytaDemo/blob/master/LICENSE

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

This repository contains an application designed to showcase the resource storage system for an AI scheduler that
automates the creation of schedules for professors, classrooms, and other resources in educational institutions. This
project utilizes Node.js with Sequelize as the primary development stack and supports MySQL.

## Technologies Used

- **Application**:
    - [TypeScript](https://www.typescriptlang.org/): A strongly typed programming language that builds on JavaScript.
    - [Node.js](https://nodejs.org/): A JavaScript runtime for server-side development.
    - [Express.js](https://expressjs.com/): A Node.js web application framework.
    - [Sequelize](https://sequelize.org/): An ORM (Object-Relational Mapping) for MySQL database.
    - [Jest](https://jestjs.io/): A JavaScript testing framework.

- **Databases**:
    - [MySQL](https://www.mysql.com/): A widely used relational database management system.

## Getting Started

To run this application locally, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/Zeferito/RhytaDemo.git
    ```

2. Change into the project directory:

    ```bash
    cd RhytaDemo
    ```

3. Install the required dependencies:

    ```bash
    # Install dependencies
    npm install
    ```

4. Configure the Database:

   Configure the database by following the instructions in
   the [Configuring Database Connections](#configuring-database-connections) section of this README.

5. Configure the server:

   If you followed the instructions in [Configuring Database Connections](#configuring-database-connections), you can
   just open the `.env` file once again using a text editor and add the following environment variables:

    ```plaintext
    SERVER_HOST="your_server_host"             # "localhost"
    SERVER_PORT=your_server_port               # 3000
    ```

   Replace `your_server_host`, and `your_server_port` with your preferred connection details.

6. Build the application:

    ```bash
    npm build
    ```

7. Start the application:

    ```bash
    npm start
    ```

## Configuring Database Connections

To configure the MySQL connection, you must create a `.env` file in the root directory of the project. This file will
contain environment variables that store the database connection information. Here's how to set it up:

### MySQL Configuration

1. In the root directory of the project, create a `.env` file:

    ```bash
    touch .env
    ```

2. Open the `.env` file using a text editor.

3. Add the following environment variables with your MySQL database information:

    ```plaintext
    MYSQLDB_HOST="your_mysql_host"             # "localhost"
    MYSQLDB_PORT=your_mysql_port               # 3306
    MYSQLDB_USER="your_mysql_user"             # "user"
    MYSQLDB_PASSWORD="your_mysql_password"     # "password"
    MYSQLDB_NAME="your_mysql_database_name"    # "mydb"
    ```

   Replace `your_mysql_host`, `your_mysql_port`, `your_mysql_user`, `your_mysql_password`,
   and `your_mysql_database_name` with your actual
   MySQL database details.

## Endpoints

TODO

## Contributing

As this project serves as a demonstration for a school project, it is meant to showcase specific features and
functionalities. Therefore, we have intentionally limited contributions to ensure the project remains aligned with its
educational objectives.

## License

This application is open-source and available under the [MIT License](LICENSE).

## Authors

- [Kawtious](https://github.com/Kawtious)

- [Zeferito](https://github.com/Zeferito)

Feel free to reach out if you have any questions or need assistance with this application.
