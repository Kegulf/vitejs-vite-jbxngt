export class MyCommonClass {
  private readonly some_class_field: string | undefined;

  constructor() {
    this.some_class_field = 'Hello world';
  }

  getSomeClassField() {
    return this.some_class_field;
  }
}
