import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  writer: string;

  @Column({ length: 100, nullable: true })
  keyword: string;
}
