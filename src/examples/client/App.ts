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
require('dotenv').config();

import readlineSync from 'readline-sync';
import CareerView from './views/CareerView';
import CourseView from './views/CourseView';
import ProfessorView from './views/ProfessorView';
import ProfessorEventView from './views/ProfessorEventView';
import TermView from './views/TermView';

const baseUrl: string = "http://" + process.env.SERVER_HOST + ":" + process.env.SERVER_PORT;

const careerEndpoint: string = 'careers';
const courseEndpoint: string = 'courses';
const professorEndpoint: string = 'professors';
const professorEventEndpoint: string = 'events';
const termEndpoint: string = 'terms';

const careerView: CareerView = new CareerView(baseUrl, careerEndpoint);
const courseView: CourseView = new CourseView(baseUrl, courseEndpoint);
const professorView: ProfessorView = new ProfessorView(baseUrl, professorEndpoint);
const professorEventView: ProfessorEventView = new ProfessorEventView(baseUrl, professorEventEndpoint);
const termView: TermView = new TermView(baseUrl, termEndpoint);

(async () => {
    while (true) {
        console.log('\nMain Menu');
        console.log('1. Career');
        console.log('2. Course');
        console.log('3. Professor');
        console.log('4. Professor Event');
        console.log('5. Term');
        console.log('0. Exit');

        const choice = readlineSync.question('Enter your choice: ');

        switch (choice) {
            case '1':
                await careerView.show();
                break;
            case '2':
                await courseView.show();
                break;
            case '3':
                await professorView.show();
                break;
            case '4':
                await professorEventView.show();
                break;
            case '5':
                await termView.show();
                break;
            case '0':
                return;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
})();