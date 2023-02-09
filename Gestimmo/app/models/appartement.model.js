const mysql = require("mysql2");
const dbConfig = require("../config/config");
// constructor
const Appartement = function (appartement) {
    this.id = appartement.id;
    this.num = appartement.num;
    this.superficie = appartement.superficie;
    this.descrip = appartement.descrip;
};
// connecting on each request so the server will start without a db connection, plus
//   a simple mechanism enabling the app to recover from a momentary missing db connection
Appartement.dbConnect = () => {
    const connection = mysql.createConnection({
        host: dbConfig.APP_DB_HOST,
        user: dbConfig.APP_DB_USER,
        password: dbConfig.APP_DB_PASSWORD,
        database: dbConfig.APP_DB_NAME
    });
    connection.connect(error => {
        if (error) {
            console.log("Error connecting to Db")
            throw error;
        }
        console.log("Successfully connected to the database.");
    });
    return connection;
}

Appartement.create = (newappartement, result) => {
    const dbConn = Appartement.dbConnect();
    dbConn.query("INSERT INTO appartements SET ?", newappartement, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created appartement: ", {id: res.insertId, ...newappartement});
        result(null, {id: res.insertId, ...newappartement});
    });
};

Appartement.getAll = result => {
    const dbConn = Appartement.dbConnect();
    dbConn.query("SELECT * FROM appartements", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("appartements: ", res);
        result(null, res);
    });
};

Appartement.findById = (appartementId, result) => {
    const dbConn = Appartement.dbConnect();
    dbConn.query(`SELECT * FROM appartements WHERE id = ${appartementId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found appartement: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

Appartement.updateById = (id, appartement, result) => {
    const dbConn = Appartement.dbConnect();
    dbConn.query(
        "UPDATE appartements SET num = ?, superficie = ?, descrip = ? WHERE id = ?",
        [appartement.num, appartement.superficie, appartement.descrip, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                result({kind: "not_found"}, null);
                return;
            }
            console.log("updated appartement: ", {id: id, ...appartement});
            result(null, {id: id, ...appartement});
        }
    );
};

Appartement.delete = (id, result) => {
    const dbConn = Appartement.dbConnect();
    dbConn.query("DELETE FROM appartements WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows === 0) {
            result({kind: "not_found"}, null);
            return;
        }
        console.log("deleted appartement with id: ", id);
        result(null, res);
    });
};

Appartement.removeAll = result => {
    const dbConn = Appartement.dbConnect();
    dbConn.query("DELETE FROM appartements", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log(`deleted ${res.affectedRows} appartements`);
        result(null, res);
    });
};

module.exports = Appartement;