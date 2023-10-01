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

class CareerModel {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Career = this.sequelize.define('Career', {
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
        }, {
            tableName: 'career',
            timestamps: false,
        });
    }

    async findAll() {
        try {
            return await this.Career.findAll();
        } catch (error) {
            throw new Error(`Failed to retrieve careers: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await this.Career.findByPk(id);
        } catch (error) {
            throw new Error(`Failed to find career by ID: ${error.message}`);
        }
    }

    async create(careerData) {
        try {
            return await this.Career.create(careerData);
        } catch (error) {
            throw new Error(`Failed to create career: ${error.message}`);
        }
    }

    async update(id, careerData) {
        try {
            const [rowCount] = await this.Career.update(careerData, {
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Career not found for update');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to update career: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const rowCount = await this.Career.destroy({
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Career not found for deletion');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete career: ${error.message}`);
        }
    }

    async getCoursesById(careerId) {
        try {
            const career = await this.Career.findByPk(careerId, {
                include: 'courses',
            });

            return career ? career.courses : [];
        } catch (error) {
            throw new Error(`Failed to retrieve courses for career: ${error.message}`);
        }
    }

}

module.exports = CareerModel;
