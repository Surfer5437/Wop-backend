"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
class Company {

  /** Find all companies
   * Returns [{ id, name, address, contact_name, phone_number, tax_id }, ...]
   * */
  static async findAll() {
    let query = await db.query(
      `SELECT id, name, address, contact_name, phone_number, tax_id, user_id, email
                     FROM companies`
    );
    return query.rows;
  }

  /** Create a company (from data), update db, return new company data.
     *
     * data should be { name, address, contact_name, phone_number, tax_id }
     *
     * Returns { id, name, address, contact_name, phone_number, tax_id }
     *
     * Throws BadRequestError if company name already in database.
     * */

  static async create({ name, address, contact_name, phone_number, tax_id, email }) {
    const duplicateCheck = await db.query(
      `SELECT name
           FROM companies
           WHERE name = $1`,
      [name]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${name}`);

    const result = await db.query(
      `INSERT INTO companies
           (name, address, contact_name, phone_number, tax_id, email)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, name, address, contact_name, phone_number, tax_id, email`,
      [
        name,
        address,
        contact_name,
        phone_number,
        tax_id,
        email
      ],
    );
    return result.rows[0];
  }

  /** Update company data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {name, address, contact_name, phone_number, tax_id, user_id}
     *
     * Returns {handle, name, address, contact_name, phone_number, tax_id, user_id}
     *
     * Throws NotFoundError if not found.
     */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data);
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                    SET ${setCols} 
                    WHERE id = ${handleVarIdx} 
                    RETURNING id,
                    name,
                    address,
                    contact_name,
                    phone_number,
                    tax_id`;
    const result = await db.query(querySql, [...values, id]);
    const company = result.rows[0];
    if (!company) {
      throw new NotFoundError(`No company: ${id}`)
    } else {
      return company;
    };
  }


  static async registerUserForCompany(name, tag) {
    const querySql = `UPDATE companies 
                    SET register_link = $1
                    WHERE name = $2
                    RETURNING id,
                    name,
                    register_link`;
    const result = await db.query(querySql, [tag, name]);
    console.log(result.rows[0]);

  }

  static async hasCurrentUser(name) {
    const result = await db.query(
      `SELECT user_id
                    FROM companies
                    WHERE name = $1`,
      [name]
    );
    if (result.rows[0].user_id) {
      const userRes = await db.query(
        `SELECT username
             FROM users
             WHERE id = $1`,
        [result.rows[0].user_id],
      );
      let username = userRes.rows[0].username;
      throw new BadRequestError(`${name} has a user registered already with the username of ${username}`)
    } else {
      return false;
    }

  }


  static async getCompanyByRegistrationLink(tag) {
    const result = await db.query(
      `SELECT id, name AS company_name, email
           FROM companies
           WHERE register_link = $1`,
      [tag]);
    if (!result) {
      throw new NotFoundError(`Registration link not valid.`)
    } else {
      return result.rows[0];
    }
  }



  /** Given a company id number, return data about company.
     *
     * Returns { name, address, contact_name, phone_number, tax_id, and user of the company}
     *   where user is [{ id, username, email, is_admin }, ...]
     *
     * Throws NotFoundError if not found.
     **/

  static async get(id) {
    const companyRes = await db.query(
      `SELECT name,
                address,
                contact_name,
                phone_number,
                tax_id,
                user_id,
                email
         FROM companies WHERE id = $1`,
      [id]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${id}`);
    if (!company.user_id) return company;
    const user = await db.query(
      `SELECT id, username, email, is_admin
         FROM users
         WHERE id = $1`,
      [company.user_id],
    );

    company.user = user.rows;
    delete company.user_id;
    return company;
  }
};

module.exports = Company;
