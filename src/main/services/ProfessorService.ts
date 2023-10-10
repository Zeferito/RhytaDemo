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
import {Professor} from '../models/Professor';

class ProfessorService {
    async getAll(): Promise<Professor[]> {
        try {
            return await Professor.findAll();
        } catch (error: any) {
            throw new Error('Error fetching professors: ' + error.message);
        }
    }

    async getById(id: number): Promise<Professor | null> {
        try {
            return await Professor.findByPk(id);
        } catch (error: any) {
            throw new Error('Error fetching professor by ID: ' + error.message);
        }
    }

    async insert(firstName: string, lastName: string): Promise<Professor> {
        try {
            return await Professor.create({firstName, lastName});
        } catch (error: any) {
            throw new Error('Error inserting professor: ' + error.message);
        }
    }

    async update(id: number, firstName: string, lastName: string): Promise<[number, Professor[]]> {
        try {
            const [count, professors] = await Professor.update({firstName, lastName}, {
                where: {id},
                returning: true,
            });
            return [count, professors];
        } catch (error: any) {
            throw new Error('Error updating professor: ' + error.message);
        }
    }

    async delete(id: number): Promise<number> {
        try {
            return await Professor.destroy({
                where: {id},
            });
        } catch (error: any) {
            throw new Error('Error deleting professor: ' + error.message);
        }
    }
}

export default new ProfessorService();
