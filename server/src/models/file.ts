import { DataTypes } from 'sequelize';
import sequelize from '../db/index';

const File = sequelize.define('files', {
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sharedWith: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  name: DataTypes.STRING,
  path: DataTypes.STRING,
  size_b: DataTypes.NUMBER,
  isDir: DataTypes.BOOLEAN,
});

export default File;
