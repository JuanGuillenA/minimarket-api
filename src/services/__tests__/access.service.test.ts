// src/services/__tests__/access.service.test.ts
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { AccessService } from '../access/Access.service';
import { AccessRepository } from '../../repositories/access/Access.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../repositories/access/Access.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Access Service', () => {
  let accessService: AccessService;
  const mockAccessRepo = new AccessRepository() as jest.Mocked<AccessRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    accessService = new AccessService();
    (accessService as any).accessRepo = mockAccessRepo;
  });

  it('Debería obtener los roles activos', async () => {
    const mockRoles = [{ _id: '1', roleName: 'Admin' }];
    mockAccessRepo.fetchActiveRoles.mockResolvedValue(mockRoles as any);

    const result = await accessService.getSystemRoles();
    expect(result).toEqual(mockRoles);
  });

  it('Debería retornar usuarios mapeados correctamente (cambiando _id por id)', async () => {
    const mockUsers = [{ _id: '1', username: 'sebas', roleId: 'admin1', isActive: true }];
    mockAccessRepo.fetchAllUsers.mockResolvedValue(mockUsers as any);

    const result = await accessService.getSystemUsers();

    expect(result[0]).toHaveProperty('id', '1');
    expect(result[0]).toHaveProperty('username', 'sebas');
  });

  it('Debería registrar un usuario encriptando su contraseña', async () => {
    const userData = { username: 'nuevo', password: '123', fullName: 'Nuevo User', roleId: 'rol1' };
    
    mockAccessRepo.fetchUserByUsername.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword' as never);
    mockAccessRepo.saveUser.mockImplementation(async (data) => data as any);

    const result: any = await accessService.registerUser(userData);

    expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
    expect(result.password).toBe('hashedPassword');
  });

  it('Debería lanzar error si el usuario ya existe', async () => {
    const userData = { username: 'existente', password: '123', fullName: 'User', roleId: 'rol1' };
    mockAccessRepo.fetchUserByUsername.mockResolvedValue({ _id: '1' } as any);

    await expect(accessService.registerUser(userData))
      .rejects.toThrow('El nombre de usuario ya existe');
  });

  it('Debería iniciar sesión y retornar el token JWT', async () => {
    const loginData = { username: 'sebas', password: '123' };
    const mockDbUser = { _id: '1', username: 'sebas', password: 'hashedPassword', roleId: { roleName: 'Admin' } };
    
    mockAccessRepo.fetchUserByUsername.mockResolvedValue(mockDbUser as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true as never);
    (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token' as never);

    const result = await accessService.loginUser(loginData);

    expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashedPassword');
    expect(result.token).toBe('fake-jwt-token');
  });
});