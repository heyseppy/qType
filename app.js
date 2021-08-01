const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const moment = require("moment");

//service

const app = express(feathers());


class RopyService {
    constructor(){
        this.rastes = [];
    }
    async create(data)
    {
        const raste = {
            rasteID: this.rastes.length,
            authorID: '',
            dateID: '',
            text: data.text,
            time: moment().format('h:mm:ss a')
        }

        this.rastes.push(raste);

        return raste;
    }
    async find()
    {
        return this.rastes;
    }
}
//parse JSON
app.use(express.json());

app.configure(socketio());

app.configure(express.rest());

app.use('/raste', new RopyService());

app.on('connection', conn => app.channel('stream').join(conn));

app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => console.log(`Realtime Server running on port ${PORT}`));

app.service('ideas')
