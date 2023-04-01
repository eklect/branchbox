const path         = require('path');
const express      = require('express');
const fs           = require('fs');
const childProcess = require('child_process');
const bodyParser   = require('body-parser')
const socketio     = require("socket.io");
const app          = express();
const port         = 3000;

// eslint-disable-next-line no-undef
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) =>
        res.sendFile(path.join(__dirname, '../dist', 'index.html'))
);

//API Calls
app.get('/api/getContainers', (req, res) => {
    getContainerList(res);
});

app.post('/api/createImage', (req, res) => {
    let params = req.body;
    createImage(params, res);

});
app.post('/api/startContainer', (req, res) => {
    startContainer(res);

});

app.post('/api/sendCommand', (req, res) => {
    let params      = req.body;
    let command     = params.command;
    let commandArgs = params.commandArgs;
    let x           = childProcess.spawn(command, commandArgs);
    x.stdout.on('data', (data) => {
        if (data.toString()) {
            io.emit('buildProgress', data.toString());
        }
    });
    x.stdout.on('close', (data) => {
        io.emit('buildProgress', "Command Complete!");
        res.send('Command Complete');

    });
})

//Last Route. Automatically send 404
app.get('*', (req, res) => {
    res.redirect('/');

});

//Main Web Server
const webServer = app.listen((port), () =>
        console.log(`Branch Box Server listening on http://localhost:${port}`)
);

//Socket Server
const io = socketio(webServer);
io.on('connection', (socket) => {
});
io.on('disconnect', (socket) => {
});

function createImage(params, res) {
    let branch            = params.branch;
    let clearCache        = params.clearCache;
    let dockerComposeFile = null;
    let dockerPath        = path.join(__dirname, '../docker/');
    fs.readdirSync(dockerPath).forEach((file) => {
        if (file.indexOf('.yml') > -1) {
            dockerComposeFile = file;
        }
    });

    // let command = `docker-compose -f ` + dockerPath + dockerComposeFile + ` build --progress=plain --build-arg BRANCH=` + branch;
    let command     = 'docker-compose';
    let commandArgs = ['-f', dockerPath + dockerComposeFile, 'build', '--progress=plain', '--build-arg', 'BRANCH=' + branch, (clearCache ? '--no-cache' : '')];
    let x           = childProcess.spawn(command, commandArgs);
    x.stdout.on('data', (data) => {
        io.emit('buildProgress', data.toString());
    });
    x.stdout.on('close', (data) => {
        io.emit('buildProgress', "Image Build Complete!");
        io.emit('buildComplete', true);
        res.send('Image Created!');

    });

}

function startContainer(res) {
    let dockerComposeFile = null;
    let dockerPath        = path.join(__dirname, '../docker/');
    fs.readdirSync(dockerPath).forEach((file) => {
        if (file.indexOf('.yml') > -1) {
            dockerComposeFile = file;
        }
    });

    let command     = 'docker-compose';
    let commandArgs = ['-f', dockerPath + dockerComposeFile, 'up', '-d'];
    let x           = childProcess.spawn(command, commandArgs);
    x.stdout.on('data', (data) => {
        console.log(data.toString());
        io.emit('buildProgress', data.toString());
    });
    x.stdout.on('close', (data) => {
        io.emit('buildProgress', "Container Started!");
        res.send('Conatiner Started');

    })
}

function getContainerList(res) {

    let command        = 'docker';
    let commandArgs    = ['ps', '-a', '--format', '"{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}"'];
    let x              = childProcess.spawn(command, commandArgs);
    let headers        = [
        {
            title: 'ID',
            key  : 'id',
        },
        {
            title: 'Name',
            key  : 'name',
        },
        {
            title: 'Image',
            key  : 'image',
        },
        {
            title: 'Status',
            key  : 'status',
        }
    ];
    let returnData     = {
        headers   : headers,
        containers: [],
    };
    returnData.headers = headers;
    x.stdout.on('data', (data) => {
        let output     = data.toString();
        let containers = output.split('\n');
        containers.map((container) => {
            container        = container.replace(/"/g, '');
            let containerArr = container.split('|');
            let containerRow = {};
            containerArr.forEach((item, index) => {
                let headerName           = headers[index].key;
                containerRow[headerName] = item.trim();
            });

            returnData.containers.push(containerRow);
        });

        io.emit('containerListUpdated', returnData);
        res.send(returnData);

    });

}
