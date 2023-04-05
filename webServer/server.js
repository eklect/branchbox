const path         = require('path');
const express      = require('express');
const fs           = require('fs');
const childProcess = require('child_process');
const bodyParser   = require('body-parser')
const socketio     = require("socket.io");
const app          = express();
const port         = 3000;
const command      = 'docker';

const serverTitle = `
██████╗ ██████╗  █████╗ ███╗   ██╗ ██████╗██╗  ██╗    ██████╗  ██████╗ ██╗  ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔════╝██║  ██║    ██╔══██╗██╔═══██╗╚██╗██╔╝
██████╔╝██████╔╝███████║██╔██╗ ██║██║     ███████║    ██████╔╝██║   ██║ ╚███╔╝ 
██╔══██╗██╔══██╗██╔══██║██║╚██╗██║██║     ██╔══██║    ██╔══██╗██║   ██║ ██╔██╗ 
██████╔╝██║  ██║██║  ██║██║ ╚████║╚██████╗██║  ██║    ██████╔╝╚██████╔╝██╔╝ ██╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
                                                                               `;

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
    createImage(req.body, res);

});

//Docker Container API Calls
app.post('/api/startContainer', (req, res) => {
    startContainer(req.body, res);

});
app.post('/api/stopContainer', (req, res) => {
    stopContainer(req.body, res);

});
app.post('/api/destroyContainer', (req, res) => {
    destroyContainer(req.body, res);

});

app.post('connectToContainer', (req, res) => {
    let params = req.body;
    // connectToContainer(params, res);
});

//Docker SSH API Calls
app.post('/api/sendCommand', (req, res) => {
    let params = req.body;
    sendCommand(params, res);

})

//Last Route. Automatically send 404
app.get('*', (req, res) => {
    res.redirect('/');

});

//Main Web Server
const webServer = app.listen((port), () => {

    console.log(serverTitle);
    console.log(`Branch Box Server listening on http://localhost:${port}`);
});

//Socket Server
const io = socketio(webServer);
io.on('connection', (socket) => {
});
io.on('disconnect', (socket) => {
});

