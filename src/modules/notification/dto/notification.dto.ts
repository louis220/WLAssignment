export enum ContentType {
  Comment = 'comment',
  Board = 'board',
}

export class ContentCreatedDto {
  type: ContentType;
  content: string;
  id: number;
}
