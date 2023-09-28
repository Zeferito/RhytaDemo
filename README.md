# RhytaDemo

[issues-shield]: https://img.shields.io/github/issues/Zeferito/RhytaDemo.svg?style=for-the-badge

[issues-url]: https://github.com/Zeferito/RhytaDemo/issues

[license-shield]: https://img.shields.io/github/license/Zeferito/RhytaDemo.svg?style=for-the-badge

[license-url]: https://github.com/Zeferito/RhytaDemo/blob/master/LICENSE

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<div align="center">
    <p align="center">
        This repository contains an application designed to showcase the resource storage system for an AI scheduler that automates the creation of schedules for professors, classrooms, and other resources in educational institutions. This project utilizes Node.js with Sequelize and Mongoose as the primary development stack and supports both MySQL and MongoDB as databases for flexible storage.
    </p>
</div>

## Technologies Used

- **Application**:
    - [Node.js](https://nodejs.org/): A JavaScript runtime for server-side development.
    - [Sequelize](https://sequelize.org/): An ORM (Object-Relational Mapping) for MySQL database.
    - [Mongoose](https://mongoosejs.com/): An ODM (Object-Data Modeling) library for MongoDB.

- **Databases**:
    - [MySQL](https://www.mysql.com/): A widely used relational database management system.
    - [MongoDB](https://www.mongodb.com/): A NoSQL database for flexible and scalable data storage.

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

4. Configure the Databases:

   Configure the databases by following the instructions in
   the [Configuring Database Connections](#configuring-database-connections) section of this README. You'll need to set
   up both MySQL and MongoDB connections.

5. Start the application:

    ```bash
    npm start
    ```

## Configuring Database Connections

To configure the MySQL and MongoDB connections, you can create a `.env` file in the root directory of the `server`
folder. This file should contain environment variables that store the necessary database connection information. Here's
how to set it up:

### MySQL Configuration

1. Create a `.env` file in the directory:

    ```bash
    touch .env
    ```

2. Open the `.env` file using a text editor.

3. Add the following environment variables with your MySQL database information:

    ```plaintext
    MYSQLDB_HOST=your_mysql_host
    MYSQLDB_USER=your_mysql_user
    MYSQLDB_PASSWORD=your_mysql_password
    MYSQLDB_NAME=your_mysql_database_name
    ```

   Replace `your_mysql_host`, `your_mysql_user`, `your_mysql_password`, and `your_mysql_database_name` with your actual
   MySQL database details.

#### MongoDB Configuration

1. Create a `.env` file in the directory:

    ```bash
    touch .env
    ```

2. Open the `.env` file using a text editor.

3. Add the following environment variables with your MongoDB connection information:

    ```plaintext
    MONGODB_URI=your_mongodb_connection_uri
    ```

   Replace `your_mongodb_connection_uri` with the actual connection URI to your MongoDB database.

Make sure to keep your `.env` file secure and do not share it publicly.

## Contributing

As this project serves as a demonstration for a school project, it is meant to showcase specific features and
functionalities. Therefore, we have intentionally limited contributions to ensure the project remains aligned with its
educational objectives.

## License

This application is open-source and available under the [MIT License](LICENSE).

## Author

- [Kawtious](https://github.com/Kawtious)

- [Zeferito](https://github.com/Zeferito)

Feel free to reach out if you have any questions or need assistance with this application.
