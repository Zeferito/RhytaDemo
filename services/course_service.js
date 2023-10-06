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

    async retrieveAllCourses() {
        try {
            const courses = await this.courseModel.findAll();
            console.log('All Courses:');
            courses.forEach((course) => {
                console.log(`ID: ${course.id}, Name: ${course.name}, Career ID: ${course.careerId}`);
            });
        } catch (error) {
            console.error('Error retrieving courses:', error.message);
        }
    }

    async insertCourse(name, careerId) {
        try {
            const createdCourse = await this.courseModel.create({ name, careerId });
            console.log('Course created successfully. Course Data:');
            console.log(`ID: ${createdCourse.id}, Name: ${createdCourse.name}, Career ID: ${createdCourse.careerId}`);
        } catch (error) {
            console.error('Error creating course:', error.message);
        }
    }

    async updateCourse(id, name, careerId) {
        try {
            const updated = await this.courseModel.update(id, { name, careerId });
            if (updated) {
                const updatedCourse = await this.courseModel.findById(id);
                console.log('Course updated successfully. Updated Course Data:');
                console.log(`ID: ${updatedCourse.id}, Name: ${updatedCourse.name}, Career ID: ${updatedCourse.careerId}`);
            } else {
                console.log('Course not found for update.');
            }
        } catch (error) {
            console.error('Error updating course:', error.message);
        }
    }

    async deleteCourse(id) {
        try {
            await this.courseModel.delete(id);
            console.log('Course deleted successfully.');
        } catch (error) {
            console.error('Error deleting course:', error.message);
        }
    }

    async setCareerForCourse(courseId, careerId) {
        try {
            const course = await this.courseModel.setCareer(courseId, careerId);
            console.log('Career set for course successfully. Updated Course Data:');
            console.log(`ID: ${course.id}, Name: ${course.name}, Career ID: ${course.careerId}`);
        } catch (error) {
            console.error('Error setting career for course:', error.message);
        }
    }
}

module.exports = CourseService;
