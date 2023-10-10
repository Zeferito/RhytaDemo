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
import ProfessorEventService from '../../main/services/ProfessorEventService';
import {ProfessorEvent} from '../../main/models/ProfessorEvent';

jest.mock('../../main/models/ProfessorEvent');

describe('ProfessorEventService', () => {
    let professorEvents: {
        id: number;
        title: string;
        description: string;
        startDate: Date;
        endDate: Date;
        professorId: number;
    }[];
    const errorMessage = 'Database error';
    const now = new Date();

    beforeEach(() => {
        professorEvents = [
            {id: 1, title: 'Event 1', description: 'Description 1', startDate: now, endDate: now, professorId: 1},
            {id: 2, title: 'Event 2', description: 'Description 2', startDate: now, endDate: now, professorId: 1},
        ];

        (ProfessorEvent.findAll as jest.Mock).mockResolvedValue(professorEvents);
        (ProfessorEvent.findOne as jest.Mock).mockResolvedValue(null);
        (ProfessorEvent.create as jest.Mock).mockResolvedValue({
            id: 3,
            title: 'Event 3',
            description: 'Description 3',
            startDate: now,
            endDate: now,
            professorId: 2
        });
        (ProfessorEvent.update as jest.Mock).mockResolvedValue([1, [{
            id: 1,
            title: 'Updated Event 1',
            description: 'Updated Description 1',
            startDate: now,
            endDate: now,
            professorId: 1
        }]]);
        (ProfessorEvent.destroy as jest.Mock).mockResolvedValue(1);
    });

    describe('getAllByProfessorId', () => {
        it('should return an array of professor events by professorId', async () => {
            const result = await ProfessorEventService.getAllByProfessorId(1);

            expect(result).toEqual(professorEvents);
            expect(ProfessorEvent.findAll).toHaveBeenCalledWith({
                where: {professorId: 1},
            });
        });

        it('should throw an error if there is a database error', async () => {
            (ProfessorEvent.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorEventService.getAllByProfessorId(1)).rejects.toThrow('Error fetching professor events: ' + errorMessage);
        });
    });

    describe('getByProfessorId', () => {
        it('should return a professor event by professorId and eventId', async () => {
            const professorEvent = {
                id: 1,
                title: 'Event 1',
                description: 'Description 1',
                startDate: now,
                endDate: now,
                professorId: 1
            };
            (ProfessorEvent.findOne as jest.Mock).mockResolvedValue(professorEvent);

            const result = await ProfessorEventService.getByProfessorId(1, 1);

            expect(result).toEqual(professorEvent);
            expect(ProfessorEvent.findOne).toHaveBeenCalledWith({
                where: {professorId: 1, id: 1},
            });
        });

        it('should return null if the professor event does not exist', async () => {
            (ProfessorEvent.findOne as jest.Mock).mockResolvedValue(null);

            const result = await ProfessorEventService.getByProfessorId(1, 1);

            expect(result).toBeNull();
            expect(ProfessorEvent.findOne).toHaveBeenCalledWith({
                where: {professorId: 1, id: 1},
            });
        });

        it('should throw an error if there is a database error', async () => {
            (ProfessorEvent.findOne as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorEventService.getByProfessorId(1, 1)).rejects.toThrow('Error fetching professor event: ' + errorMessage);
        });
    });

    describe('insertByProfessorId', () => {
        it('should insert a new professor event and return it', async () => {
            const newEvent = {
                title: 'Event 3',
                description: 'Description 3',
                startDate: now,
                endDate: now,
                professorId: 2
            };

            const result = await ProfessorEventService.insertByProfessorId(
                newEvent.professorId,
                newEvent.title,
                newEvent.description,
                newEvent.startDate,
                newEvent.endDate
            );

            expect(result).toEqual({id: 3, ...newEvent});
            expect(ProfessorEvent.create).toHaveBeenCalledWith(newEvent);
        });

        it('should throw an error if there is a database error', async () => {
            (ProfessorEvent.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(
                ProfessorEventService.insertByProfessorId(2, 'Event 3', 'Description 3', now, now)
            ).rejects.toThrow('Error inserting professor event: ' + errorMessage);
        });
    });

    describe('updateByProfessorId', () => {
        it('should update an existing professor event and return the updated event', async () => {
            const updatedEvent = {
                id: 1,
                title: 'Updated Event 1',
                description: 'Updated Description 1',
                startDate: now,
                endDate: now,
                professorId: 1
            };

            const result = await ProfessorEventService.updateByProfessorId(
                updatedEvent.professorId,
                updatedEvent.id,
                updatedEvent.title,
                updatedEvent.description,
                updatedEvent.startDate,
                updatedEvent.endDate
            );

            expect(result).toEqual([1, [updatedEvent]]);
            expect(ProfessorEvent.update).toHaveBeenCalledWith(
                {
                    title: updatedEvent.title,
                    description: updatedEvent.description,
                    startDate: updatedEvent.startDate,
                    endDate: updatedEvent.endDate,
                },
                {
                    where: {professorId: updatedEvent.professorId, id: updatedEvent.id},
                    returning: true,
                }
            );
        });

        it('should throw an error if there is a database error', async () => {
            (ProfessorEvent.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(
                ProfessorEventService.updateByProfessorId(1, 1, 'Updated Event 1', 'Updated Description 1', now, now)
            ).rejects.toThrow('Error updating professor event: ' + errorMessage);
        });
    });

    describe('deleteByProfessorId', () => {
        it('should delete a professor event by professorId and eventId and return the number of deleted events', async () => {
            const result = await ProfessorEventService.deleteByProfessorId(1, 1);

            expect(result).toEqual(1);
            expect(ProfessorEvent.destroy).toHaveBeenCalledWith({
                where: {professorId: 1, id: 1},
            });
        });

        it('should return 0 if the professor event does not exist', async () => {
            (ProfessorEvent.destroy as jest.Mock).mockResolvedValue(0);

            const result = await ProfessorEventService.deleteByProfessorId(1, 1);

            expect(result).toEqual(0);
            expect(ProfessorEvent.destroy).toHaveBeenCalledWith({
                where: {professorId: 1, id: 1},
            });
        });

        it('should throw an error if there is a database error', async () => {
            (ProfessorEvent.destroy as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(ProfessorEventService.deleteByProfessorId(1, 1)).rejects.toThrow('Error deleting professor event: ' + errorMessage);
        });
    });
});
