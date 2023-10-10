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
import CareerService from '../../main/services/CareerService';
import {Career} from '../../main/models/Career';

jest.mock('../../main/models/Career');

describe('CareerService', () => {
    let careers: { id: number; name: string; description: string; }[];
    const errorMessage = 'Database error';

    beforeEach(() => {
        careers = [{id: 1, name: 'Career 1', description: 'Description 1'}];

        (Career.findAll as jest.Mock).mockResolvedValue(careers);
        (Career.findByPk as jest.Mock).mockResolvedValue(null);
        (Career.create as jest.Mock).mockResolvedValue({id: 1, name: 'Career 1', description: 'Description 1'});
        (Career.update as jest.Mock).mockResolvedValue([1, [{
            id: 1,
            name: 'Updated Career 1',
            description: 'Updated Description 1'
        }]]);
        (Career.destroy as jest.Mock).mockResolvedValue(1);
    });

    describe('getAll', () => {
        it('should return an array of careers', async () => {
            const result = await CareerService.getAll();

            expect(result).toEqual(careers);
            expect(Career.findAll).toHaveBeenCalledWith();
        });

        it('should throw an error if there is a database error', async () => {
            (Career.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CareerService.getAll()).rejects.toThrow('Error fetching careers: ' + errorMessage);
        });
    });

    describe('getById', () => {
        it('should return a career by ID', async () => {
            const career = {id: 1, name: 'Career 1', description: 'Description 1'};
            (Career.findByPk as jest.Mock).mockResolvedValue(career);

            const result = await CareerService.getById(1);

            expect(result).toEqual(career);
            expect(Career.findByPk).toHaveBeenCalledWith(1);
        });

        it('should return null if the career does not exist', async () => {
            const result = await CareerService.getById(1);

            expect(result).toBeNull();
            expect(Career.findByPk).toHaveBeenCalledWith(1);
        });

        it('should throw an error if there is a database error', async () => {
            (Career.findByPk as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CareerService.getById(1)).rejects.toThrow('Error fetching career by ID: ' + errorMessage);
        });
    });

    describe('insert', () => {
        it('should insert a new career and return it', async () => {
            const newCareer = {name: 'Career 1', description: 'Description 1'};

            const result = await CareerService.insert(newCareer.name, newCareer.description);

            expect(result).toEqual({id: 1, ...newCareer});
            expect(Career.create).toHaveBeenCalledWith(newCareer);
        });

        it('should throw an error if there is a database error', async () => {
            (Career.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CareerService.insert('Career 1', 'Description 1')).rejects.toThrow('Error inserting career: ' + errorMessage);
        });
    });

    describe('update', () => {
        it('should update an existing career and return the updated career', async () => {
            const updatedCareer = {id: 1, name: 'Updated Career 1', description: 'Updated Description 1'};

            const result = await CareerService.update(updatedCareer.id, updatedCareer.name, updatedCareer.description);

            expect(result).toEqual([1, [updatedCareer]]);
            expect(Career.update).toHaveBeenCalledWith(
                {name: updatedCareer.name, description: updatedCareer.description},
                {where: {id: updatedCareer.id}, returning: true}
            );
        });

        it('should throw an error if there is a database error', async () => {
            (Career.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CareerService.update(1, 'Updated Career 1', 'Updated Description 1')).rejects.toThrow('Error updating career: ' + errorMessage);
        });
    });

    describe('delete', () => {
        it('should delete a career by ID and return the number of deleted careers', async () => {
            const result = await CareerService.delete(1);

            expect(result).toEqual(1);
            expect(Career.destroy).toHaveBeenCalledWith({where: {id: 1}});
        });

        it('should return 0 if the career does not exist', async () => {
            (Career.destroy as jest.Mock).mockResolvedValue(0);

            const result = await CareerService.delete(1);

            expect(result).toEqual(0);
            expect(Career.destroy).toHaveBeenCalledWith({where: {id: 1}});
        });

        it('should throw an error if there is a database error', async () => {
            (Career.destroy as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(CareerService.delete(1)).rejects.toThrow('Error deleting career: ' + errorMessage);
        });
    });
});
