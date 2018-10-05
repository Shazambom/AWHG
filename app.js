let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let helloRouter = require('./routes/hello');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://'+ fixHostPort(req.headers.host) + req.url);
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/hello', helloRouter);
/**
 * Fixes the ports for a host
 */
function fixHostPort(host) {
    let splHost = host.split(":");
    let url = splHost[0];

    if (splHost.length > 1) {
        switch (parseInt(splHost[1])) {
            case 8080:
                return url + ":" + 8443;
            case 80:
                return url + ":" + 443;
            default:
                return url;
        }
    } else {
        return url;
    }
}

module.exports = app;
