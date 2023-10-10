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
import TermService from '../../main/services/TermService';
import {Term} from '../../main/models/Term';

jest.mock('../../main/models/Term');

describe('TermService', () => {
    let terms: { id: number; title: string; description: string; startDate: Date; endDate: Date; }[];
    const errorMessage = 'Database error';
    const now = new Date();

    beforeEach(() => {
        terms = [
            {id: 1, title: 'Term 1', description: 'Description 1', startDate: now, endDate: now},
            {id: 2, title: 'Term 2', description: 'Description 2', startDate: now, endDate: now},
        ];

        (Term.findAll as jest.Mock).mockResolvedValue(terms);
        (Term.findByPk as jest.Mock).mockResolvedValue(null);
        (Term.create as jest.Mock).mockResolvedValue({
            id: 3,
            title: 'Term 3',
            description: 'Description 3',
            startDate: now,
            endDate: now
        });
        (Term.update as jest.Mock).mockResolvedValue([1, [{
            id: 1,
            title: 'Updated Term 1',
            description: 'Updated Description 1',
            startDate: now,
            endDate: now
        }]]);
        (Term.destroy as jest.Mock).mockResolvedValue(1);
    });

    describe('getAll', () => {
        it('should return an array of terms', async () => {
            const result = await TermService.getAll();

            expect(result).toEqual(terms);
            expect(Term.findAll).toHaveBeenCalledWith();
        });

        it('should throw an error if there is a database error', async () => {
            (Term.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(TermService.getAll()).rejects.toThrow('Error fetching terms: ' + errorMessage);
        });
    });

    describe('getById', () => {
        it('should return a term by ID', async () => {
            const term = {id: 1, title: 'Term 1', description: 'Description 1', startDate: now, endDate: now};
            (Term.findByPk as jest.Mock).mockResolvedValue(term);

            const result = await TermService.getById(1);

            expect(result).toEqual(term);
            expect(Term.findByPk).toHaveBeenCalledWith(1);
        });

        it('should return null if the term does not exist', async () => {
            (Term.findByPk as jest.Mock).mockResolvedValue(null);

            const result = await TermService.getById(1);

            expect(result).toBeNull();
            expect(Term.findByPk).toHaveBeenCalledWith(1);
        });

        it('should throw an error if there is a database error', async () => {
            (Term.findByPk as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(TermService.getById(1)).rejects.toThrow('Error fetching term by ID: ' + errorMessage);
        });
    });

    describe('insert', () => {
        it('should insert a new term and return it', async () => {
            const newTerm = {title: 'Term 3', description: 'Description 3', startDate: now, endDate: now};

            const result = await TermService.insert(newTerm.title, newTerm.description, newTerm.startDate, newTerm.endDate);

            expect(result).toEqual({id: 3, ...newTerm});
            expect(Term.create).toHaveBeenCalledWith(newTerm);
        });

        it('should throw an error if there is a database error', async () => {
            (Term.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(TermService.insert('Term 3', 'Description 3', now, now)).rejects.toThrow('Error inserting term: ' + errorMessage);
        });
    });

    describe('update', () => {
        it('should update an existing term and return the updated term', async () => {
            const updatedTerm = {
                id: 1,
                title: 'Updated Term 1',
                description: 'Updated Description 1',
                startDate: now,
                endDate: now
            };

            const result = await TermService.update(updatedTerm.id, updatedTerm.title, updatedTerm.description, updatedTerm.startDate, updatedTerm.endDate);

            expect(result).toEqual([1, [updatedTerm]]);
            expect(Term.update).toHaveBeenCalledWith(
                {
                    title: updatedTerm.title,
                    description: updatedTerm.description,
                    startDate: updatedTerm.startDate,
                    endDate: updatedTerm.endDate
                },
                {
                    where: {id: updatedTerm.id},
                    returning: true,
                }
            );
        });

        it('should throw an error if there is a database error', async () => {
            (Term.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(TermService.update(1, 'Updated Term 1', 'Updated Description 1', now, now)).rejects.toThrow('Error updating term: ' + errorMessage);
        });
    });

    describe('delete', () => {
        it('should delete a term by ID and return the number of deleted terms', async () => {
            const result = await TermService.delete(1);

            expect(result).toEqual(1);
            expect(Term.destroy).toHaveBeenCalledWith({
                where: {id: 1},
            });
        });

        it('should return 0 if the term does not exist', async () => {
            (Term.destroy as jest.Mock).mockResolvedValue(0);

            const result = await TermService.delete(1);

            expect(result).toEqual(0);
            expect(Term.destroy).toHaveBeenCalledWith({
                where: {id: 1},
            });
        });

        it('should throw an error if there is a database error', async () => {
            (Term.destroy as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(TermService.delete(1)).rejects.toThrow('Error deleting term: ' + errorMessage);
        });
    });
});
