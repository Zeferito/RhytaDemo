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

class ProfessorEventModel {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.ProfessorEvent = this.sequelize.define('ProfessorEvent', {
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
            professorId: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
        }, {
            tableName: 'professor_event',
            timestamps: false,
        });
    }

    async getModel() {
        return this.ProfessorEvent;
    }

    async findAll() {
        try {
            return await this.ProfessorEvent.findAll();
        } catch (error) {
            throw new Error(`Failed to retrieve professor events: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await this.ProfessorEvent.findByPk(id);
        } catch (error) {
            throw new Error(`Failed to find professor event by ID: ${error.message}`);
        }
    }

    async create(eventData) {
        try {
            return await this.ProfessorEvent.create(eventData);
        } catch (error) {
            throw new Error(`Failed to create professor event: ${error.message}`);
        }
    }

    async update(id, eventData) {
        try {
            const [rowCount] = await this.ProfessorEvent.update(eventData, {
                where: id,
            });

            if (rowCount === 0) {
                throw new Error('Professor event not found for update');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to update professor event: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const rowCount = await this.ProfessorEvent.destroy({
                where: id,
            });

            if (rowCount === 0) {
                throw new Error('Professor event not found for deletion');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete professor event: ${error.message}`);
        }
    }

    async setProfessor(eventId, professorId) {
        try {
            const event = await this.ProfessorEvent.findByPk(eventId);

            if (event) {
                event.professorId = professorId;
                await event.save();

                return event;
            } else {
                throw new Error('Professor event not found');
            }
        } catch (error) {
            throw new Error(`Failed to set professor for event: ${error.message}`);
        }
    }
}

module.exports = ProfessorEventModel;
