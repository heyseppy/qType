const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");
const service = require('feathers-memory');

const app = express(feathers());

app.get("/", (req, res) => {

    res.sendFile('index.html', { root: __dirname });
});

app.get("/view/:rasteKey", (req, res) => {
    res.sendFile('viewer.html', { root: __dirname });
    
});

class RopyService {
    constructor(){
        this.rastes = [];
    }
    async create(data)
    {
        const raste = {
            rasteID: data.rasteID,
            title: data.title,
            authorID: data.author,
            text: data.text,
            time: moment().format('h:mm:ss a')
        }

        this.rastes.push(raste);

        return raste;
    }
    async update(id, data)
    {
        this.rastes[id] = data;
    }
    async find()
    {
        return this.rastes;
    }
    async get(id)
    {
        return this.rastes[id];
    }
}
//parse JSON
app.use(express.json());

app.configure(socketio());

app.configure(express.rest());

app.use('/rastes', new RopyService());

app.on('connection', conn => app.channel('stream').join(conn));

app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => console.log(`Realtime Server running on port ${PORT}`));

