// server/models/Event.js

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    userId: DataTypes.INTEGER,
    createdByAdmin: DataTypes.BOOLEAN,
  });
  return Event;
};