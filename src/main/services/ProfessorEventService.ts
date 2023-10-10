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
import {ProfessorEvent} from '../models/ProfessorEvent';

class ProfessorEventService {
    async getAllByProfessorId(professorId: number): Promise<ProfessorEvent[]> {
        try {
            return await ProfessorEvent.findAll({
                where: {professorId},
            });
        } catch (error: any) {
            throw new Error('Error fetching professor events: ' + error.message);
        }
    }

    async getByProfessorId(professorId: number, eventId: number): Promise<ProfessorEvent | null> {
        try {
            const professorEvent = await ProfessorEvent.findOne({
                where: {professorId, id: eventId},
            });
            return professorEvent || null;
        } catch (error: any) {
            throw new Error('Error fetching professor event: ' + error.message);
        }
    }

    async insertByProfessorId(
        professorId: number,
        title: string,
        description: string,
        startDate: Date,
        endDate: Date
    ): Promise<ProfessorEvent> {
        try {
            return await ProfessorEvent.create({
                title,
                description,
                startDate,
                endDate,
                professorId
            });
        } catch (error: any) {
            throw new Error('Error inserting professor event: ' + error.message);
        }
    }

    async updateByProfessorId(
        professorId: number,
        eventId: number,
        title: string,
        description: string,
        startDate: Date,
        endDate: Date
    ): Promise<[number, ProfessorEvent[]]> {
        try {
            const [count, updatedProfessorEvent] = await ProfessorEvent.update(
                {
                    title,
                    description,
                    startDate,
                    endDate,
                },
                {
                    where: {professorId, id: eventId},
                    returning: true,
                }
            );
            return [count, updatedProfessorEvent];
        } catch (error: any) {
            throw new Error('Error updating professor event: ' + error.message);
        }
    }

    async deleteByProfessorId(professorId: number, eventId: number): Promise<number> {
        try {
            return await ProfessorEvent.destroy({
                where: {professorId, id: eventId},
            });
        } catch (error: any) {
            throw new Error('Error deleting professor event: ' + error.message);
        }
    }
}

export default new ProfessorEventService();
