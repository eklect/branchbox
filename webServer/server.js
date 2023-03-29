const path    = require('path');
const express = require('express');
const app     = express();
const port    = 3000;
const {exec}  = require('child_process');

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) =>
        res.sendFile(path.join(__dirname, '../dist', 'index.html'))
);

//API Calls
app.get('/api/getContainers', (req, res) => {
    exec('docker ps -a --format "{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}"', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.status(500).send(error.message);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.status(500).send(stderr);
            return;
        }
        res.send(stdout);
    });
});

//Last Route. Automatically send 404
app.get('*', (req, res) => {
    res.redirect('/');

});

app.listen((port), () =>
        console.log(`Branch Box Server listening on http://localhost:${port}`)
);