"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

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

static async create({ data }) {
 
  // const duplicateCheck = await db.query(
  //       `SELECT username
  //        FROM companies
  //        WHERE name = $1`,
  //     [name]);

  // if (duplicateCheck.rows[0])
  //   throw new BadRequestError(`Duplicate company: ${name}`);

  // const result = await db.query(
  //       `INSERT INTO companies
  //        (name, address, contact_name, phone_number, tax_id)
  //        VALUES ($1, $2, $3, $4, $5)
  //        RETURNING id, name, address, contact_name, phone_number, tax_id`,
  //     [
  //       name,
  //       address, 
  //       contact_name, 
  //       phone_number, 
  //       tax_id
  //     ],
  // );
  // return result.rows[0];
}

}

module.exports = User;