//Function Definitions
function createImage(params, res) {
    let branch            = params.branch;
    let profile           = params.profileName;
    let clearCache        = params.clearCache;
    let dockerComposeFile = null;
    let dockerPath        = path.join(__dirname, '../docker/');
    fs.readdirSync(dockerPath).forEach((file) => {
        if (file.indexOf('.yml') > -1) {
            dockerComposeFile = file;
        }
    });

    // let command = `docker-compose -f ` + dockerPath + dockerComposeFile + ` build --progress=plain --build-arg BRANCH=` + branch;
    let commandArgs = ['compose', '--profile', profile, '-f', dockerPath + dockerComposeFile, 'build', '--progress=plain', '--build-arg', 'BRANCH=' + branch, (clearCache ? '--no-cache' : '')];
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

function startContainer(params, res) {
    let profile           = params.profileName;
    let dockerComposeFile = null;
    let dockerPath        = path.join(__dirname, '../docker/');
    fs.readdirSync(dockerPath).forEach((file) => {
        if (file.indexOf('.yml') > -1) {
            dockerComposeFile = file;
        }
    });

    let httpPort    = getOpenPort();
    let httpsPort   = getOpenPort();
    let sshPort     = getOpenPort();
    let mySqlPort   = getOpenPort();
    let commandArgs = [
        'compose',
        '--profile',
        profile,
        '-f',
        dockerPath + dockerComposeFile,
        'up',
        '-d',
        /*        'HTTP_PORT=',
                httpPort,
                'HTTPS_PORT=',
                httpsPort,
                'SSH_PORT=',
                sshPort,
                'MYSQL_PORT=',
                mySqlPort*/
    ];
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

function stopContainer(params, res) {
    let profile           = params.profileName;
    let dockerComposeFile = null;
    let dockerPath        = path.join(__dirname, '../docker/');
    fs.readdirSync(dockerPath).forEach((file) => {
        if (file.indexOf('.yml') > -1) {
            dockerComposeFile = file;
        }
    });

    let commandArgs = ['compose', '--profile', profile, '-f', dockerPath + dockerComposeFile, 'stop',];
    let x           = childProcess.spawn(command, commandArgs);
    x.stdout.on('data', (data) => {
        console.log(data.toString());
        io.emit('buildProgress', data.toString());
    });
    x.stdout.on('close', (data) => {
        io.emit('buildProgress', "Container Stopped!");
        res.send('Container Stopped');

    })
}

function destroyContainer(params, res) {
    let profile           = params.profileName;
    let dockerComposeFile = null;
    let dockerPath        = path.join(__dirname, '../docker/');
    fs.readdirSync(dockerPath).forEach((file) => {
        if (file.indexOf('.yml') > -1) {
            dockerComposeFile = file;
        }
    });

    let commandArgs = ['compose', '--profile', profile, '-f', dockerPath + dockerComposeFile, 'down', '-v'];
    let x           = childProcess.spawn(command, commandArgs);
    x.stdout.on('data', (data) => {
        console.log(data.toString());
        io.emit('buildProgress', data.toString());
    });
    x.stdout.on('close', (data) => {
        io.emit('buildProgress', "Container Destroyed!");
        res.send('Container Destroyed');

    })
}

function getContainerList(res) {

    let commandArgs    = ['ps', '-a', '--format', '"{{.ID}}|{{.Names}}|{{.Image}}|{{.Ports}}|{{.Status}}"'];
    let x              = childProcess.spawn(command, commandArgs);
    let headers        = [
        {
            title: 'ID',
            key  : 'id',
            value: 'id',
        },
        {
            title: 'Name',
            key  : 'name',
            value: 'name',
        },
        {
            title: 'Image',
            key  : 'image',
            value: 'image',
        },
        {
            title: 'Ports',
            key  : 'ports',
            value: 'ports',
        },
        {
            title: 'Status',
            key  : 'status',
            value: 'status',
        },
        {
            title: 'Branch',
            key  : 'branch',
            value: 'branch',
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
                let headerName = headers[index].key;

                if (headerName === 'ports') {
                    let portsList = item.split(',');
                    let ports     = [];
                    portsList.forEach((port) => {
                        console.log(port);
                        let portArr = port.split('->');
                        let host    = (portArr[0]) ? portArr[0].trim() : null;
                        let guest   = (portArr[1]) ? portArr[1].trim() : null;
                        if (guest !== null && guest.indexOf('443') > -1) {
                            host = '<a href="' + 'https://' + host + '" target="_blank">HTTPS</a>';
                        } else if (guest !== null && guest.indexOf('80') > -1) {
                            host = '<a href="' + 'http://' + host + '" target="_blank">HTTP</a>';
                        } else if (guest !== null && guest.indexOf('3306') > -1) {
                            host = '<a href="' + 'mysql://' + host + '" target="_blank">MySQL: ' + host + '</a>';
                        }
                        ports.push({
                            host : host,
                            guest: guest,
                        });
                    });
                    containerRow[headerName] = ports;
                    return;
                } else if (headerName === 'branch') {
                    let branch = '';
                    let git    = childProcess.spawn(command, ['exec', '-it,' + containerRow['name'], '/bin/bash', '-c', 'git branch --show-current']);
                    git.stdout.on('data', (data) => {
                        branch                   = data.toString();
                        containerRow[headerName] = branch;

                    });
                    return;

                }
                containerRow[headerName] = item.trim();
            });
            if (containerRow.id) {
                returnData.containers.push(containerRow);

            }
        });

        io.emit('containerListUpdated', returnData);
        res.send(returnData);

    });

}

function sendCommand(params, res) {
    let containerName = params.containerName;
    let sshCommand    = params.sshCommand;
    console.log(params);
    let command     = 'docker';
    let commandArgs = ['exec', containerName, 'sh', '-c', sshCommand];
    let x           = childProcess.spawn(command, commandArgs);
    x.stdout.on('data', (data) => {
        console.log(data.toString());
        io.emit('sshOutput', data.toString());
    });
    x.stdout.on('close', (data) => {
        io.emit('sshClose', "Connection Closed!");
        res.send(data.toString() + "\r\n" + "Connection Closed!");

    })
}

function getOpenPort(portNumber = null) {
    let lsof        = 'lsof';
    let port        = (portNumber) ? portNumber : Math.floor(Math.random() * 65535);
    let commandArgs = ['-i:', port];
    let x           = childProcess.spawn(lsof, commandArgs);

    x.stdout.on('data', (data) => {
        if (data.toString().indexOf('LISTEN') > -1) {
            port--;
            getOpenPort(port);
        } else {
            console.log('Found open port: ' + port);
            return port;
        }
    });
    return port;

}
