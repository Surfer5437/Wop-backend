"use strict";

const express = require("express");
const Crypter = require("../helpers/hashing");

const User = require("../models/users");
const { BadRequestError } = require("../expressError");
const Company = require("../models/companies");
const router = new express.Router();

/** GET / => { users: [ {id, username, email, is_admin }, ... ] }
 *
 * Returns list of all users.
 *
 **/

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
*
* Returns { username, firstName, lastName, isAdmin, company }
*   where company is { name, address, contact_name, phone_number, tax_id }
*
* Authorization required: admin or same user-as-:username
**/

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
*
* Returns { username, firstName, lastName, isAdmin, company }
*   where company is { name, address, contact_name, phone_number, tax_id }
*
* Authorization required: admin or same user-as-:username
**/

router.post("/registeruser", async function (req, res, next) {
  try {
    const company = await User.create(req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

router.post("/sendRegistrationEmailForNewUser", async function (req, res, next) {
  try {
    const haveCurrentUser = await Company.hasCurrentUser(req.body.name)
    if (!haveCurrentUser) {
      const originUrl = req.headers.origin || `${req.headers.host}`
      const randomizedCompanyLink = await Crypter.generateRegistrationLink(req.body.name);
      const fullRegistrationLink = `${originUrl}/users/register/${randomizedCompanyLink}`
      await Company.registerUserForCompany(req.body.name, randomizedCompanyLink)
      return res.json(fullRegistrationLink);
    }

  } catch (err) {
    return next(err);
  }
});

router.post("/getRegistraionCompanyInfo", async function (req, res, next) {
  try {
    console.log(req.body);
    const company = await Company.getCompanyByRegistrationLink(req.body.info)
    return res.json(company);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
