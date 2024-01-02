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
          `SELECT id, name, address, contact_name, phone_number, tax_id, user_id
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

static async create({ name, address, contact_name, phone_number, tax_id, user_id }) {
    const duplicateCheck = await db.query(
          `SELECT name
           FROM companies
           WHERE name = $1`,
        [name]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${name}`);

    const result = await db.query(
          `INSERT INTO companies
           (name, address, contact_name, phone_number, tax_id, user_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, name, address, contact_name, phone_number, tax_id`,
        [
          name,
          address, 
          contact_name, 
          phone_number, 
          tax_id,
          user_id
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
                    tax_id,
                    user_id`;
  const result = await db.query(querySql, [...values, id]);
const company = result.rows[0];
  if (!company) {
    throw new NotFoundError(`No company: ${id}`)
  } else {
  return company;
  };    
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
                user_id
         FROM companies
         WHERE id = $1`,
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
