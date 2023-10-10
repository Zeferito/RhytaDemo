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
import {sequelizeConfig} from "../configuration/SequelizeConfig";

import {
    Association,
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";
import {ProfessorEvent} from "./ProfessorEvent";

export class Professor extends Model<
    InferAttributes<Professor, { omit: 'events' }>,
    InferCreationAttributes<Professor, { omit: 'events' }>> {
    declare id: CreationOptional<number>;

    declare firstName: string;
    declare lastName: string;

    declare events?: NonAttribute<ProfessorEvent[]>;
    declare static associations: {
        events: Association<Professor, ProfessorEvent>;
    };
}

Professor.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name must not be null',
                },
                notEmpty: {
                    msg: 'First name must not be empty',
                },
            },
        },
        lastName: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'professor',
        timestamps: false,
        sequelize: sequelizeConfig,
    }
);

Professor.hasMany(ProfessorEvent, {
    sourceKey: 'id',
    foreignKey: {
        name: 'professorId',
        allowNull: false
    },
    as: 'events'
});
ProfessorEvent.belongsTo(Professor);
