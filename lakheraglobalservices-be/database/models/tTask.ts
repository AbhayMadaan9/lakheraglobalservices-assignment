import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import tUser from "./tUser";

@Entity({ name: "tTask", schema: "public" })
export default class Task {
  constructor(title: string, description: string, userId: tUser) {
    this.title = title;
    this.description = description;
    this.user = userId;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ default: new Date() })
  updatedAt: Date;

  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  @ManyToOne(() => tUser, (user) => user.id)
  user: tUser;
}
