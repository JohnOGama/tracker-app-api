import { Exclude } from 'class-transformer';
import {
  SchemaConstants,
  TableNames,
} from 'src/common/constants/database.constant';
import { UserRole } from 'src/common/enums/user-role.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Utang } from './utang.entity';

@Entity({ name: `${TableNames.USERS}`, schema: `${SchemaConstants.NAME}` })
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column({
    name: 'uid',
    unique: true,
    generated: 'uuid',
  })
  uid: string;

  @Column({
    name: 'full_name',
    nullable: false,
  })
  full_name: string;

  @Column({
    name: 'email',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    nullable: true,
  })
  password: string;

  @Column({ name: 'role', nullable: false })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at', default: 'now()', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ name: 'modified_at', nullable: true, onUpdate: 'now()' })
  modified_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date;

  @Column({
    name: 'access_token',
    nullable: true,
  })
  access_token: string;

  @OneToMany(() => Utang, (utang) => utang.user)
  utang: Utang[];
}
