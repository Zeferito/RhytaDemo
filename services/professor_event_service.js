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

const ProfessorModel = require('../models/professor_model');
const ProfessorEventModel = require('../models/professor_event_model');

class ProfessorEventService {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.professorModel = new ProfessorModel(sequelize);
        this.professorEventModel = new ProfessorEventModel(sequelize);
    }

    async initialize() {
        try {
            await this.professorModel.Professor.hasMany(this.professorEventModel.ProfessorEvent, { as: 'events', foreignKey: 'professorId' });
            await this.professorEventModel.ProfessorEvent.belongsTo(this.professorModel.Professor, { foreignKey: 'professorId', as: 'professor' });

            await this.sequelize.sync();
        } catch (error) {
            console.error('An error occurred during initialization:', error.message);
        }
    }

    async run() {
        try {
            while (true) {
                console.log('Options:');
                console.log('1. Retrieve All Professor Events');
                console.log('2. Insert Professor Event');
                console.log('3. Update Professor Event');
                console.log('4. Delete Professor Event');
                console.log('0. Exit');

                const choice = readlineSync.question('Enter your choice: ');

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
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

    async retrieveAllProfessorEvents() {
        try {
            const professorEvents = await this.professorEventModel.findAll();

            console.log('All Professor Events:');

            professorEvents.forEach((event) => {
                console.log(`ID: ${event.id}, Title: ${event.title}, Start Date: ${event.startDate}, End Date: ${event.endDate}`);
            });
        } catch (error) {
            console.error('Error retrieving professor events:', error.message);
        }
    }

    async insertProfessorEvent() {
        const title = readlineSync.question('Enter event title: ');
        const startDate = readlineSync.question('Enter start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter end date (YYYY-MM-DD): ');
        const professorId = readlineSync.question('Enter professor ID for the event: ');

        try {
            const createdEvent = await this.professorEventModel.create({ title, startDate, endDate, professorId });

            console.log('Professor event created successfully. Event Data:');
            console.log(`ID: ${createdEvent.id}, Title: ${createdEvent.title}, Start Date: ${createdEvent.startDate}, End Date: ${createdEvent.endDate}`);
        } catch (error) {
            console.error('Error creating professor event:', error.message);
        }
    }

    async updateProfessorEvent() {
        const id = readlineSync.question('Enter professor event ID to update: ');
        const title = readlineSync.question('Enter updated event title: ');
        const startDate = readlineSync.question('Enter updated start date (YYYY-MM-DD): ');
        const endDate = readlineSync.question('Enter updated end date (YYYY-MM-DD): ');
        const professorId = readlineSync.question('Enter updated professor ID: ');

        try {
            const updated = await this.professorEventModel.update(id, { title, startDate, endDate, professorId });

            if (updated) {
                console.log('Professor event updated successfully. Updated Event Data:');

                const updatedEvent = await this.professorEventModel.findById(id);

                console.log(`ID: ${updatedEvent.id}, Title: ${updatedEvent.title}, Start Date: ${updatedEvent.startDate}, End Date: ${updatedEvent.endDate}, Professor ID: ${updatedEvent.professorId}`);
            } else {
                console.log('Professor event not found for update.');
            }
        } catch (error) {
            console.error('Error updating professor event:', error.message);
        }
    }

    async deleteProfessorEvent() {
        const id = readlineSync.question('Enter professor event ID to delete: ');

        try {
            const deleted = await this.professorEventModel.delete(id);

            if (deleted) {
                console.log('Professor event deleted successfully.');
            } else {
                console.log('Professor event not found for deletion.');
            }
        } catch (error) {
            console.error('Error deleting professor event:', error.message);
        }
    }
}

module.exports = ProfessorEventService;
