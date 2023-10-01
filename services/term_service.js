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

const TermModel = require('../models/term_model');

class TermService {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.termModel = new TermModel(sequelize);
    }

    async runService() {
        try {
            while (true) {
                console.log('Options:');
                console.log('1. Retrieve All Terms');
                console.log('2. Insert Term');
                console.log('3. Update Term');
                console.log('4. Delete Term');
                console.log('0. Exit');

                const choice = readlineSync.question('Enter your choice: ');

                console.log();

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

                console.log();
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

    async retrieveAllTerms() {
        try {
            const terms = await this.termModel.findAll();

            console.log('All Terms:');

            terms.forEach((term) => {
                console.log(`ID: ${term.id}, Title: ${term.title}, Start Date: ${term.startDate}, End Date: ${term.endDate}`);
            });
        } catch (error) {
            console.error('Error retrieving terms:', error.message);
        }
    }

    async insertTerm() {
        const title = readlineSync.question('Enter term title: ');
        const startDate = readlineSync.question('Enter start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter end date (YYYY-MM-DD): ');

        try {
            const createdTerm = await this.termModel.create({ title, startDate, endDate });

            console.log('Term created successfully. Term Data:');
            console.log(`ID: ${createdTerm.id}, Title: ${createdTerm.title}, Start Date: ${createdTerm.startDate}, End Date: ${createdTerm.endDate}`);
        } catch (error) {
            console.error('Error creating term:', error.message);
        }
    }

    async updateTerm() {
        const id = readlineSync.question('Enter term ID to update: ');
        const title = readlineSync.question('Enter updated term title: ');
        const startDate = readlineSync.question('Enter updated start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter updated end date (YYYY-MM-DD): ');

        try {
            const updated = await this.termModel.update(id, { title, startDate, endDate });

            if (updated) {
                const updatedTerm = await this.termModel.findById(id);

                console.log('Term updated successfully. Updated Term Data:');
                console.log(`ID: ${updatedTerm.id}, Title: ${updatedTerm.title}, Start Date: ${updatedTerm.startDate}, End Date: ${updatedTerm.endDate}`);
            } else {
                console.log('Term not found for update.');
            }
        } catch (error) {
            console.error('Error updating term:', error.message);
        }
    }

    async deleteTerm() {
        const id = readlineSync.question('Enter term ID to delete: ');

        try {
            await this.termModel.delete(id);

            console.log('Term deleted successfully.');
        } catch (error) {
            console.error('Error deleting term:', error.message);
        }
    }
}

module.exports = TermService;
