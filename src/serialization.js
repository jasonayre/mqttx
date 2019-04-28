export class Serialization {
  static serialize(message) { return JSON.stringify(message) }
  static parse(message) { return JSON.parse(message.toString()) }
}
