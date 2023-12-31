/*
 * MIT License
 * 
 * Copyright (c) 2023 Kawtious, Zeferito
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
require('dotenv').config();

const Sequelize = require('sequelize');

const readlineSync = require('readline-sync');

const CareerView = require('./views/career_view');
const CourseView = require('./views/course_view');
const ProfessorView = require('./views/professor_view');
const ProfessorEventView = require('./views/professor_event_view');
const TermView = require('./views/term_view');

const dbConfig = {
    host: process.env.MYSQLDB_HOST,
    port: process.env.MYSQLDB_PORT,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_NAME,
};

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql',
        port: dbConfig.port
    }
);

const careerService = new CareerView(sequelize);
const courseService = new CourseView(sequelize);
const professorEventService = new ProfessorEventView(sequelize);
const professorService = new ProfessorView(sequelize);
const termService = new TermView(sequelize);

(async () => {
    await sequelize.sync();

    console.log();

    while (true) {
        console.log('Options:');
        console.log('1. Careers');
        console.log('2. Courses');
        console.log('3. Professors');
        console.log('4. Professor Events');
        console.log('5. Terms');
        console.log('0. Exit');

        const choice = readlineSync.question('Enter your choice: ');

        console.log();

        try {
            switch (choice) {
                case '1':
                    await careerService.runView();
                    break;
                case '2':
                    await courseService.runView();
                    break;
                case '3':
                    await professorService.runView();
                    break;
                case '4':
                    await professorEventService.runView();
                    break;
                case '5':
                    await termService.runView();
                    break;
                case '0':
                    await sequelize.close();
                    return;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        }

        console.log();
    }
})();