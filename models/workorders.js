"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");

/** Related functions for Work Orders. */

class WorkOrders {

  /** Find all invoices ().
   *
   * Returns [{ id, date, amount, service_type, file_url, job_po_number, companyName }, ...]
   * */

  static async findAll() {
    let query = await db.query(
      `SELECT s.id,
      s.date,
      s.service_type,
      s.po_number,
      s.invoice_number,
      s.pdf_file_id,
      c.name AS "companyName"
        FROM service s 
        LEFT JOIN companies AS c ON c.id = s.company_id`);
    let allWorkOrders = query.rows;
return allWorkOrders
  }

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

module.exports = WorkOrders;