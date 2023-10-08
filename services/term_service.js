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
            return await this.termModel.Term.findAll();
        } catch (error) {
            throw new Error('Error retrieving terms: ' + error.message);
        }
    }

    async get(id) {
        try {
            return await this.termModel.Term.findByPk(id);
        } catch (error) {
            throw new Error('Error retrieving term: ' + error.message);
        }
    }

    async insert(data) {
        try {
            return await this.termModel.Term.create(data);
        } catch (error) {
            throw new Error('Error creating term: ' + error.message);
        }
    }

    async update(id, data) {
        try {
            return await this.termModel.Term.update(data, {
                where: { id },
            });
        } catch (error) {
            throw new Error('Error updating term: ' + error.message);
        }
    }

    async delete(id) {
        try {
            return await this.termModel.Term.destroy({
                where: { id },
            });
        } catch (error) {
            throw new Error('Error deleting term: ' + error.message);
        }
    }
}

module.exports = TermService;
