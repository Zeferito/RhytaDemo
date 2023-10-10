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

class CareerView {
    private readonly baseUrl: string;
    private readonly careerEndpoint: string;

    constructor(baseUrl: string, careerEndpoint: string) {
        this.baseUrl = baseUrl;
        this.careerEndpoint = careerEndpoint;
    }

    async show() {
        while (true) {
            console.log('\nCareer CLI');
            console.log('1. Get All Careers');
            console.log('2. Get Career by ID');
            console.log('3. Insert Career');
            console.log('4. Update Career by ID');
            console.log('5. Delete Career by ID');
            console.log('0. Return');

            const choice = readlineSync.question('Enter your choice: ');

            switch (choice) {
                case '1':
                    await this.getAllCareers();
                    break;
                case '2':
                    await this.getCareerById();
                    break;
                case '3':
                    await this.insertCareer();
                    break;
                case '4':
                    await this.updateCareerById();
                    break;
                case '5':
                    await this.deleteCareerById();
                    break;
                case '0':
                    return;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    }

    private async getAllCareers() {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.careerEndpoint}`);
            console.log('\nAll Careers:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching careers:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async getCareerById() {
        const id = readlineSync.question('Enter Career ID: ');

        try {
            const response = await axios.get(`${this.baseUrl}/${this.careerEndpoint}/${id}`);
            console.log('\nCareer by ID:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching career by ID:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async insertCareer() {
        const name = readlineSync.question('Enter Career Name: ');
        const description = readlineSync.question('Enter Career Description: ');

        try {
            const response = await axios.post(`${this.baseUrl}/${this.careerEndpoint}`, {
                name,
                description,
            });
            console.log('\nInserted Career:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError inserting career:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async updateCareerById() {
        const id = readlineSync.question('Enter Career ID: ');
        const name = readlineSync.question('Enter Career Name: ');
        const description = readlineSync.question('Enter Career Description: ');

        try {
            const response = await axios.put(`${this.baseUrl}/${this.careerEndpoint}/${id}`, {
                name,
                description,
            });
            console.log('\nUpdated Career:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError updating career:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async deleteCareerById() {
        const id = readlineSync.question('Enter Career ID: ');

        try {
            await axios.delete(`${this.baseUrl}/${this.careerEndpoint}/${id}`);
            console.log('\nDeleted Career with ID:', id);
        } catch (error: any) {
            console.error('\nError deleting career:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }
}

export default CareerView;
