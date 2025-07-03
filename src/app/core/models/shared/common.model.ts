export class CommonModel {
  isCheck?: boolean;
  id!: number;
  name!: string;
  code?: string;
  description?: string;
}


export class SuccessResponse {
  isSuccess!: boolean;
  message: string | null = '';
}