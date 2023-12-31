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

const ProfessorEventController = require('../controllers/professor_event_controller');

class ProfessorEventView {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.professorEventController = new ProfessorEventController(sequelize);
    }

    async runView() {
        while (true) {
            console.log('Options:');
            console.log('1. Retrieve All Professor Events');
            console.log('2. Insert Professor Event');
            console.log('3. Update Professor Event');
            console.log('4. Delete Professor Event');
            console.log('0. Return');

            const choice = readlineSync.question('Enter your choice: ');

            console.log();

            try {
                switch (choice) {
                    case '1':
                        await this.retrieveAllProfessorEvents();
                        break;
                    case '2':
                        await this.insertProfessorEvent();
                        break;
                    case '3':
                        await this.updateProfessorEvent();
                        break;
                    case '4':
                        await this.deleteProfessorEvent();
                        break;
                    case '0':
                        return;
                    default:
                        console.log('Invalid choice. Please try again.');
                }
            } catch (error) {
                console.error('An error occurred:', error.message);
            }

            console.log();
        }
    }

    async retrieveAllProfessorEvents() {
        const professorEvents = await this.professorEventController.getAll();

        console.log('All Professor Events:');
        professorEvents.forEach((event) => {
            console.log(`ID: ${event.id}, Title: ${event.title}, Start Date: ${event.startDate}, End Date: ${event.endDate}`);
        });
    }

    async insertProfessorEvent() {
        const title = readlineSync.question('Enter event title: ');
        const startDate = readlineSync.question('Enter start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter end date (YYYY-MM-DD): ');
        const professorId = readlineSync.question('Enter professor ID for the event: ');

        const createdEvent = await this.professorEventController.insert(title, startDate, endDate, professorId);

        console.log('Professor event created successfully. Event Data:');
        console.log(`ID: ${createdEvent.id}, Title: ${createdEvent.title}, Start Date: ${createdEvent.startDate}, End Date: ${createdEvent.endDate}`);
    }

    async updateProfessorEvent() {
        const id = readlineSync.question('Enter professor event ID to update: ');
        const title = readlineSync.question('Enter updated event title: ');
        const startDate = readlineSync.question('Enter updated start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter updated end date (YYYY-MM-DD): ');
        const professorId = readlineSync.question('Enter updated professor ID: ');

        const rowCount = await this.professorEventController.update(id, title, startDate, endDate, professorId);

        if (rowCount === 0) {
            throw new Error('Professor event not found for update');
        }

        const updatedEvent = await this.professorEventController.get(id);

        console.log('Professor event updated successfully. Updated Event Data:');
        console.log(`ID: ${updatedEvent.id}, Title: ${updatedEvent.title}, Start Date: ${updatedEvent.startDate}, End Date: ${updatedEvent.endDate}, Professor ID: ${updatedEvent.professorId}`);
    }

    async deleteProfessorEvent() {
        const id = readlineSync.question('Enter professor event ID to delete: ');

        const rowCount = await this.professorEventController.delete(id);


        if (rowCount === 0) {
            throw new Error('Professor event not found for deletion');
        } else {
            console.log('Professor event deleted successfully.');
        }
    }
}

module.exports = ProfessorEventView;
