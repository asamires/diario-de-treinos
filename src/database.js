import { Sequelize, DataTypes } from 'sequelize';

// Cria a conexão apontando para um arquivo local chamado banco.sqlite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './banco.sqlite',
  logging: false // Desliga o spam de SQL no terminal para manter o log limpo
});

// Modelo 1: Tabela de Treinos
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

// Modelo 2: Tabela de Séries
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

// Relacionamento 1:N (Um Treino possui várias Séries)
Treino.hasMany(Serie, { as: 'series', onDelete: 'CASCADE' });
Serie.belongsTo(Treino);

export { sequelize, Treino, Serie };
