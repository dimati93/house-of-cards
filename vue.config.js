var configureAPI = require('./src/server/api')

module.exports = {
    devServer: {
        before: configureAPI
    },    
}