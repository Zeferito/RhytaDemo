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
            return await this.courseModel.Course.findAll();
        } catch (error) {
            throw new Error('Error retrieving courses: ' + error.message);
        }
    }

    async get(id) {
        try {
            return await this.courseModel.Course.findByPk(id);
        } catch (error) {
            throw new Error('Error retrieving course: ' + error.message);
        }
    }

    async insert(data) {
        try {
            return await this.courseModel.Course.create(data);
        } catch (error) {
            throw new Error('Error creating course: ' + error.message);
        }
    }

    async update(id, data) {
        try {
            return await this.courseModel.Course.update(data, {
                where: { id },
            });
        } catch (error) {
            throw new Error('Error updating course: ' + error.message);
        }
    }

    async delete(id) {
        try {
            return await this.courseModel.Course.destroy({
                where: { id },
            });
        } catch (error) {
            throw new Error('Error deleting course: ' + error.message);
        }
    }
}

module.exports = CourseService;
