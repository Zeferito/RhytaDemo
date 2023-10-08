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

const CareerService = require('../../services/career_service');
const CourseService = require('../../services/course_service');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

describe('CareerService', () => {
    let careerService;
    let courseService;

    beforeAll(async () => {
        careerService = new CareerService(sequelize);
        courseService = new CourseService(sequelize);
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await careerService.careerModel.Career.destroy({ where: {} });
    });

    it('should create a Career and find it by ID', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerService.insert(careerData);

        const foundCareer = await careerService.get(createdCareer.id);

        expect(foundCareer).not.toBeNull();
        expect(foundCareer.name).toBe(careerData.name);
    });

    it('should return an empty array for getAll when no Careers exist', async () => {
        const careers = await careerService.getAll();

        expect(careers).toEqual([]);
    });

    it('should update a Career', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerService.insert(careerData);

        const updatedData = { name: 'Updated Career' };
        await careerService.update(createdCareer.id, updatedData);

        const foundCareer = await careerService.get(createdCareer.id);

        expect(foundCareer).not.toBeNull();
        expect(foundCareer.name).toBe(updatedData.name);
    });

    it('should delete a Career', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerService.insert(careerData);

        const rowCount = await careerService.delete(createdCareer.id);
        expect(rowCount === 0).toBeFalsy();
    });

    it('should return null when trying to find a non-existent Career by ID', async () => {
        const nonExistentId = 9999;
        const nonExistentCareer = await careerService.get(nonExistentId);
        expect(nonExistentCareer).toBeNull();
    });

    it('should return an empty array for getAll when no Careers exist', async () => {
        const careers = await careerService.getAll();
        expect(careers).toEqual([]);
    });

    it('should handle validation errors when creating a Career with missing required fields', async () => {
        const invalidCareerData = {};

        await expect(careerService.insert(invalidCareerData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Career', async () => {
        const nonExistentId = 9999;
        const updatedData = { name: 'Updated Career' };

        const rowCount = await careerService.update(nonExistentId, updatedData);
        expect(rowCount == 0).toBeTruthy();
    });

    it('should handle errors when deleting a non-existent Career', async () => {
        const nonExistentId = 9999;

        const rowCount = await careerService.delete(nonExistentId);
        expect(rowCount).toBe(0);
    });
});
