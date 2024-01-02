"use strict";

/** Routes for Company Table in 'wop' Database. */

const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();
const Company = require("../models/companies");
const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");
const { BadRequestError } = require("../expressError");

/** GET /  =>
 * 
 *  Returns { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 * 
 * Authorization required: admin
 */
router.get("/", async function (req, res, next) {
    try {
      const companies = await Company.findAll();
      return res.json({ companies });
    } catch (err) {
      return next(err);
    }
  });

  /** GET /[handle]  =>  { company }
 *
   * Returns { name, address, contact_name, phone_number, tax_id, and user of the company}
   *   where user is [{ id, username, email, is_admin }, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    
    const company = await Company.get(req.params.id);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

  /** POST / { company } =>  { company }
 *
 * company should be { name, address, contact_name, phone_number, tax_id }
 *
 * Returns { name, address, contact_name, phone_number, tax_id }
 *
 * Authorization required: admin
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, address, contact_name, phone_number, tax_id, user_id }
 *
 * Returns { name, address, contact_name, phone_number, tax_id, user_id }
 *
 * Authorization required: admin ensureAdmin,
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.id, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

  

module.exports = router;