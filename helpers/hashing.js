const bcrypt = require('bcryptjs');
const { SALT } = require('../config');
const crypto = require('crypto');
class Crypter {

    static async encrypt() {

        const plaintextPassword = 'user_password';


        // Hash the password with the salt
        const hashedPassword = bcrypt.hashSync(plaintextPassword, SALT);

        console.log('Hashed Password:', hashedPassword);
    }

    static async compareCrypt() {
        const plaintextPassword = 'user_password';

        // Hash the password with the salt
        const hashedPassword = bcrypt.hashSync(plaintextPassword, SALT);

        // Compare hashed password with plaintext password
        const isMatch = bcrypt.compareSync(plaintextPassword, hashedPassword);
        console.log('Hashed Password:', hashedPassword);

        console.log('Password Match:', isMatch);
        return ({ isMatch, hashedPassword })
    }

    static async generateRegistrationLink(companyName) {
        // Replace any periods, spaces or slashes in the company name
        const sanitizedCompanyName = companyName.replace(/[./ ]/g, '');
        // Create a unique token using a combination of company name and a random value
        const token = crypto.randomBytes(16).toString('hex');

        // Combine the company name and token
        const registrationLink = `${sanitizedCompanyName}-${token}`;

        return registrationLink;
    }
}
module.exports = Crypter;


