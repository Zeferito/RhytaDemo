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

const CourseController = require('../controllers/course_controller');

class CourseView {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.courseController = new CourseController(sequelize);
    }

    async runView() {
        try {
            while (true) {
                console.log('Options:');
                console.log('1. Retrieve All Courses');
                console.log('2. Insert Course');
                console.log('3. Update Course');
                console.log('4. Delete Course');
                console.log('5. Set Career for Course');
                console.log('0. Return');

                const choice = readlineSync.question('Enter your choice: ');

                console.log();

                switch (choice) {
                    case '1':
                        await this.retrieveAllCourses();
                        break;
                    case '2':
                        await this.insertCourse();
                        break;
                    case '3':
                        await this.updateCourse();
                        break;
                    case '4':
                        await this.deleteCourse();
                        break;
                    case '5':
                        await this.setCareerForCourse();
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

    async retrieveAllCourses() {
        await this.courseController.getAll();
    }

    async insertCourse() {
        const name = readlineSync.question('Enter course name: ');
        const careerId = readlineSync.question('Enter career ID: ');

        await this.courseController.insert(name, careerId);
    }

    async updateCourse() {
        const id = readlineSync.question('Enter course ID to update: ');
        const name = readlineSync.question('Enter updated course name: ');
        const careerId = readlineSync.question('Enter updated career ID: ');

        await this.courseController.update(id, name, careerId);
    }

    async deleteCourse() {
        const id = readlineSync.question('Enter course ID to delete: ');

        await this.courseController.delete(id);
    }

    async setCareerForCourse() {
        const courseId = readlineSync.question('Enter course ID: ');
        const careerId = readlineSync.question('Enter career ID: ');

        await this.courseController.setCareer(courseId, careerId);
    }
}

module.exports = CourseView;
