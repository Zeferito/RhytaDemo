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

const ProfessorEventService = require('../services/professor_event_service');

class ProfessorEventController {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.professorEventService = new ProfessorEventService(sequelize);
    }

    async getAll() {
        return await this.professorEventService.getAll();
    }

    async get(id) {
        return await this.professorEventService.get(id);
    }

    async insert(title, startDate, endDate, professorId) {
        return await this.professorEventService.insert(title, startDate, endDate, professorId);
    }

    async update(id, title, startDate, endDate, professorId) {
        return await this.professorEventService.update(id, title, startDate, endDate, professorId);
    }

    async delete(id) {
        return await this.professorEventService.delete(id);
    }
}

module.exports = ProfessorEventController;
