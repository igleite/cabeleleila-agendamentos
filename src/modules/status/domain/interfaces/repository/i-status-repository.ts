export interface IStatusRepository {
  status(): Promise<string>
}
