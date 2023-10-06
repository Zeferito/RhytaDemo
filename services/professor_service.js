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

const ProfessorModel = require('../models/professor_model');
const ProfessorEventModel = require('../models/professor_event_model');

class ProfessorService {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.professorModel = new ProfessorModel(sequelize);
        this.professorEventModel = new ProfessorEventModel(sequelize);

        this.professorModel.Professor.hasMany(this.professorEventModel.ProfessorEvent, {
            as: 'events',
            foreignKey: 'professorId'
        });
        this.professorEventModel.ProfessorEvent.belongsTo(this.professorModel.Professor, {
            foreignKey: 'professorId',
            as: 'professor'
        });
    }

    async retrieveAllProfessors() {
        try {
            const professors = await this.professorModel.findAll();

            console.log('All Professors:');

            professors.forEach((professor) => {
                console.log(`ID: ${professor.id}, Name: ${professor.firstName} ${professor.lastName}`);
            });
        } catch (error) {
            console.error('Error retrieving professors:', error.message);
        }
    }

    async insertProfessor(firstName, lastName) {
        try {
            const createdProfessor = await this.professorModel.create({ firstName, lastName });

            console.log('Professor created successfully. Professor Data:');
            console.log(`ID: ${createdProfessor.id}, Name: ${createdProfessor.firstName} ${createdProfessor.lastName}`);
        } catch (error) {
            console.error('Error creating professor:', error.message);
        }
    }

    async updateProfessor(id, firstName, lastName) {
        try {
            const updated = await this.professorModel.update(id, { firstName, lastName });

            if (updated) {
                const updatedProfessor = await this.professorModel.findById(id);

                console.log('Professor updated successfully. Updated Professor Data:');
                console.log(`ID: ${updatedProfessor.id}, Name: ${updatedProfessor.firstName} ${updatedProfessor.lastName}`);
            } else {
                console.log('Professor not found for update.');
            }
        } catch (error) {
            console.error('Error updating professor:', error.message);
        }
    }

    async deleteProfessor(id) {
        try {
            await this.professorModel.delete(id);

            console.log('Professor deleted successfully.');
        } catch (error) {
            console.error('Error deleting professor:', error.message);
        }
    }
}

module.exports = ProfessorService;
