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

class ProfessorModel {
    constructor(sequelize) {
        this.sequelize = sequelize;

        this.Professor = this.sequelize.define('Professor', {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'First name must not be null',
                    },
                    notEmpty: {
                        msg: 'First name must not be empty',
                    },
                },
            },
            lastName: {
                type: DataTypes.STRING,
            },
        }, {
            tableName: 'professor',
            timestamps: false,
        });
    }

    async findAll() {
        try {
            return await this.Professor.findAll();
        } catch (error) {
            throw new Error(`Failed to retrieve professors: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await this.Professor.findByPk(id);
        } catch (error) {
            throw new Error(`Failed to find professor by ID: ${error.message}`);
        }
    }

    async create(professorData) {
        try {
            return await this.Professor.create(professorData);
        } catch (error) {
            throw new Error(`Failed to create professor: ${error.message}`);
        }
    }

    async update(id, professorData) {
        try {
            const [rowCount] = await this.Professor.update(professorData, {
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Professor not found for update');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to update professor: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const rowCount = await this.Professor.destroy({
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Professor not found for deletion');
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to delete professor: ${error.message}`);
        }
    }

    async getProfessorEventsById(professorId) {
        try {
            const professor = await this.Professor.findByPk(professorId, {
                include: 'events',
            });

            return professor ? professor.events : [];
        } catch (error) {
            throw new Error(`Failed to retrieve professor events: ${error.message}`);
        }
    }

    async getEventByIdFromProfessor(professorId, eventId) {
        try {
            const professor = await this.Professor.findByPk(professorId);

            if (!professor) {
                return null;
            }

            const event = await professor.getEvents({
                where: { id: eventId },
                limit: 1,
            });

            return event[0] || null;
        } catch (error) {
            throw new Error(`Failed to retrieve professor event: ${error.message}`);
        }
    }

}

module.exports = ProfessorModel;
