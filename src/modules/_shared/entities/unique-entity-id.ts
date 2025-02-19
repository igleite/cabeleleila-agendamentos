export class UniqueEntityID {
  public readonly value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? crypto.randomUUID() // Usa a API nativa do browser
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
