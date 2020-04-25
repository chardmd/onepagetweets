const AdminDAL = require('./adminDAL');

/**
 * GET /admin/dashboard
 */
exports.getAdmin = async (req, res) => {
  const userTotal = await AdminDAL.getUserCount();
  res.render('admin/client/admin', {
    title: 'Admin',
    userTotal
  });
};

/**
 * GET /users
 */
exports.getUsers = async (req, res) => {
  const users = await AdminDAL.getUsers();

  res.render('admin/client/users', {
    title: 'Users',
    users: users.map(i => ({
      id: i.id,
      name: i.profile.name,
      username: i.profile.username
    }))
  });
};

/**
 * DEL /admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await AdminDAL.deleteUserById(id);
  req.flash('info', {
    msg: `User has been deleted`
  });
  res.status(204).end();
};
