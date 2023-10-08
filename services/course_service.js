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

class CourseService {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.courseModel = new CourseModel(sequelize);
        this.careerModel = new CareerModel(sequelize);

        this.careerModel.Career.hasMany(this.courseModel.Course, { as: 'courses', foreignKey: 'careerId' });
        this.courseModel.Course.belongsTo(this.careerModel.Career, { foreignKey: 'careerId', as: 'career' });
    }

    async getAll() {
        try {
            const courses = await this.courseModel.Course.findAll();

            console.log('All Courses:');
            courses.forEach((course) => {
                console.log(`ID: ${course.id}, Name: ${course.name}, Career ID: ${course.careerId}`);
            });

            return courses;
        } catch (error) {
            throw new Error('Error retrieving courses: ' + error.message);
        }
    }

    async get(id) {
        try {
            const course = await this.courseModel.Course.findByPk(id);

            console.log('Course Data:');
            console.log(`ID: ${course.id}, Name: ${course.name}, Career ID: ${course.careerId}`);

            return course;
        } catch (error) {
            throw new Error('Error retrieving course: ' + error.message);
        }
    }

    async insert(data) {
        try {
            const createdCourse = await this.courseModel.Course.create(data);

            console.log('Course created successfully. Course Data:');
            console.log(`ID: ${createdCourse.id}, Name: ${createdCourse.name}, Career ID: ${createdCourse.careerId}`);

            return createdCourse;
        } catch (error) {
            throw new Error('Error creating course: ' + error.message);
        }
    }

    async update(id, data) {
        try {
            const rowCount = await this.courseModel.Course.update(data, {
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Course not found for update');
            }

            const updatedCourse = await this.courseModel.Course.findByPk(id);

            console.log('Course updated successfully. Updated Course Data:');
            console.log(`ID: ${updatedCourse.id}, Name: ${updatedCourse.name}, Career ID: ${updatedCourse.careerId}`);

            return updatedCourse;
        } catch (error) {
            throw new Error('Error updating course: ' + error.message);
        }
    }

    async delete(id) {
        try {
            const rowCount = await this.courseModel.Course.destroy({
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Course not found for deletion');
            }

            console.log('Course deleted successfully.');
        } catch (error) {
            throw new Error('Error deleting course: ' + error.message);
        }
    }
}

module.exports = CourseService;
