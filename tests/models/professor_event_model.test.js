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

const ProfessorEventModel = require('../../models/professor_event_model');
const ProfessorModel = require('../../models/professor_model');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

describe('ProfessorEventModel', () => {
    let professorEventModel;
    let professorModel;

    beforeAll(async () => {
        professorEventModel = new ProfessorEventModel(sequelize);
        professorModel = new ProfessorModel(sequelize);

        professorEventModel.ProfessorEvent.belongsTo(professorModel.Professor, { foreignKey: 'professorId', as: 'professor' });
        professorModel.Professor.hasMany(professorEventModel.ProfessorEvent, { as: 'events', foreignKey: 'professorId' });

        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await professorEventModel.ProfessorEvent.destroy({ where: {} });
        await professorModel.Professor.destroy({ where: {} });
    });

    it('should create a Professor Event and find it by ID', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorModel.create(professorData);

        const eventData = {
            title: 'Test Event',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        const createdEvent = await professorEventModel.create(eventData);

        const foundEvent = await professorEventModel.findById(createdEvent.id);

        expect(foundEvent).not.toBeNull();
        expect(foundEvent.title).toBe(eventData.title);
    });

    it('should return an empty array for findAll when no Professor Events exist', async () => {
        const events = await professorEventModel.findAll();

        expect(events).toEqual([]);
    });

    it('should update a Professor Event', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorModel.create(professorData);

        const eventData = {
            title: 'Test Event',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        const createdEvent = await professorEventModel.create(eventData);

        const updatedData = { title: 'Updated Event' };
        await professorEventModel.update(createdEvent.id, updatedData);

        const foundEvent = await professorEventModel.findById(createdEvent.id);

        expect(foundEvent).not.toBeNull();
        expect(foundEvent.title).toBe(updatedData.title);
    });

    it('should delete a Professor Event', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorModel.create(professorData);

        const eventData = {
            title: 'Test Event',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        const createdEvent = await professorEventModel.create(eventData);

        await professorEventModel.delete(createdEvent.id);

        const foundEvent = await professorEventModel.findById(createdEvent.id);

        expect(foundEvent).toBeNull();
    });

    it('should return null when trying to find a non-existent Professor Event by ID', async () => {
        const nonExistentId = 9999;
        const foundEvent = await professorEventModel.findById(nonExistentId);
        expect(foundEvent).toBeNull();
    });

    it('should return an empty array for findAll when no Professor Events exist', async () => {
        const events = await professorEventModel.findAll();
        expect(events).toEqual([]);
    });

    it('should return an array of Professor Events for findAll when Professor Events exist', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorModel.create(professorData);

        const eventData1 = {
            title: 'Event 1',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        const eventData2 = {
            title: 'Event 2',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        await professorEventModel.create(eventData1);
        await professorEventModel.create(eventData2);

        const events = await professorEventModel.findAll();

        expect(events).toHaveLength(2);
        expect(events[0].title).toBe(eventData1.title);
        expect(events[1].title).toBe(eventData2.title);
    });

    it('should handle validation errors when creating a Professor Event with missing required fields', async () => {
        const invalidEventData = {
        };

        await expect(professorEventModel.create(invalidEventData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Professor Event', async () => {
        const nonExistentId = 9999;
        const updatedData = { title: 'Updated Event' };

        await expect(professorEventModel.update(nonExistentId, updatedData)).rejects.toThrow();
    });

    it('should handle errors when deleting a non-existent Professor Event', async () => {
        const nonExistentId = 9999;

        await expect(professorEventModel.delete(nonExistentId)).rejects.toThrow();
    });

    it('should set a Professor for a Professor Event', async () => {
        const professorData1 = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor1 = await professorModel.create(professorData1);

        const professorData2 = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor2 = await professorModel.create(professorData2);

        const eventData = {
            title: 'Test Event',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor1.id
        };
        const createdEvent = await professorEventModel.create(eventData);

        const updatedEvent = await professorEventModel.setProfessor(createdEvent.id, professor2.id);

        expect(updatedEvent).not.toBeNull();
        expect(updatedEvent.professorId).toBe(professor2.id);
    });

    it('should handle errors when setting a Professor for a non-existent Professor Event', async () => {
        const nonExistentEventId = 9999;
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorModel.create(professorData);

        await expect(professorEventModel.setProfessor(nonExistentEventId, professor.id)).rejects.toThrow();
    });

});
