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
import express from 'express';
import bodyParser from 'body-parser';
import careerRouter from './routers/CareerRouter';
import courseRouter from './routers/CourseRouter';
import professorRouter from './routers/ProfessorRouter';
import termRouter from './routers/TermRouter';
import professorEventRouter from "./routers/ProfessorEventRouter";
import {sequelizeConfig} from "./configuration/SequelizeConfig";

const app = express();
const bodyParse = bodyParser.json();

app.use(bodyParse);

app.use('/careers', careerRouter);
app.use('/courses', courseRouter);
app.use('/professors', professorRouter);
app.use('/events', professorEventRouter);
app.use('/terms', termRouter);

const host: string = process.env.SERVER_HOST || 'localhost';
const port: number = Number(process.env.SERVER_PORT as string) || 3000;
sequelizeConfig.sync().then(() => {
    app.listen(port, host, () => {
        console.log(`Server is running on port ${port}`);
    });
});
