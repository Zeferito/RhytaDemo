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
import HttpStatusCode from "../utils/HttpStatusCode";
import TermService from '../services/TermService';

class TermController {
    async getAll(req: Request, res: Response) {
        try {
            const terms = await TermService.getAll();
            res.json(terms);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching terms: ' + error.message});
        }
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const term = await TermService.getById(id);
            if (!term) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Term not found'});
            }
            res.json(term);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching term by ID: ' + error.message});
        }
    }

    async insert(req: Request, res: Response) {
        const {title, description, startDate, endDate} = req.body;

        try {
            const newTerm = await TermService.insert(title, description, startDate, endDate);
            res.status(HttpStatusCode.CREATED_201).json(newTerm);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500)
                .json({error: 'Error inserting term: ' + error.message});
        }
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        const {title, description, startDate, endDate} = req.body;

        try {
            const [count, terms] = await TermService.update(id, title, description, startDate, endDate);
            if (count === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Term not found'});
            }
            res.json(terms[0]);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error updating term: ' + error.message});
        }
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const deletedCount = await TermService.delete(id);
            if (deletedCount === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Term not found'});
            }
            res.status(HttpStatusCode.NO_CONTENT_204).send();
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error deleting term: ' + error.message});
        }
    }
}

export default TermController;
