const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const equipType = sequelize.define('equipType', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: Sequelize.ENUM(['catraca', 'relogio', 'controleAcesso', 'peca', 'sirene']),
      allowNull: false,
    },
  })

  return equipType
}
