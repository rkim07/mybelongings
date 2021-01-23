export interface Action<T> {
  run(): Promise<T>;
}
