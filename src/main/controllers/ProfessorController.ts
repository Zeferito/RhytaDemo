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
import ProfessorService from '../services/ProfessorService';
import HttpStatusCode from "../utils/HttpStatusCode";

class ProfessorController {
    async getAll(req: Request, res: Response) {
        try {
            const professors = await ProfessorService.getAll();
            res.json(professors);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching professors: ' + error.message});
        }
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const professor = await ProfessorService.getById(id);
            if (!professor) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Professor not found'});
            }
            res.json(professor);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching professor by ID: ' + error.message});
        }
    }

    async insert(req: Request, res: Response) {
        const {firstName, lastName} = req.body;

        try {
            const newProfessor = await ProfessorService.insert(firstName, lastName);
            res.status(HttpStatusCode.CREATED_201).json(newProfessor);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error inserting professor: ' + error.message});
        }
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        const {firstName, lastName} = req.body;

        try {
            const [count, professors] = await ProfessorService.update(id, firstName, lastName);
            if (count === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Professor not found'});
            }
            res.json(professors[0]);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error updating professor: ' + error.message});
        }
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const deletedCount = await ProfessorService.delete(id);
            if (deletedCount === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Professor not found'});
            }
            res.status(HttpStatusCode.NO_CONTENT_204).send();
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error deleting professor: ' + error.message});
        }
    }
}

export default ProfessorController;
