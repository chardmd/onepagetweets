const User = require('../../models/User');
const Project = require('../../models/Project');

exports.getUserCount = () => User.count();

exports.getUsers = () =>
  User.find({}).sort({
    createdAt: -1
  });

exports.deleteUserById = async (id) => {
  const { deletedCount } = await User.deleteOne({
    _id: id
  });
  if (deletedCount === 1) {
    await Project.deleteMany({ user: id });
  }
};
