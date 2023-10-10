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
import ProfessorEventService from '../services/ProfessorEventService';
import HttpStatusCode from "../utils/HttpStatusCode";

class ProfessorEventController {
    async getAllByProfessorId(req: Request, res: Response) {
        const professorId = Number(req.params.professorId);
        if (isNaN(professorId)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const professorEvents = await ProfessorEventService.getAllByProfessorId(professorId);
            res.json(professorEvents);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching professor events: ' + error.message});
        }
    }

    async getByProfessorId(req: Request, res: Response) {
        const professorId = Number(req.params.professorId);
        const eventId = Number(req.params.eventId);
        if (isNaN(professorId) || isNaN(eventId)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const event = await ProfessorEventService.getByProfessorId(professorId, eventId);
            if (!event) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Professor Event not found'});
            }
            res.json(event);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error fetching professor by ID: ' + error.message});
        }
    }

    async insertByProfessorId(req: Request, res: Response) {
        const professorId = Number(req.params.professorId);
        if (isNaN(professorId)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        const {title, description, startDate, endDate} = req.body;

        try {
            const newProfessorEvent = await ProfessorEventService.insertByProfessorId(
                professorId, title, description, startDate, endDate
            );
            res.status(HttpStatusCode.CREATED_201).json(newProfessorEvent);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error inserting professor event: ' + error.message});
        }
    }

    async updateByProfessorId(req: Request, res: Response) {
        const professorId = Number(req.params.professorId);
        const eventId = Number(req.params.eventId);
        if (isNaN(professorId) || isNaN(eventId)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        const {title, description, startDate, endDate} = req.body;

        try {
            const [count, professorEvent] = await ProfessorEventService.updateByProfessorId(
                professorId, eventId, title, description, startDate, endDate
            );
            if (count === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Professor event not found'});
            }
            res.json(professorEvent);
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error updating professor event: ' + error.message});
        }
    }

    async deleteByProfessorId(req: Request, res: Response) {
        const professorId = Number(req.params.professorId);
        const eventId = Number(req.params.eventId);
        if (isNaN(professorId) || isNaN(eventId)) {
            return res.status(HttpStatusCode.BAD_REQUEST_400).json({error: 'Invalid ID'});
        }

        try {
            const deletedCount = await ProfessorEventService.deleteByProfessorId(professorId, eventId);
            if (deletedCount === 0) {
                return res.status(HttpStatusCode.NOT_FOUND_404).json({error: 'Professor event not found'});
            }
            res.status(HttpStatusCode.NO_CONTENT_204).send();
        } catch (error: any) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({error: 'Error deleting professor event: ' + error.message});
        }
    }
}

export default ProfessorEventController;
