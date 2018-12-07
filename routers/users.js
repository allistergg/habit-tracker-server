'use strict';

const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user')
const {Day} = require('../models/habits-days')

const router = express.Router();

router.post('/', (req, res, next) => {
  let {username, password, passwordConfirm } = req.body;
  const requiredFields = ['username', 'password', 'passwordConfirm'];
  const missingField = requiredFields.find(field => !(field in req.body));
  

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['username', 'password', 'passwordConfirm'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password', 'passwordConfirm'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
     max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `${tooSmallField} Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  if (password !== passwordConfirm) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Passwords do not match'
    })
  }



  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        
      };
      return User.create(newUser);
    })
    .then(result => {
        console.log(result)
        Day.create([
            {"date" : "0", "habits" : [], "userId" : `${result._id}`},
            {"date" : "1", "habits" : [], "userId" : `${result._id}`},
            {"date" : "2", "habits" : [], "userId" : `${result._id}`},
            {"date" : "3", "habits" : [], "userId" : `${result._id}`},
            {"date" : "4", "habits" : [], "userId" : `${result._id}`},
            {"date" : "5", "habits" : [], "userId" : `${result._id}`},
            {"date" : "6", "habits" : [], "userId" : `${result._id}`}
        ]);
        return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;