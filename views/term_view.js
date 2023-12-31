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

const TermController = require('../controllers/term_controller');

class TermView {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.termController = new TermController(sequelize);
    }

    async runView() {
        while (true) {
            console.log('Options:');
            console.log('1. Retrieve All Terms');
            console.log('2. Insert Term');
            console.log('3. Update Term');
            console.log('4. Delete Term');
            console.log('0. Return');

            const choice = readlineSync.question('Enter your choice: ');

            console.log();

            try {
                switch (choice) {
                    case '1':
                        await this.retrieveAllTerms();
                        break;
                    case '2':
                        await this.insertTerm();
                        break;
                    case '3':
                        await this.updateTerm();
                        break;
                    case '4':
                        await this.deleteTerm();
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

    async retrieveAllTerms() {
        const terms = await this.termController.getAll();

        console.log('All Terms:');
        terms.forEach((term) => {
            console.log(`ID: ${term.id}, Title: ${term.title}, Start Date: ${term.startDate}, End Date: ${term.endDate}`);
        });
    }

    async insertTerm() {
        const title = readlineSync.question('Enter term title: ');
        const startDate = readlineSync.question('Enter start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter end date (YYYY-MM-DD): ');

        const createdTerm = await this.termController.insert(title, startDate, endDate);

        console.log('Term created successfully. Term Data:');
        console.log(`ID: ${createdTerm.id}, Title: ${createdTerm.title}, Start Date: ${createdTerm.startDate}, End Date: ${createdTerm.endDate}`);
    }

    async updateTerm() {
        const id = readlineSync.question('Enter term ID to update: ');
        const title = readlineSync.question('Enter updated term title: ');
        const startDate = readlineSync.question('Enter updated start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter updated end date (YYYY-MM-DD): ');

        const rowCount = await this.termController.update(id, title, startDate, endDate);

        if (rowCount === 0) {
            throw new Error('Term not found for update');
        }

        const updatedTerm = await this.termController.get(id);

        console.log('Term updated successfully. Updated Term Data:');
        console.log(`ID: ${updatedTerm.id}, Title: ${updatedTerm.title}, Start Date: ${updatedTerm.startDate}, End Date: ${updatedTerm.endDate}`);
    }

    async deleteTerm() {
        const id = readlineSync.question('Enter term ID to delete: ');

        const rowCount = await this.termController.delete(id);

        if (rowCount === 0) {
            throw new Error('Term not found for deletion');
        } else {
            console.log('Term deleted successfully.');
        }
    }
}

module.exports = TermView;
