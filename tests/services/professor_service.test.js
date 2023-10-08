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

const ProfessorService = require('../../services/professor_service');
const ProfessorEventService = require('../../services/professor_event_service');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

describe('ProfessorService', () => {
    let professorService;
    let professorEventService;

    beforeAll(async () => {
        professorService = new ProfessorService(sequelize);
        professorEventService = new ProfessorEventService(sequelize);
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await professorService.professorModel.Professor.destroy({ where: {} });
    });

    it('should create a Professor and find it by ID', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorService.insert(professorData);

        const foundProfessor = await professorService.get(createdProfessor.id);

        expect(foundProfessor).not.toBeNull();
        expect(foundProfessor.firstName).toBe(professorData.firstName);
    });

    it('should return an empty array for getAll when no Professors exist', async () => {
        const professors = await professorService.getAll();

        expect(professors).toEqual([]);
    });

    it('should update a Professor', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorService.insert(professorData);

        const updatedData = { firstName: 'Updated', lastName: 'Name' };
        await professorService.update(createdProfessor.id, updatedData);

        const foundProfessor = await professorService.get(createdProfessor.id);

        expect(foundProfessor).not.toBeNull();
        expect(foundProfessor.firstName).toBe(updatedData.firstName);
        expect(foundProfessor.lastName).toBe(updatedData.lastName);
    });

    it('should delete a Professor', async () => {
        const professorData = {
            firstName: 'John',
            lastName: 'Doe',
        };
        const createdProfessor = await professorService.insert(professorData);

        const rowCount = await professorService.delete(createdProfessor.id);
        expect(rowCount === 0).toBeFalsy();
    });

    it('should handle errors when trying to find a non-existent Professor by ID', async () => {
        const nonExistentId = 9999;
        const nonExistentProfessor = await professorService.get(nonExistentId);
        expect(nonExistentProfessor).toBeNull();
    });

    it('should handle validation errors when creating a Professor with missing required fields', async () => {
        const invalidProfessorData = {};

        await expect(professorService.insert(invalidProfessorData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Professor', async () => {
        const nonExistentId = 9999;
        const updatedData = { firstName: 'Updated', lastName: 'Name' };

        const rowCount = await professorService.update(nonExistentId, updatedData);
        expect(rowCount == 0).toBeTruthy();
    });

    it('should handle errors when deleting a non-existent Professor', async () => {
        const nonExistentId = 9999;

        const rowCount = await professorService.delete(nonExistentId);
        expect(rowCount).toBe(0);
    });
});