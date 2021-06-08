import User from './user';
import File from './file';
import Role from './role';

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

Role.belongsToMany(User, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});

User.belongsToMany(Role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});