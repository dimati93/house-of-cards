var apiMachinesRouter = require('./api/machines');

module.exports = app => {
    app.use('/api/machines', apiMachinesRouter);
}