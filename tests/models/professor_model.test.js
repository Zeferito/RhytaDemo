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
const Sequelize = require('sequelize');

const ProfessorModel = require('../../models/professor_model');
const ProfessorEventModel = require('../../models/professor_event_model');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

describe('ProfessorModel', () => {
    let professorModel;
    let professorEventModel;

    beforeAll(async () => {
        professorModel = new ProfessorModel(sequelize);
        professorEventModel = new ProfessorEventModel(sequelize);

        professorModel.Professor.hasMany(professorEventModel.ProfessorEvent, { as: 'events', foreignKey: 'professorId' });
        professorEventModel.ProfessorEvent.belongsTo(professorModel.Professor, { foreignKey: 'professorId', as: 'professor' });

        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await professorModel.Professor.destroy({ where: {} });
    });

    it('should create a Professor and find it by ID', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorModel.create(professorData);

        const foundProfessor = await professorModel.findById(createdProfessor.id);

        expect(foundProfessor).not.toBeNull();
        expect(foundProfessor.firstName).toBe(professorData.firstName);
    });

    it('should return an empty array for findAll when no Professors exist', async () => {
        const professors = await professorModel.findAll();

        expect(professors).toEqual([]);
    });

    it('should update a Professor', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorModel.create(professorData);

        const updatedData = { firstName: 'Updated', lastName: 'Name' };
        await professorModel.update(createdProfessor.id, updatedData);

        const foundProfessor = await professorModel.findById(createdProfessor.id);

        expect(foundProfessor).not.toBeNull();
        expect(foundProfessor.firstName).toBe(updatedData.firstName);
        expect(foundProfessor.lastName).toBe(updatedData.lastName);
    });

    it('should delete a Professor', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorModel.create(professorData);

        await professorModel.delete(createdProfessor.id);

        const foundProfessor = await professorModel.findById(createdProfessor.id);

        expect(foundProfessor).toBeNull();
    });

    it('should return null when trying to find a non-existent Professor by ID', async () => {
        const nonExistentId = 9999;
        const foundProfessor = await professorModel.findById(nonExistentId);
        expect(foundProfessor).toBeNull();
    });

    it('should handle validation errors when creating a Professor with missing required fields', async () => {
        const invalidProfessorData = {
        };

        await expect(professorModel.create(invalidProfessorData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Professor', async () => {
        const nonExistentId = 9999;
        const updatedData = { firstName: 'Updated', lastName: 'Name' };

        await expect(professorModel.update(nonExistentId, updatedData)).rejects.toThrow();
    });

    it('should handle errors when deleting a non-existent Professor', async () => {
        const nonExistentId = 9999;

        await expect(professorModel.delete(nonExistentId)).rejects.toThrow();
    });

    it('should retrieve Professor events by ID', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorModel.create(professorData);

        const event1 = {
            title: 'Event 1',
            startDate: new Date(),
            endDate: new Date(),
            professorId: createdProfessor.id,
        };
        const event2 = {
            title: 'Event 2',
            startDate: new Date(),
            endDate: new Date(),
            professorId: createdProfessor.id,
        };

        await professorEventModel.create(event1);
        await professorEventModel.create(event2);

        const professorEvents = await professorModel.getProfessorEventsById(createdProfessor.id);

        expect(professorEvents).toHaveLength(2);
    });

    it('should retrieve a specific Professor event by ID', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorModel.create(professorData);

        const event1 = {
            title: 'Event 1',
            startDate: new Date(),
            endDate: new Date(),
            professorId: createdProfessor.id,
        };
        const createdEvent = await professorEventModel.create(event1);

        const foundEvent = await professorModel.getEventByIdFromProfessor(createdProfessor.id, createdEvent.id);

        expect(foundEvent).not.toBeNull();
        expect(foundEvent.title).toBe(event1.title);
    });

});