const User = require('./User');
const Group = require('./Group');
const Item = require('./Item');


Group.hasMany(User, {
  foreignKey: 'group_id',
});




User.hasMany(Item, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});





Item.belongsTo(User, {
  foreignKey: 'user_id'
});