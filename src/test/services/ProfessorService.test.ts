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
import ProfessorService from '../../main/services/ProfessorService';
import {Professor} from '../../main/models/Professor';

jest.mock('../../main/models/Professor');

describe('ProfessorService', () => {
    let professors: { id: number; firstName: string; lastName: string; }[];
    const errorMessage = 'Database error';

    beforeEach(() => {
        professors = [
            {id: 1, firstName: 'John', lastName: 'Doe'},
            {id: 2, firstName: 'Jane', lastName: 'Smith'},
        ];

        (Professor.findAll as jest.Mock).mockResolvedValue(professors);
        (Professor.findByPk as jest.Mock).mockResolvedValue(null);
        (Professor.create as jest.Mock).mockResolvedValue({id: 3, firstName: 'Alice', lastName: 'Johnson'});
        (Professor.update as jest.Mock).mockResolvedValue([1, [{
            id: 1,
            firstName: 'Updated John',
            lastName: 'Updated Doe'
        }]]);
        (Professor.destroy as jest.Mock).mockResolvedValue(1);
    });

    describe('getAll', () => {
        it('should return an array of professors', async () => {
            const result = await ProfessorService.getAll();

            expect(result).toEqual(professors);
            expect(Professor.findAll).toHaveBeenCalledWith();
        });

        it('should throw an error if there is a database error', async () => {
            (Professor.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorService.getAll()).rejects.toThrow('Error fetching professors: ' + errorMessage);
        });
    });

    describe('getById', () => {
        it('should return a professor by ID', async () => {
            const professor = {id: 1, firstName: 'John', lastName: 'Doe'};
            (Professor.findByPk as jest.Mock).mockResolvedValue(professor);

            const result = await ProfessorService.getById(1);

            expect(result).toEqual(professor);
            expect(Professor.findByPk).toHaveBeenCalledWith(1);
        });

        it('should return null if the professor does not exist', async () => {
            (Professor.findByPk as jest.Mock).mockResolvedValue(null);

            const result = await ProfessorService.getById(1);

            expect(result).toBeNull();
            expect(Professor.findByPk).toHaveBeenCalledWith(1);
        });

        it('should throw an error if there is a database error', async () => {
            (Professor.findByPk as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorService.getById(1)).rejects.toThrow('Error fetching professor by ID: ' + errorMessage);
        });
    });

    describe('insert', () => {
        it('should insert a new professor and return it', async () => {
            const newProfessor = {firstName: 'Alice', lastName: 'Johnson'};

            const result = await ProfessorService.insert(newProfessor.firstName, newProfessor.lastName);

            expect(result).toEqual({id: 3, ...newProfessor});
            expect(Professor.create).toHaveBeenCalledWith(newProfessor);
        });

        it('should throw an error if there is a database error', async () => {
            (Professor.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorService.insert('Alice', 'Johnson')).rejects.toThrow('Error inserting professor: ' + errorMessage);
        });
    });

    describe('update', () => {
        it('should update an existing professor and return the updated professor', async () => {
            const updatedProfessor = {id: 1, firstName: 'Updated John', lastName: 'Updated Doe'};

            const result = await ProfessorService.update(updatedProfessor.id, updatedProfessor.firstName, updatedProfessor.lastName);

            expect(result).toEqual([1, [updatedProfessor]]);
            expect(Professor.update).toHaveBeenCalledWith(
                {firstName: updatedProfessor.firstName, lastName: updatedProfessor.lastName},
                {
                    where: {id: updatedProfessor.id},
                    returning: true,
                }
            );
        });

        it('should throw an error if there is a database error', async () => {
            (Professor.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorService.update(1, 'Updated John', 'Updated Doe')).rejects.toThrow('Error updating professor: ' + errorMessage);
        });
    });

    describe('delete', () => {
        it('should delete a professor by ID and return the number of deleted professors', async () => {
            const result = await ProfessorService.delete(1);

            expect(result).toEqual(1);
            expect(Professor.destroy).toHaveBeenCalledWith({
                where: {id: 1},
            });
        });

        it('should return 0 if the professor does not exist', async () => {
            (Professor.destroy as jest.Mock).mockResolvedValue(0);

            const result = await ProfessorService.delete(1);

            expect(result).toEqual(0);
            expect(Professor.destroy).toHaveBeenCalledWith({
                where: {id: 1},
            });
        });

        it('should throw an error if there is a database error', async () => {
            (Professor.destroy as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorService.delete(1)).rejects.toThrow('Error deleting professor: ' + errorMessage);
        });
    });
});
