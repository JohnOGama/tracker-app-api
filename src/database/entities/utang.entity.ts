import {
  SchemaConstants,
  TableNames,
} from 'src/common/constants/database.constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity({ name: `${TableNames.UTANG}`, schema: `${SchemaConstants.NAME}` })
export class Utang {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column({
    name: 'uid',
    unique: true,
    generated: 'uuid',
  })
  uid: string;

  @Column({
    name: 'title',
  })
  title: string;

  @Column({
    name: 'description',
  })
  description: string;

  @Column({
    name: 'price',
  })
  price: number;

  @Column({
    name: 'borrower_name',
    nullable: true,
  })
  borrower_name: string;

  @CreateDateColumn({ name: 'created_at', default: 'now()', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ name: 'modified_at', nullable: true, onUpdate: 'now()' })
  modified_at: Date;

  @ManyToOne(() => User, (user) => user.utang)
  user: User;
}
