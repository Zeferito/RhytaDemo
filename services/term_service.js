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

    async getAll() {
        try {
            const terms = await this.termModel.Term.findAll();

            console.log('All Terms:');
            terms.forEach((term) => {
                console.log(`ID: ${term.id}, Title: ${term.title}, Start Date: ${term.startDate}, End Date: ${term.endDate}`);
            });

            return terms;
        } catch (error) {
            throw new Error('Error retrieving terms: ' + error.message);
        }
    }

    async get(id) {
        try {
            const term = await this.termModel.Term.findByPk(id);

            console.log('Term Data:');
            console.log(`ID: ${term.id}, Title: ${term.title}, Start Date: ${term.startDate}, End Date: ${term.endDate}`);

            return term;
        } catch (error) {
            throw new Error('Error retrieving term: ' + error.message);
        }
    }

    async insert(data) {
        try {
            const createdTerm = await this.termModel.Term.create(data);

            console.log('Term created successfully. Term Data:');
            console.log(`ID: ${createdTerm.id}, Title: ${createdTerm.title}, Start Date: ${createdTerm.startDate}, End Date: ${createdTerm.endDate}`);

            return createdTerm;
        } catch (error) {
            throw new Error('Error creating term: ' + error.message);
        }
    }

    async update(id, data) {
        try {
            const rowCount = await this.termModel.Term.update(data, {
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Term not found for update');
            }

            const updatedTerm = await this.termModel.Term.findByPk(id);

            console.log('Term updated successfully. Updated Term Data:');
            console.log(`ID: ${updatedTerm.id}, Title: ${updatedTerm.title}, Start Date: ${updatedTerm.startDate}, End Date: ${updatedTerm.endDate}`);

            return updatedTerm;
        } catch (error) {
            throw new Error('Error updating term: ' + error.message);
        }
    }

    async delete(id) {
        try {
            const rowCount = await this.termModel.Term.destroy({
                where: { id },
            });

            if (rowCount === 0) {
                throw new Error('Term not found for deletion');
            }

            console.log('Term deleted successfully.');
        } catch (error) {
            throw new Error('Error deleting term: ' + error.message);
        }
    }
}

module.exports = TermService;
