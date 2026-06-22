import Role from '../../models/access/Roles.model';
import User from '../../models/access/Users.model';

export class AccessRepository {
    // Consultas de Roles
    async fetchActiveRoles() {
        return await Role.find({ isActive: true });
    }

    async saveRole(roleData: any) {
        const newRole = new Role(roleData);
        return await newRole.save();
    }

    // Consultas de Usuarios
    async fetchAllUsers() {
        return await User.find({}).populate('roleId', 'roleName description');
    }

    async fetchUserByUsername(username: string) {
        return await User.findOne({ username }).populate('roleId', 'roleName description');
    }

    async saveUser(userData: any) {
        const newUser = new User(userData);
        return await newUser.save();
    }
}