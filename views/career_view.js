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
const readlineSync = require('readline-sync');

const CareerController = require('../controllers/career_controller');

class CareerView {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.careerController = new CareerController(sequelize);
    }

    async runView() {
        try {
            while (true) {
                console.log('Options:');
                console.log('1. Retrieve All Careers');
                console.log('2. Insert Career');
                console.log('3. Update Career');
                console.log('4. Delete Career');
                console.log('0. Return');

                const choice = readlineSync.question('Enter your choice: ');

                console.log();

                switch (choice) {
                    case '1':
                        await this.retrieveAllCareers();
                        break;
                    case '2':
                        await this.insertCareer();
                        break;
                    case '3':
                        await this.updateCareer();
                        break;
                    case '4':
                        await this.deleteCareer();
                        break;
                    case '0':
                        return;
                    default:
                        console.log('Invalid choice. Please try again.');
                }

                console.log();
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

    async retrieveAllCareers() {
        const careers = await this.careerController.getAll();

        console.log('All Careers:');
        careers.forEach((career) => {
            console.log(`ID: ${career.id}, Name: ${career.name}`);
        });
    }

    async insertCareer() {
        const name = readlineSync.question('Enter career name: ');

        const createdCareer = await this.careerController.insert(name);

        console.log('Career created successfully. Career Data:');
        console.log(`ID: ${createdCareer.id}, Name: ${createdCareer.name}`);
    }

    async updateCareer() {
        const id = readlineSync.question('Enter career ID to update: ');
        const name = readlineSync.question('Enter updated career name: ');

        const rowCount = await this.careerController.update(id, name);

        if (rowCount === 0) {
            throw new Error('Career not found for update');
        }

        const updatedCareer = await this.careerController.get(id);

        console.log('Career updated successfully. Updated Career Data:');
        console.log(`ID: ${updatedCareer.id}, Name: ${updatedCareer.name}`);
    }

    async deleteCareer() {
        const id = readlineSync.question('Enter career ID to delete: ');

        const rowCount = await this.careerController.delete(id);

        if (rowCount === 0) {
            throw new Error('Career not found for deletion');
        } else {
            console.log('Career deleted successfully.');
        }
    }
}

module.exports = CareerView;
