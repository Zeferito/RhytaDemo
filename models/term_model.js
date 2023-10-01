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
const { DataTypes } = require('sequelize');

class TermModel {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Term = this.sequelize.define('Term', {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Title must not be null',
                    },
                    notEmpty: {
                        msg: 'Title must not be empty',
                    },
                },
            },
            description: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Start Date must not be null',
                    },
                },
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'End Date must not be null',
                    },
                },
            },
        }, {
            tableName: 'term',
            timestamps: false,
        });
    }

    async getModel() {
        return this.Term;
    }

    async sync() {
        try {
            return await this.sequelize.sync();
        } catch (error) {
            throw new Error(`Failed to synchronize database: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await this.Term.findAll();
        } catch (error) {
            throw new Error(`Failed to retrieve terms: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await this.Term.findByPk(id);
        } catch (error) {
            throw new Error(`Failed to find term by ID: ${error.message}`);
        }
    }

    async create(termData) {
        try {
            return await this.Term.create(termData);
        } catch (error) {
            throw new Error(`Failed to create term: ${error.message}`);
        }
    }

    async update(id, termData) {
        try {
            const [rowCount] = await this.Term.update(termData, {
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Term not found for update');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to update term: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const rowCount = await this.Term.destroy({
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Term not found for deletion');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete term: ${error.message}`);
        }
    }
}

module.exports = TermModel;
