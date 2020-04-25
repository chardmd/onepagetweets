const admin = require('express').Router();
const adminController = require('./adminController');
const middlewareUtil = require('../utils/middleware');

admin.get('/admin/dashboard', middlewareUtil.isAdmin, adminController.getAdmin);
admin.get('/admin/users', middlewareUtil.isAdmin, adminController.getUsers);
admin.delete(
  '/admin/users/:id',
  middlewareUtil.isAdmin,
  adminController.deleteUser
);

module.exports = admin;
