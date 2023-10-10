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
import axios from 'axios';
import readlineSync from 'readline-sync';

class ProfessorEventView {
    private readonly baseUrl: string;
    private readonly professorEventEndpoint: string;

    constructor(baseUrl: string, professorEventEndpoint: string) {
        this.baseUrl = baseUrl;
        this.professorEventEndpoint = professorEventEndpoint;
    }

    async show() {
        while (true) {
            console.log('\nProfessor Event CLI');
            console.log('1. Get All Professor Events');
            console.log('2. Get Professor Event by ID');
            console.log('3. Insert Professor Event');
            console.log('4. Update Professor Event by ID');
            console.log('5. Delete Professor Event by ID');
            console.log('0. Return');

            const choice = readlineSync.question('Enter your choice: ');

            switch (choice) {
                case '1':
                    await this.getAllProfessorEvents();
                    break;
                case '2':
                    await this.getProfessorEventById();
                    break;
                case '3':
                    await this.insertProfessorEvent();
                    break;
                case '4':
                    await this.updateProfessorEventById();
                    break;
                case '5':
                    await this.deleteProfessorEventById();
                    break;
                case '0':
                    return;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    }

    private async getAllProfessorEvents() {
        const professorId = readlineSync.question('Enter Professor ID: ');

        try {
            const response = await axios.get(
                `${this.baseUrl}/${this.professorEventEndpoint}/${professorId}`
            );
            console.log('\nAll Professor Events:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching professor events:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async getProfessorEventById() {
        const professorId = readlineSync.question('Enter Professor ID: ');
        const eventId = readlineSync.question('Enter Professor Event ID: ');

        try {
            const response = await axios.get(
                `${this.baseUrl}/${this.professorEventEndpoint}/${professorId}/${eventId}`
            );
            console.log('\nProfessor Event by ID:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching professor event by ID:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async insertProfessorEvent() {
        const professorId = readlineSync.question('Enter Professor ID: ');
        const title = readlineSync.question('Enter Professor Event Title: ');
        const description = readlineSync.question('Enter Professor Event Description: ');
        const startDate = readlineSync.question('Enter Professor Event Start Date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter Professor Event End Date (YYYY-MM-DD): ');

        try {
            const response = await axios.post(
                `${this.baseUrl}/${this.professorEventEndpoint}/${professorId}`,
                {
                    title,
                    description,
                    startDate,
                    endDate,
                }
            );
            console.log('\nInserted Professor Event:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError inserting professor event:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async updateProfessorEventById() {
        const professorId = readlineSync.question('Enter Professor ID: ');
        const eventId = readlineSync.question('Enter Professor Event ID: ');
        const title = readlineSync.question('Enter Professor Event Title: ');
        const description = readlineSync.question('Enter Professor Event Description: ');
        const startDate = readlineSync.question('Enter Professor Event Start Date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter Professor Event End Date (YYYY-MM-DD): ');

        try {
            const response = await axios.put(
                `${this.baseUrl}/${this.professorEventEndpoint}/${professorId}/${eventId}`,
                {
                    title,
                    description,
                    startDate,
                    endDate,
                }
            );
            console.log('\nUpdated Professor Event:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError updating professor event:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async deleteProfessorEventById() {
        const professorId = readlineSync.question('Enter Professor ID: ');
        const eventId = readlineSync.question('Enter Professor Event ID: ');

        try {
            await axios.delete(
                `${this.baseUrl}/${this.professorEventEndpoint}/${professorId}/${eventId}`
            );
            console.log('\nDeleted Professor Event with ID:', eventId);
        } catch (error: any) {
            console.error('\nError deleting professor event:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }
}

export default ProfessorEventView;
