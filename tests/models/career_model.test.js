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

const CareerModel = require('../../models/career_model');
const CourseModel = require('../../models/course_model');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

describe('CareerModel', () => {
    let careerModel;
    let courseModel;

    beforeAll(async () => {
        careerModel = new CareerModel(sequelize);
        courseModel = new CourseModel(sequelize);

        careerModel.Career.hasMany(courseModel.Course, { as: 'courses', foreignKey: 'careerId' });
        courseModel.Course.belongsTo(careerModel.Career, { foreignKey: 'careerId', as: 'career' });

        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await careerModel.Career.destroy({ where: {} });
    });

    it('should create a Career and find it by ID', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerModel.create(careerData);

        const foundCareer = await careerModel.findById(createdCareer.id);

        expect(foundCareer).not.toBeNull();
        expect(foundCareer.name).toBe(careerData.name);
    });

    it('should return an empty array for findAll when no Careers exist', async () => {
        const careers = await careerModel.findAll();

        expect(careers).toEqual([]);
    });

    it('should update a Career', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerModel.create(careerData);

        const updatedData = { name: 'Updated Career' };
        await careerModel.update(createdCareer.id, updatedData);

        const foundCareer = await careerModel.findById(createdCareer.id);

        expect(foundCareer).not.toBeNull();
        expect(foundCareer.name).toBe(updatedData.name);
    });

    it('should delete a Career', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerModel.create(careerData);

        await careerModel.delete(createdCareer.id);

        const foundCareer = await careerModel.findById(createdCareer.id);

        expect(foundCareer).toBeNull();
    });

    it('should return null when trying to find a non-existent Career by ID', async () => {
        const nonExistentId = 9999;
        const foundCareer = await careerModel.findById(nonExistentId);
        expect(foundCareer).toBeNull();
    });

    it('should return an empty array for findAll when no Careers exist', async () => {
        const careers = await careerModel.findAll();
        expect(careers).toEqual([]);
    });

    it('should return an array of Courses for a Career', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerModel.create(careerData);

        const courseData1 = {
            name: 'Course 1',
            careerId: createdCareer.id,
        };
        const courseData2 = {
            name: 'Course 2',
            careerId: createdCareer.id,
        };
        await courseModel.create(courseData1);
        await courseModel.create(courseData2);

        const courses = await careerModel.getCoursesById(createdCareer.id);

        expect(courses).toHaveLength(2);
        expect(courses[0].name).toBe(courseData1.name);
        expect(courses[1].name).toBe(courseData2.name);
    });

    it('should handle validation errors when creating a Career with missing required fields', async () => {
        const invalidCareerData = {
        };

        await expect(careerModel.create(invalidCareerData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Career', async () => {
        const nonExistentId = 9999;
        const updatedData = { name: 'Updated Career' };

        await expect(careerModel.update(nonExistentId, updatedData)).rejects.toThrow();
    });

    it('should handle errors when deleting a non-existent Career', async () => {
        const nonExistentId = 9999;

        await expect(careerModel.delete(nonExistentId)).rejects.toThrow();
    });

    it('should return an empty array for courses when no Courses exist for a Career', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const createdCareer = await careerModel.create(careerData);

        const courses = await careerModel.getCoursesById(createdCareer.id);

        expect(courses).toEqual([]);
    });

    it('should handle errors when trying to set a non-existent Career for a Course', async () => {
        const nonExistentId = 9999;
        const courseId = 1;

        await expect(courseModel.setCareer(courseId, nonExistentId)).rejects.toThrow();
    });

});
