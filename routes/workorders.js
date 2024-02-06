"use strict";

/** Routes for Service Table in 'wop' Database. */



const express = require("express");
const router = new express.Router();
const WorkOrders = require("../models/workorders");
const { BadRequestError } = require("../expressError");

/** GET /  =>
 * 
 *  Returns { allWorkOrders: [ { id, date, service_type, po_number, invoice_number, uri, companyName }, ...] }
 * 
 * Authorization required: admin
 */
router.get("/", async function (req, res, next) {
    try {
      const allWorkOrders = await WorkOrders.findAll();
      return res.json({ allWorkOrders });
    } catch (err) {
      return next(err);
    }
  });

/** Post /  =>
 * 
 *  Returns { allWorkOrders: [ { id, date, service_type, po_number, invoice_number, uri, companyName }, ...] }
 * 
 * Authorization required: admin
 */
router.post("/", async function (req, res, next) {
  try {
    const allWorkOrders = await WorkOrders.findAll();
    return res.json({ allWorkOrders });
  } catch (err) {
    return next(err);
  }
});




  module.exports = router;