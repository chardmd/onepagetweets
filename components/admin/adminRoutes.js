const admin = require('express').Router();
const adminController = require('./adminController');
const middleware = require('../utils/middleware');

admin.get('/admin/dashboard', middleware.isAdmin, adminController.getAdmin);
admin.get('/admin/users', middleware.isAdmin, adminController.getUsers);
admin.delete(
  '/admin/users/:id',
  middleware.isAdmin,
  adminController.deleteUser
);

module.exports = admin;
