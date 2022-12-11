const crypto = require("crypto");

// constants
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;
const ENCRYPTION_LENGTH = 128;

// Private methods that are helper or utilites

/**
 * Whether the data is in a valid format (specific to DPK module)
 * @param {any} data 
 * @returns {boolean}
 */
function isValidData(data) {
  // We can customise it with our custom validations
  if (!data) return false;
  
  return true;
}

/**
 * Formats the data using custom logic (specific to DPK module)
 * @param {string | Buffer} data Data neeeds to be encrypted
 * @returns {string}
 */
function formatData(data) {
  // If required in future we can customize our data with custom formats
  if (!isValidData(data)) throw new Error("Invalid data provided for the encryption");

  return JSON.stringify(data);
}

/**
 * A factory function for encryption returning the types of encryption available
 */
encryptAlgorithm = () => {
  function symmetricEncryption(data, algorithm='sha3-512', format = 'hex') {
    if (!isValidData(data)) throw new Error("Invalid data provided for the encryption");
    
    const encryptedData = crypto.createHash(algorithm).update(data).digest(format);
    return encryptedData;
  }
  
  function asymmetricEncryption(data, privateKey, algorithm='sha3-512', format = 'hex') {
    // We can implement this if needed
    throw new Error("Method needs to be implemented")
  }
  
  
  const algorithms = {
    symmetricEncryption,
    asymmetricEncryption
  }
  
  return algorithms;
}

/* ==================================================== EXPOSED/PUBLIC METHODS ========================================================================== */
// Public methods of a module that needs to be exported

exports.deterministicPartitionKey = (event) => {
  const { symmetricEncryption } = encryptAlgorithm();
  let candidate = event;

  if (event && typeof event === 'object') {
    // Possibilities that event object may be tampered and have a property hasOwnProperty or partitionKey in it's parent
    if (Object.prototype.hasOwnProperty.call(event, 'partitionKey')) {
      candidate = event.partitionKey;
    }
  }

  // Formatting candidate
  if (!candidate) return TRIVIAL_PARTITION_KEY;
  else if (typeof candidate !== "string") {
    candidate = formatData(candidate);
  }

  // Encrypting candidate
  if (candidate.length > MAX_PARTITION_KEY_LENGTH || candidate.length !== ENCRYPTION_LENGTH) {
    candidate = symmetricEncryption(candidate);
  }
  return candidate;
};

module.exports.ENCRYPTION_LENGTH = ENCRYPTION_LENGTH