import { DataTypes } from 'sequelize';
import sequelize from '../db/index';

const Role = sequelize.define("roles", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
});

export default Role;