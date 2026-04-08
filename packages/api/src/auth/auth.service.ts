import { Injectable, ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, CreateAdminDto } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.role === Role.admin_a || dto.role === Role.admin_b) {
      throw new ForbiddenException('Admin accounts must be created by Admin-A');
    }
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name, role: dto.role },
    });
    return { token: this.signToken(user.id, user.email, user.role), user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { token: this.signToken(user.id, user.email, user.role), user: this.sanitize(user) };
  }

  async createAdmin(dto: CreateAdminDto) {
    if (dto.role !== Role.admin_a && dto.role !== Role.admin_b) {
      throw new ForbiddenException('Only admin roles allowed');
    }
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name, role: dto.role },
    });
    return this.sanitize(user);
  }

  private signToken(id: number, email: string, role: Role) {
    return this.jwt.sign({ sub: id, email, role });
  }

  private sanitize(user: { id: number; email: string; name: string; role: Role }) {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
