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
import {Career} from '../models/Career';

class CareerService {
    async getAll(): Promise<Career[]> {
        try {
            return await Career.findAll();
        } catch (error: any) {
            throw new Error('Error fetching careers: ' + error.message);
        }
    }

    async getById(id: number): Promise<Career | null> {
        try {
            return await Career.findByPk(id);
        } catch (error: any) {
            throw new Error('Error fetching career by ID: ' + error.message);
        }
    }

    async insert(name: string, description: string): Promise<Career> {
        try {
            return await Career.create({
                name,
                description,
            });
        } catch (error: any) {
            throw new Error('Error inserting career: ' + error.message);
        }
    }

    async update(id: number, name: string, description: string): Promise<[number, Career[]]> {
        try {
            const [count, careers] = await Career.update(
                {
                    name,
                    description,
                },
                {
                    where: {id},
                    returning: true,
                }
            );
            return [count, careers];
        } catch (error: any) {
            throw new Error('Error updating career: ' + error.message);
        }
    }

    async delete(id: number): Promise<number> {
        try {
            return await Career.destroy({
                where: {id},
            });
        } catch (error: any) {
            throw new Error('Error deleting career: ' + error.message);
        }
    }
}

export default new CareerService();
