const server = require('../server');
const ds = server.dataSources.db;

const create = function create() {
    let tables = new Set();

    // create a list of unique model names
    Object.keys(server.models).map((key) => {
        const model = server.models[key];
        tables.add(model.name);
    });

    // convert model names to
    tables = Array.from(tables);

    try {
        ds.autoupdate(tables, function(err) {
            if (err) {
                throw err;
            }

            // eslint-disable-next-line no-console
            console.log('Tables [' + tables + '] created in ', ds.adapter.name);

            ds.disconnect();
        });
    } catch (err) {
        console.error(err);
    }

    return tables;
};

module.exports = {
    create,
};
