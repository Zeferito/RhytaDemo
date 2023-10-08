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

const ProfessorEventService = require('../../services/professor_event_service');
const ProfessorService = require('../../services/professor_service');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

describe('ProfessorEventService', () => {
    let professorEventService;
    let professorService;

    beforeAll(async () => {
        professorEventService = new ProfessorEventService(sequelize);
        professorService = new ProfessorService(sequelize);
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await professorEventService.professorEventModel.ProfessorEvent.destroy({ where: {} });
        await professorService.professorModel.Professor.destroy({ where: {} });
    });

    it('should create a Professor Event and find it by ID', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorService.insert(professorData);

        const eventData = {
            title: 'Test Event',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        const createdEvent = await professorEventService.insert(eventData);

        const foundEvent = await professorEventService.get(createdEvent.id);

        expect(foundEvent).not.toBeNull();
        expect(foundEvent.title).toBe(eventData.title);
    });

    it('should return an empty array for getAll when no Professor Events exist', async () => {
        const events = await professorEventService.getAll();

        expect(events).toEqual([]);
    });

    it('should update a Professor Event', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorService.insert(professorData);

        const eventData = {
            title: 'Test Event',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        const createdEvent = await professorEventService.insert(eventData);

        const updatedData = { title: 'Updated Event' };
        await professorEventService.update(createdEvent.id, updatedData);

        const foundEvent = await professorEventService.get(createdEvent.id);

        expect(foundEvent).not.toBeNull();
        expect(foundEvent.title).toBe(updatedData.title);
    });

    it('should delete a Professor Event', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorService.insert(professorData);

        const eventData = {
            title: 'Test Event',
            startDate: new Date(),
            endDate: new Date(),
            professorId: professor.id,
        };
        const createdEvent = await professorEventService.insert(eventData);

        await professorEventService.delete(createdEvent.id);

        expect(professorEventService.get(createdEvent.id)).rejects.toThrow();
    });

    it('should handle errors when trying to find a non-existent Professor Event by ID', async () => {
        const nonExistentId = 9999;
        expect(professorEventService.get(nonExistentId)).rejects.toThrow();
    });

    it('should return an empty array for getAll when no Professor Events exist', async () => {
        const events = await professorEventService.getAll();
        expect(events).toEqual([]);
    });

    it('should return an array of Professor Events for getAll when Professor Events exist', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const professor = await professorService.insert(professorData);

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
        await professorEventService.insert(eventData1);
        await professorEventService.insert(eventData2);

        const events = await professorEventService.getAll();

        expect(events).toHaveLength(2);
        expect(events[0].title).toBe(eventData1.title);
        expect(events[1].title).toBe(eventData2.title);
    });

    it('should handle validation errors when creating a Professor Event with missing required fields', async () => {
        const invalidEventData = {};

        await expect(professorEventService.insert(invalidEventData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Professor Event', async () => {
        const nonExistentId = 9999;
        const updatedData = { title: 'Updated Event' };

        await expect(professorEventService.update(nonExistentId, updatedData)).rejects.toThrow();
    });

    it('should handle errors when deleting a non-existent Professor Event', async () => {
        const nonExistentId = 9999;

        await expect(professorEventService.delete(nonExistentId)).rejects.toThrow();
    });
});
