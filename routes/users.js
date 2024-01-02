"use strict";

const express = require("express");

const User = require("../models/users");
const { BadRequestError } = require("../expressError");
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

module.exports = router;
