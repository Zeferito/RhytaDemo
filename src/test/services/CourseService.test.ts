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
import CourseService from '../../main/services/CourseService';
import {Course} from '../../main/models/Course';

jest.mock('../../main/models/Course');

describe('CourseService', () => {
    let courses: { id: number; name: string; description: string; careerId: number; }[];
    const errorMessage = 'Database error';

    beforeEach(() => {
        courses = [
            {id: 1, name: 'Course 1', description: 'Description 1', careerId: 1},
            {id: 2, name: 'Course 2', description: 'Description 2', careerId: 1},
        ];

        (Course.findAll as jest.Mock).mockResolvedValue(courses);
        (Course.findByPk as jest.Mock).mockResolvedValue(null);
        (Course.create as jest.Mock).mockResolvedValue({
            id: 3,
            name: 'Course 3',
            description: 'Description 3',
            careerId: 2
        });
        (Course.update as jest.Mock).mockResolvedValue([1, [{
            id: 1,
            name: 'Updated Course 1',
            description: 'Updated Description 1',
            careerId: 1
        }]]);
        (Course.destroy as jest.Mock).mockResolvedValue(1);
    });

    describe('getAll', () => {
        it('should return an array of courses', async () => {
            const result = await CourseService.getAll();

            expect(result).toEqual(courses);
            expect(Course.findAll).toHaveBeenCalledWith();
        });

        it('should throw an error if there is a database error', async () => {
            (Course.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CourseService.getAll()).rejects.toThrow('Error fetching courses: ' + errorMessage);
        });
    });

    describe('getById', () => {
        it('should return a course by ID', async () => {
            const course = {id: 1, name: 'Course 1', description: 'Description 1', careerId: 1};
            (Course.findByPk as jest.Mock).mockResolvedValue(course);

            const result = await CourseService.getById(1);

            expect(result).toEqual(course);
            expect(Course.findByPk).toHaveBeenCalledWith(1);
        });

        it('should return null if the course does not exist', async () => {
            (Course.findByPk as jest.Mock).mockResolvedValue(null);

            const result = await CourseService.getById(1);

            expect(result).toBeNull();
            expect(Course.findByPk).toHaveBeenCalledWith(1);
        });

        it('should throw an error if there is a database error', async () => {
            (Course.findByPk as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CourseService.getById(1)).rejects.toThrow('Error fetching course by ID: ' + errorMessage);
        });
    });

    describe('insert', () => {
        it('should insert a new course and return it', async () => {
            const newCourse = {name: 'Course 3', description: 'Description 3', careerId: 2};

            const result = await CourseService.insert(newCourse.name, newCourse.description, newCourse.careerId);

            expect(result).toEqual({id: 3, ...newCourse});
            expect(Course.create).toHaveBeenCalledWith(newCourse);
        });

        it('should throw an error if there is a database error', async () => {
            (Course.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CourseService.insert('Course 3', 'Description 3', 2)).rejects.toThrow(
                'Error inserting course: ' + errorMessage
            );
        });
    });

    describe('update', () => {
        it('should update an existing course and return the updated course', async () => {
            const updatedCourse = {id: 1, name: 'Updated Course 1', description: 'Updated Description 1', careerId: 1};

            const result = await CourseService.update(updatedCourse.id, updatedCourse.name, updatedCourse.description, updatedCourse.careerId);

            expect(result).toEqual([1, [updatedCourse]]);
            expect(Course.update).toHaveBeenCalledWith(
                {name: updatedCourse.name, description: updatedCourse.description, careerId: updatedCourse.careerId},
                {where: {id: updatedCourse.id}, returning: true}
            );
        });

        it('should throw an error if there is a database error', async () => {
            (Course.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CourseService.update(1, 'Updated Course 1', 'Updated Description 1', 1)).rejects.toThrow('Error updating course: ' + errorMessage);
        });
    });

    describe('delete', () => {
        it('should delete a course by ID and return the number of deleted courses', async () => {
            const result = await CourseService.delete(1);

            expect(result).toEqual(1);
            expect(Course.destroy).toHaveBeenCalledWith({where: {id: 1}});
        });

        it('should return 0 if the course does not exist', async () => {
            (Course.destroy as jest.Mock).mockResolvedValue(0);

            const result = await CourseService.delete(1);

            expect(result).toEqual(0);
            expect(Course.destroy).toHaveBeenCalledWith({where: {id: 1}});
        });

        it('should throw an error if there is a database error', async () => {
            (Course.destroy as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CourseService.delete(1)).rejects.toThrow('Error deleting course: ' + errorMessage);
        });
    });
});
