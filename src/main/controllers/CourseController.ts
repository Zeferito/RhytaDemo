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
import {Request, Response} from 'express';
import CourseService from '../services/CourseService';
import HttpStatusCode from "../utils/HttpStatusCode";

class CourseController {
    async getAll(req: Request, res: Response) {
        try {
            const courses = await CourseService.getAll();
            res.json(courses);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching courses: ' + error.message});
        }
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const course = await CourseService.getById(id);
            if (!course) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Course not found'});
            }
            res.json(course);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching course by ID: ' + error.message});
        }
    }

    async insert(req: Request, res: Response) {
        const {name, description, careerId} = req.body;

        try {
            const newCourse = await CourseService.insert(name, description, careerId);
            res.status(HttpStatusCode.CREATED_201).json(newCourse);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error inserting course: ' + error.message});
        }
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        const {name, description, careerId} = req.body;

        try {
            const [count, courses] = await CourseService.update(id, name, description, careerId);
            if (count === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Course not found'});
            }
            res.json(courses[0]);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error updating course: ' + error.message});
        }
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const deletedCount = await CourseService.delete(id);
            if (deletedCount === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Course not found'});
            }
            res.status(HttpStatusCode.NO_CONTENT_204).send();
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error deleting course: ' + error.message});
        }
    }
}

export default CourseController;
