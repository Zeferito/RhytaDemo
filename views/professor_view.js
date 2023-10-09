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

const ProfessorController = require('../controllers/professor_controller');

class ProfessorView {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.professorController = new ProfessorController(sequelize);
    }

    async runView() {
        while (true) {
            console.log('Options:');
            console.log('1. Retrieve All Professors');
            console.log('2. Insert Professor');
            console.log('3. Update Professor');
            console.log('4. Delete Professor');
            console.log('0. Return');

            const choice = readlineSync.question('Enter your choice: ');

            console.log();

            try {
                switch (choice) {
                    case '1':
                        await this.retrieveAllProfessors();
                        break;
                    case '2':
                        await this.insertProfessor();
                        break;
                    case '3':
                        await this.updateProfessor();
                        break;
                    case '4':
                        await this.deleteProfessor();
                        break;
                    case '0':
                        return;
                    default:
                        console.log('Invalid choice. Please try again.');
                }
            } catch (error) {
                console.error('An error occurred:', error.message);
            }

            console.log();
        }
    }

    async retrieveAllProfessors() {
        const professors = await this.professorController.getAll();

        console.log('All Professors:');
        professors.forEach((professor) => {
            console.log(`ID: ${professor.id}, Name: ${professor.firstName} ${professor.lastName}`);
        });
    }

    async insertProfessor() {
        const firstName = readlineSync.question('Enter professor first name: ');
        const lastName = readlineSync.question('Enter professor last name: ');

        const createdProfessor = await this.professorController.insert(firstName, lastName);

        console.log('Professor created successfully. Professor Data:');
        console.log(`ID: ${createdProfessor.id}, Name: ${createdProfessor.firstName} ${createdProfessor.lastName}`);
    }

    async updateProfessor() {
        const id = readlineSync.question('Enter professor ID to update: ');
        const firstName = readlineSync.question('Enter updated first name: ');
        const lastName = readlineSync.question('Enter updated last name: ');

        const rowCount = await this.professorController.update(id, firstName, lastName);

        if (rowCount === 0) {
            throw new Error('Professor not found for update');
        }

        const updatedProfessor = await this.professorController.get(id);

        console.log('Professor updated successfully. Updated Professor Data:');
        console.log(`ID: ${updatedProfessor.id}, Name: ${updatedProfessor.firstName} ${updatedProfessor.lastName}`);
    }

    async deleteProfessor() {
        const id = readlineSync.question('Enter professor ID to delete: ');

        const rowCount = await this.professorController.delete(id);

        if (rowCount === 0) {
            throw new Error('Professor not found for deletion');
        } else {
            console.log('Professor deleted successfully.');
        }
    }
}

module.exports = ProfessorView;
