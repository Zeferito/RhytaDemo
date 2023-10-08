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

describe('CourseService', () => {
    let courseService;
    let careerService;

    beforeAll(async () => {
        courseService = new CourseService(sequelize);
        careerService = new CareerService(sequelize);
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await courseService.courseModel.Course.destroy({ where: {} });
        await careerService.careerModel.Career.destroy({ where: {} });
    });

    it('should create a Course and find it by ID', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const career = await careerService.insert(careerData);

        const courseData = {
            name: 'Test Course',
            careerId: career.id,
        };
        const createdCourse = await courseService.insert(courseData);

        const foundCourse = await courseService.get(createdCourse.id);

        expect(foundCourse).not.toBeNull();
        expect(foundCourse.name).toBe(courseData.name);
    });

    it('should return an empty array for getAll when no Courses exist', async () => {
        const courses = await courseService.getAll();

        expect(courses).toEqual([]);
    });

    it('should update a Course', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const career = await careerService.insert(careerData);

        const courseData = {
            name: 'Test Course',
            careerId: career.id,
        };
        const createdCourse = await courseService.insert(courseData);

        const updatedData = { name: 'Updated Course' };
        await courseService.update(createdCourse.id, updatedData);

        const foundCourse = await courseService.get(createdCourse.id);

        expect(foundCourse).not.toBeNull();
        expect(foundCourse.name).toBe(updatedData.name);
    });

    it('should delete a Course', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const career = await careerService.insert(careerData);

        const courseData = {
            name: 'Test Course',
            careerId: career.id,
        };
        const createdCourse = await courseService.insert(courseData);

        await courseService.delete(createdCourse.id);

        expect(courseService.get(createdCourse.id)).rejects.toThrow();
    });

    it('should return null when trying to find a non-existent Course by ID', async () => {
        const nonExistentId = 9999;
        expect(courseService.get(nonExistentId)).rejects.toThrow();
    });

    it('should return an empty array for getAll when no Courses exist', async () => {
        const courses = await courseService.getAll();
        expect(courses).toEqual([]);
    });

    it('should return an array of Courses for getAll when Courses exist', async () => {
        const careerData = {
            name: 'Computer Science',
        };
        const career = await careerService.insert(careerData);

        const courseData1 = {
            name: 'Course 1',
            careerId: career.id,
        };
        const courseData2 = {
            name: 'Course 2',
            careerId: career.id,
        };
        await courseService.insert(courseData1);
        await courseService.insert(courseData2);

        const courses = await courseService.getAll();

        expect(courses).toHaveLength(2);
        expect(courses[0].name).toBe(courseData1.name);
        expect(courses[1].name).toBe(courseData2.name);
    });

    it('should handle validation errors when creating a Course with missing required fields', async () => {
        const invalidCourseData = {};

        await expect(courseService.insert(invalidCourseData)).rejects.toThrow();
    });

    it('should handle errors when updating a non-existent Course', async () => {
        const nonExistentId = 9999;
        const updatedData = { name: 'Updated Course' };

        await expect(courseService.update(nonExistentId, updatedData)).rejects.toThrow();
    });

    it('should handle errors when deleting a non-existent Course', async () => {
        const nonExistentId = 9999;

        await expect(courseService.delete(nonExistentId)).rejects.toThrow();
    });
});
