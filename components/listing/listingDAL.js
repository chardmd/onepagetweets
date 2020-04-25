const Project = require('../../models/Project');
const User = require('../../models/User');

exports.getProjectByUserId = async userId => Project.findOne({ user: userId });

exports.getProjectByUserName = async username => {
  const user = await User.findOne({ 'profile.username': username });
  if (user) {
    return Project.findOne({ user: user.id, isPublished: true });
  }
};
