import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './banco.sqlite',
  logging: false 
});

const Treino = sequelize.define('Treino', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duracao: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  distancia: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

const Serie = sequelize.define('Serie', {
  repeticoes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  carga: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

Treino.hasMany(Serie, { as: 'series', onDelete: 'CASCADE' });
Serie.belongsTo(Treino);

export { sequelize, Treino, Serie };
