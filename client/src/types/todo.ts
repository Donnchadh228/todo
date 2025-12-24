export interface todoItemType {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  groupId: number | null;
}
