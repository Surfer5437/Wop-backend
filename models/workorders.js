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
      p.uri,
      c.name AS "companyName"
        FROM service s 
        LEFT JOIN companies AS c ON c.id = s.company_id
        LEFT JOIN pdf_file AS p ON p.id = s.pdf_file_id`);
    let allWorkOrders = query.rows;
return allWorkOrders
  }




}

module.exports = WorkOrders;