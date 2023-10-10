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

class ProfessorView {
    private readonly baseUrl: string;
    private readonly professorEndpoint: string;

    constructor(baseUrl: string, professorEndpoint: string) {
        this.baseUrl = baseUrl;
        this.professorEndpoint = professorEndpoint;
    }

    async show() {
        while (true) {
            console.log('\nProfessor CLI');
            console.log('1. Get All Professors');
            console.log('2. Get Professor by ID');
            console.log('3. Insert Professor');
            console.log('4. Update Professor by ID');
            console.log('5. Delete Professor by ID');
            console.log('0. Return');

            const choice = readlineSync.question('Enter your choice: ');

            switch (choice) {
                case '1':
                    await this.getAllProfessors();
                    break;
                case '2':
                    await this.getProfessorById();
                    break;
                case '3':
                    await this.insertProfessor();
                    break;
                case '4':
                    await this.updateProfessorById();
                    break;
                case '5':
                    await this.deleteProfessorById();
                    break;
                case '0':
                    return;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    }

    private async getAllProfessors() {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.professorEndpoint}`);
            console.log('\nAll Professors:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching professors:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async getProfessorById() {
        const id = readlineSync.question('Enter Professor ID: ');

        try {
            const response = await axios.get(`${this.baseUrl}/${this.professorEndpoint}/${id}`);
            console.log('\nProfessor by ID:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching professor by ID:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async insertProfessor() {
        const firstName = readlineSync.question('Enter Professor First Name: ');
        const lastName = readlineSync.question('Enter Professor Last Name: ');

        try {
            const response = await axios.post(`${this.baseUrl}/${this.professorEndpoint}`, {
                firstName,
                lastName,
            });
            console.log('\nInserted Professor:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError inserting professor:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async updateProfessorById() {
        const id = readlineSync.question('Enter Professor ID: ');
        const firstName = readlineSync.question('Enter Professor First Name: ');
        const lastName = readlineSync.question('Enter Professor Last Name: ');

        try {
            const response = await axios.put(`${this.baseUrl}/${this.professorEndpoint}/${id}`, {
                firstName,
                lastName,
            });
            console.log('\nUpdated Professor:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError updating professor:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async deleteProfessorById() {
        const id = readlineSync.question('Enter Professor ID: ');

        try {
            await axios.delete(`${this.baseUrl}/${this.professorEndpoint}/${id}`);
            console.log('\nDeleted Professor with ID:', id);
        } catch (error: any) {
            console.error('\nError deleting professor:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }
}

export default ProfessorView;
