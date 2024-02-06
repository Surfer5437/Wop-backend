"use strict";

const db = require("../db");
const Crypter = require("../helpers/hashing");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const Company = require("./companies");

/** Related functions for users. */

class User {

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/
  static async findAll() {

    const users = await db.query(
      `SELECT 
              id,
              username, 
              email, 
              is_admin
          FROM 
              users`
    );

    return users.rows;
  }

  /** Given a username, return data about user.
     *
     * Returns { username, email, comapny_id, is_admin, companies }
     *
     * Throws NotFoundError if user not found.
     **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT id,
                  username,
                  email,
                  is_admin
           FROM users
           WHERE username = $1`,
      [username],
    );
    let user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const companyRes = await db.query(
      `SELECT name,
                address,
                contact_name,
                phone_number,
                tax_id,
                user_id
         FROM companies
         WHERE user_id = $1`,
      [user.id]);

    const company = companyRes.rows[0];
    delete company.user_id;
    user.company = company;
    return user;
  };

  /** Create a User (from data), update db, return new user data.
     *
     * data should be { id |  username      |      email       | is_admin }
     *
     * Returns { id |  username  |      email       | is_admin }
     *
     * Throws BadRequestError if user_name name already in database.
     * */

  static async create({ id, company_name, username, password, email }) {

    const duplicateCheck = await db.query(
      `SELECT username
             FROM users
             WHERE username = $1`,
      [username]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Username already used: ${username}`);

    const result = await db.query(
      `INSERT INTO users
             (username, password, email, is_admin)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email`,
      [
        username,
        password,
        email,
        false
      ],
    );


    const companyResult = await db.query(
      `UPDATE companies SET user_id = $1 WHERE id = $2 RETURNING name, user_id`, [result.rows[0].id, id]);
    await Company.registerUserForCompany(company_name, null)
    return companyResult.rows[0];
  }
}

module.exports = User;
