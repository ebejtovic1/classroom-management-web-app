const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19","root","root",{port: 3308, host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.osoblje = sequelize.import(__dirname+'/osoblje.js');
db.rezervacija = sequelize.import(__dirname+'/rezervacija.js');
db.sala = sequelize.import(__dirname+'/sala.js');
db.termin = sequelize.import(__dirname+'/termin.js');

//osoblje rezervacija jedan na vise
db.osoblje.hasMany(db.rezervacija,{foreignKey:'osoba'});
db.rezervacija.belongsTo(db.osoblje, {foreignKey:'osoba'});

//termin rezervacija 1 na 1 ?OKEJ
db.termin.hasOne(db.rezervacija, {foreignKey:{name:'termin',unique:true, type:Sequelize.INTEGER}});
db.rezervacija.belongsTo(db.rezervacija, {foreignKey:{name:'termin',unique:true, type:Sequelize.INTEGER}});


//vise na 1 sala rezervacija
db.sala.hasMany(db.rezervacija,{foreignKey:'sala'});
db.rezervacija.belongsTo(db.sala, {foreignKey:'sala', as: 'ascSala'});


//1 na 1 sala-osoblje
db.osoblje.hasOne(db.sala, {foreignKey:'zaduzenaOsoba'});
db.sala.belongsTo(db.osoblje, {foreignKey:'zaduzenaOsoba'});

module.exports=db;
