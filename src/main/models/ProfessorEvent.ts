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
import {sequelizeConfig} from '../configuration/SequelizeConfig';

import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";
import {Professor} from "./Professor";

export class ProfessorEvent extends Model<InferAttributes<ProfessorEvent>, InferCreationAttributes<ProfessorEvent>> {
    declare id: CreationOptional<number>;

    declare title: string;
    declare description: string | null;
    declare startDate: Date;
    declare endDate: Date;

    declare professorId: ForeignKey<Professor['id']>;
    declare professor?: NonAttribute<Professor>;
}

ProfessorEvent.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Title must not be null',
                },
                notEmpty: {
                    msg: 'Title must not be empty',
                },
            },
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Start Date must not be null',
                },
            },
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'End Date must not be null',
                },
            },
        },
    },
    {
        tableName: 'professor_event',
        timestamps: false,
        sequelize: sequelizeConfig,
    }
);
