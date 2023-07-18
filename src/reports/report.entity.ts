import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number; // 10000

  @Column()
  make: string; // Toyota, Ford

  @Column()
  model: string; // Yaris, Fiesta

  @Column()
  year: number; // 2020, 2019

  @Column()
  lng: number; // longitude

  @Column()
  lat: number; // latitude

  @Column()
  mileage: number; // 10000
}
