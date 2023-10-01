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
const DataTypes = require('sequelize');

class CourseModel {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Course = this.sequelize.define('Course', {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Name must not be null',
                    },
                    notEmpty: {
                        msg: 'Name must not be empty',
                    },
                },
            },
            description: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            careerId: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
        }, {
            tableName: 'course',
            timestamps: false,
        });
    }

    async getModel() {
        return this.Course;
    }

    async findAll() {
        try {
            return await this.Course.findAll();
        } catch (error) {
            throw new Error(`Failed to retrieve courses: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await this.Course.findByPk(id);
        } catch (error) {
            throw new Error(`Failed to find course by ID: ${error.message}`);
        }
    }

    async create(courseData) {
        try {
            return await this.Course.create(courseData);
        } catch (error) {
            throw new Error(`Failed to create course: ${error.message}`);
        }
    }

    async update(id, courseData) {
        try {
            const [rowCount] = await this.Course.update(courseData, {
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Course not found for update');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to update course: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const rowCount = await this.Course.destroy({
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Course not found for deletion');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete course: ${error.message}`);
        }
    }

    async setCareer(courseId, careerId) {
        try {
            const course = await this.Course.findByPk(courseId);

            if (course) {
                course.careerId = careerId;
                await course.save();

                return course;
            } else {
                throw new Error('Course not found');
            }
        } catch (error) {
            throw new Error(`Failed to set career for course: ${error.message}`);
        }
    }
}

module.exports = CourseModel;
