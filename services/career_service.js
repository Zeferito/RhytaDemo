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

const CourseModel = require('../models/course_model');
const CareerModel = require('../models/career_model');

class CareerService {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.careerModel = new CareerModel(sequelize);
        this.courseModel = new CourseModel(sequelize);

        this.careerModel.Career.hasMany(this.courseModel.Course, { as: 'courses', foreignKey: 'careerId' });
        this.courseModel.Course.belongsTo(this.careerModel.Career, { foreignKey: 'careerId', as: 'career' });
    }

    async retrieveAllCareers() {
        try {
            const careers = await this.careerModel.findAll();

            console.log('All Careers:');

            careers.forEach((career) => {
                console.log(`ID: ${career.id}, Name: ${career.name}`);
            });
        } catch (error) {
            console.error('Error retrieving careers:', error.message);
        }
    }

    async insertCareer(name) {
        try {
            const createdCareer = await this.careerModel.create({ name });

            console.log('Career created successfully. Career Data:');
            console.log(`ID: ${createdCareer.id}, Name: ${createdCareer.name}`);
        } catch (error) {
            console.error('Error creating career:', error.message);
        }
    }

    async updateCareer(id, name) {
        try {
            const updated = await this.careerModel.update(id, { name });

            if (updated) {
                const updatedCareer = await this.careerModel.findById(id);

                console.log('Career updated successfully. Updated Career Data:');
                console.log(`ID: ${updatedCareer.id}, Name: ${updatedCareer.name}`);
            } else {
                console.log('Career not found for update.');
            }
        } catch (error) {
            console.error('Error updating career:', error.message);
        }
    }

    async deleteCareer(id) {
        try {
            await this.careerModel.delete(id);

            console.log('Career deleted successfully.');
        } catch (error) {
            console.error('Error deleting career:', error.message);
        }
    }

    async getCoursesByCareer(careerId) {
        try {
            const courses = await this.careerModel.getCoursesById(careerId);

            console.log('Courses for Career:');

            courses.forEach((course) => {
                console.log(`ID: ${course.id}, Name: ${course.name}, Career ID: ${course.careerId}`);
            });
        } catch (error) {
            console.error('Error retrieving courses for career:', error.message);
        }
    }
}

module.exports = CareerService;
