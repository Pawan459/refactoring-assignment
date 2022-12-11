const { deterministicPartitionKey, ENCRYPTION_LENGTH } = require("./dpk");

describe("deterministicPartitionKey", () => {
  describe("Happy path", () => {
    it("Returns the literal '0' when given no input", () => {
      const trivialKey = deterministicPartitionKey();
      expect(trivialKey).toBe("0");
    });
    it("Returns the encrypted string for an valid event passed", () => {
      // Arrange
      const events = [
        {
          partitionKey: 12
        },
        {
          partitionKey: [12]
        },
        {
          hasOwnProperty: [12]
        },
        {} // empty event
      ]
      
      // Act
      const keys = events.map(event => deterministicPartitionKey(event));
      
      // Assert
      keys.forEach(key => expect(key.length).toBe(ENCRYPTION_LENGTH))
    })
  })
  describe("Should work for event of not object type", () => {
    it("Returns the '0' for an event with falsy value passed", () => {
      // Arrange
      const events = [
        0,
        false,
        null,
        undefined
      ]
      
      // Act
      const keys = events.map(event => deterministicPartitionKey(event));
      
      // Assert
      keys.forEach(key => expect(key).toBe("0"))
    })
    it("Returns the encrypted string for an event with truthy value passed", () => {
      // Arrange
      const events = [
        1,
        "Hi There",
      ]
      
      // Act
      const keys = events.map(event => deterministicPartitionKey(event));
      
      // Assert
      keys.forEach(key => expect(key.length).toBe(ENCRYPTION_LENGTH))
    })
    it("Returns the encrypted string of valid length for event with string length greater than 256", () => {
      // Arrange
      const events = [
        'ca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efaca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efaca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efa',
        "cca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efaa2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb5ca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efa31231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efa",
      ]
      
      // Act
      const keys = events.map(event => deterministicPartitionKey(event));
      
      // Assert
      keys.forEach(key => expect(key.length).toBe(ENCRYPTION_LENGTH))
    })
  })
});
