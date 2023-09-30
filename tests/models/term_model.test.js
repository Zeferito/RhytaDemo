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

const TermModel = require('../../models/term_model');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

describe('TermModel', () => {
    let termModel;

    beforeAll(async () => {
        termModel = new TermModel(sequelize);

        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await termModel.Term.destroy({ where: {} });
    });

    it('should create a Term and find it by ID', async () => {
        const termData = {
            title: 'Test Term',
            startDate: new Date(),
            endDate: new Date(),
        };
        const createdTerm = await termModel.create(termData);

        const foundTerm = await termModel.findById(createdTerm.id);

        expect(foundTerm).not.toBeNull();
        expect(foundTerm.title).toBe(termData.title);
    });

    it('should return an empty array for findAll when no Terms exist', async () => {
        const terms = await termModel.findAll();

        expect(terms).toEqual([]);
    });

    it('should update a Term', async () => {
        const termData = {
            title: 'Test Term',
            startDate: new Date(),
            endDate: new Date(),
        };
        const createdTerm = await termModel.create(termData);

        const updatedData = { title: 'Updated Term' };
        await termModel.update(createdTerm.id, updatedData);

        const foundTerm = await termModel.findById(createdTerm.id);

        expect(foundTerm).not.toBeNull();
        expect(foundTerm.title).toBe(updatedData.title);
    });

    it('should delete a Term', async () => {
        const termData = {
            title: 'Test Term',
            startDate: new Date(),
            endDate: new Date(),
        };
        const createdTerm = await termModel.create(termData);

        await termModel.delete(createdTerm.id);

        const foundTerm = await termModel.findById(createdTerm.id);

        expect(foundTerm).toBeNull();
    });


    it('should return null when trying to find a non-existent Term by ID', async () => {
        const nonExistentId = 9999;
        const foundTerm = await termModel.findById(nonExistentId);
        expect(foundTerm).toBeNull();
    });

    it('should return an empty array for findAll when no Terms exist', async () => {
        const terms = await termModel.findAll();
        expect(terms).toEqual([]);
    });

    it('should return an array of Terms for findAll when Terms exist', async () => {
        const termData1 = {
            title: 'Term 1',
            startDate: new Date(),
            endDate: new Date(),
        };
        const termData2 = {
            title: 'Term 2',
            startDate: new Date(),
            endDate: new Date(),
        };
        await termModel.create(termData1);
        await termModel.create(termData2);

        const terms = await termModel.findAll();

        expect(terms).toHaveLength(2);
        expect(terms[0].title).toBe(termData1.title);
        expect(terms[1].title).toBe(termData2.title);
    });

    it('should handle validation errors when creating a Term with missing required fields', async () => {
        const invalidTermData = {
        };

        await expect(termModel.create(invalidTermData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Term', async () => {
        const nonExistentId = 9999;
        const updatedData = { title: 'Updated Term' };

        await expect(termModel.update(nonExistentId, updatedData)).rejects.toThrow();
    });

    it('should handle errors when deleting a non-existent Term', async () => {
        const nonExistentId = 9999;

        await expect(termModel.delete(nonExistentId)).rejects.toThrow();
    });

    it('should create a Term and find it by ID with correct attributes', async () => {
        const termData = {
            title: 'Test Term',
            startDate: new Date(),
            endDate: new Date(),
        };

        const createdTerm = await termModel.create(termData);

        const foundTerm = await termModel.findById(createdTerm.id);

        expect(foundTerm).not.toBeNull();
        expect(foundTerm.title).toBe(termData.title);
        expect(foundTerm.startDate.toISOString()).toBe(termData.startDate.toISOString());
        expect(foundTerm.endDate.toISOString()).toBe(termData.endDate.toISOString());
    });

    it('should handle errors when updating a Term with invalid data', async () => {
        const termData = {
            title: 'Test Term',
            startDate: new Date(),
            endDate: new Date(),
        };

        const createdTerm = await termModel.create(termData);

        const updatedData = { title: '' };

        await expect(termModel.update(createdTerm.id, updatedData)).rejects.toThrow();
    });

    it('should delete a Term and return true', async () => {
        const termData = {
            title: 'Test Term',
            startDate: new Date(),
            endDate: new Date(),
        };

        const createdTerm = await termModel.create(termData);

        const result = await termModel.delete(createdTerm.id);

        expect(result).toBe(true);

        const foundTerm = await termModel.findById(createdTerm.id);
        expect(foundTerm).toBeNull();
    });

});
