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

class CourseView {
    private readonly baseUrl: string;
    private readonly courseEndpoint: string;

    constructor(baseUrl: string, courseEndpoint: string) {
        this.baseUrl = baseUrl;
        this.courseEndpoint = courseEndpoint;
    }

    async show() {
        while (true) {
            console.log('\nCourse CLI');
            console.log('1. Get All Courses');
            console.log('2. Get Course by ID');
            console.log('3. Insert Course');
            console.log('4. Update Course by ID');
            console.log('5. Delete Course by ID');
            console.log('0. Return');

            const choice = readlineSync.question('Enter your choice: ');

            switch (choice) {
                case '1':
                    await this.getAllCourses();
                    break;
                case '2':
                    await this.getCourseById();
                    break;
                case '3':
                    await this.insertCourse();
                    break;
                case '4':
                    await this.updateCourseById();
                    break;
                case '5':
                    await this.deleteCourseById();
                    break;
                case '0':
                    return;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    }

    private async getAllCourses() {
        try {
            const response = await axios.get(`${this.baseUrl}/${this.courseEndpoint}`);
            console.log('\nAll Courses:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching courses:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async getCourseById() {
        const id = readlineSync.question('Enter Course ID: ');

        try {
            const response = await axios.get(`${this.baseUrl}/${this.courseEndpoint}/${id}`);
            console.log('\nCourse by ID:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError fetching course by ID:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async insertCourse() {
        const name = readlineSync.question('Enter Course Name: ');
        const description = readlineSync.question('Enter Course Description: ');
        const careerId = readlineSync.question('Enter Career ID: ');

        try {
            const response = await axios.post(`${this.baseUrl}/${this.courseEndpoint}`, {
                name,
                description,
                careerId
            });
            console.log('\nInserted Course:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError inserting course:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async updateCourseById() {
        const id = readlineSync.question('Enter Course ID: ');
        const name = readlineSync.question('Enter Course Name: ');
        const description = readlineSync.question('Enter Course Description: ');
        const careerId = readlineSync.question('Enter Career ID: ');

        try {
            const response = await axios.put(`${this.baseUrl}/${this.courseEndpoint}/${id}`, {
                name,
                description,
                careerId
            });
            console.log('\nUpdated Course:');
            console.log(response.data);
        } catch (error: any) {
            console.error('\nError updating course:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }

    private async deleteCourseById() {
        const id = readlineSync.question('Enter Course ID: ');

        try {
            await axios.delete(`${this.baseUrl}/${this.courseEndpoint}/${id}`);
            console.log('\nDeleted Course with ID:', id);
        } catch (error: any) {
            console.error('\nError deleting course:');
            if (error.response) {
                console.error(error.response.data);
            } else {
                console.error(error.message);
            }
        }
    }
}

export default CourseView;
