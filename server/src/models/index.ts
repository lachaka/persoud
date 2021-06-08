import User from './user';
import File from './file';

File.belongsToMany(User, {
    through: 'user_file',
    as: 'files',
    foreignKey: 'file_id',
});

File.belongsToMany(User, {
    through: 'user_file',
    as: 'files',
    foreignKey: 'file_id',
});