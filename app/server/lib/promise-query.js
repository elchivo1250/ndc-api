// Util.promisify doesn't seem to work with the connection's query method
module.exports = (conn, sql, params) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, params, (err, res) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            return resolve(res);
        });
    });
};
