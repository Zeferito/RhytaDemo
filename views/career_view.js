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
const readlineSync = require('readline-sync');

const CourseService = require('../services/course_service');
const CareerService = require('../services/career_service');

class CareerView {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.careerService = new CareerService(sequelize);
        this.courseService = new CourseService(sequelize);
    }

    async runView() {
        try {
            while (true) {
                console.log('Options:');
                console.log('1. Retrieve All Careers');
                console.log('2. Insert Career');
                console.log('3. Update Career');
                console.log('4. Delete Career');
                console.log('5. Get Courses by Career');
                console.log('0. Exit');

                const choice = readlineSync.question('Enter your choice: ');

                console.log();

                switch (choice) {
                    case '1':
                        await this.retrieveAllCareers();
                        break;
                    case '2':
                        await this.insertCareer();
                        break;
                    case '3':
                        await this.updateCareer();
                        break;
                    case '4':
                        await this.deleteCareer();
                        break;
                    case '5':
                        await this.getCoursesByCareer();
                        break;
                    case '0':
                        return;
                    default:
                        console.log('Invalid choice. Please try again.');
                }

                console.log();
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

    async retrieveAllCareers() {
        await this.careerService.retrieveAllCareers();
    }

    async insertCareer() {
        const name = readlineSync.question('Enter career name: ');

        await this.careerService.insertCareer(name);
    }

    async updateCareer() {
        const id = readlineSync.question('Enter career ID to update: ');
        const name = readlineSync.question('Enter updated career name: ');

        await this.careerService.updateCareer(id, name);
    }

    async deleteCareer() {
        const id = readlineSync.question('Enter career ID to delete: ');

        await this.careerService.deleteCareer(id);
    }

    async getCoursesByCareer() {
        const careerId = readlineSync.question('Enter career ID: ');

        await this.careerService.getCoursesByCareer(careerId);
    }
}

module.exports = CareerView;
