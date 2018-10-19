const load = async () => {
    console.log('loading');
    const ds = server.dataSources.db;
    console.log('done loading');

};

module.exports = {
    load,
};
