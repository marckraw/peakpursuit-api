import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usr') // Just because 'user' is a reserved word in Postgres
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id, ' and email ', this.email);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id, ' and email ', this.email);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id, ' and email ', this.email);
  }
}
