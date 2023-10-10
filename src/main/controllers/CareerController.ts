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
import CareerService from '../services/CareerService';
import HttpStatusCode from "../utils/HttpStatusCode";

class CareerController {
    async getAll(req: Request, res: Response) {
        try {
            const careers = await CareerService.getAll();
            res.json(careers);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching careers: ' + error.message});
        }
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const career = await CareerService.getById(id);
            if (!career) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Career not found'});
            }
            res.json(career);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching career by ID: ' + error.message});
        }
    }

    async insert(req: Request, res: Response) {
        const {name, description} = req.body;

        try {
            const newCareer = await CareerService.insert(name, description);
            res.status(HttpStatusCode.CREATED_201).json(newCareer);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error inserting career: ' + error.message});
        }
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        const {name, description} = req.body;

        try {
            const [count, careers] = await CareerService.update(id, name, description);
            if (count === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Career not found'});
            }
            res.json(careers[0]);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error updating career: ' + error.message});
        }
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const deletedCount = await CareerService.delete(id);
            if (deletedCount === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Career not found'});
            }
            res.status(HttpStatusCode.NO_CONTENT_204).send();
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error deleting career: ' + error.message});
        }
    }
}

export default CareerController;
