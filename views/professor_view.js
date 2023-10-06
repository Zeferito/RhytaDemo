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
        try {
            while (true) {
                console.log('Options:');
                console.log('1. Retrieve All Professors');
                console.log('2. Insert Professor');
                console.log('3. Update Professor');
                console.log('4. Delete Professor');
                console.log('0. Return');

                const choice = readlineSync.question('Enter your choice: ');

                console.log();

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

                console.log();
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

    async retrieveAllProfessors() {
        await this.professorController.getAll();
    }

    async insertProfessor() {
        const firstName = readlineSync.question('Enter professor first name: ');
        const lastName = readlineSync.question('Enter professor last name: ');

        await this.professorController.insert(firstName, lastName);
    }

    async updateProfessor() {
        const id = readlineSync.question('Enter professor ID to update: ');
        const firstName = readlineSync.question('Enter updated first name: ');
        const lastName = readlineSync.question('Enter updated last name: ');

        await this.professorController.update(id, firstName, lastName);
    }

    async deleteProfessor() {
        const id = readlineSync.question('Enter professor ID to delete: ');

        await this.professorController.delete(id);
    }
}

module.exports = ProfessorView;
