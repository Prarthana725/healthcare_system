const { getConnection } = require("./db/sqlConnection");

(async () => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM patients");
        console.log(result.recordset);
    } catch (err) {
        console.log(err);
    }
})();