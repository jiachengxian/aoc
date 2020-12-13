"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const cardinalDirection = ['N', 'W', 'S', 'E'];
class Ship {
    constructor() {
        this.setDirection = (newDir) => {
            switch (newDir) {
                case 'N':
                    this.dir = [0, 1];
                    break;
                case 'S':
                    this.dir = [0, -1];
                    break;
                case 'W':
                    this.dir = [-1, 0];
                    break;
                case 'E':
                    this.dir = [1, 0];
                    break;
            }
            this.dirName = newDir;
        };
        this.turn = (val) => {
            let currDirIndex = cardinalDirection.indexOf(this.dirName);
            let newDirIndex = (val / 90 + currDirIndex) % 4;
            this.setDirection(cardinalDirection[newDirIndex < 0 ? cardinalDirection.length + newDirIndex : newDirIndex]);
        };
        this.move = (dir, val) => {
            this.pos[0] += (dir[0] * val);
            this.pos[1] += (dir[1] * val);
        };
        this.moveWaypoint = (dir, val) => {
            this.waypoint[0] += (dir[0] * val);
            this.waypoint[1] += (dir[1] * val);
        };
        this.rotateWaypoint = (angle) => {
            let cx = this.pos[0], cy = this.pos[1];
            let x = this.waypoint[0], y = this.waypoint[1];
            let radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians);
            this.waypoint[0] = Math.round((cos * (x - cx)) + (sin * (y - cy)) + cx),
                this.waypoint[1] = Math.round((cos * (y - cy)) - (sin * (x - cx)) + cy);
        };
        this.moveTowardWaypoint = (numTimes) => {
            let dist = [this.waypoint[0] - this.pos[0], this.waypoint[1] - this.pos[1]];
            this.pos[0] += dist[0] * numTimes;
            this.pos[1] += dist[1] * numTimes;
            this.waypoint[0] += dist[0] * numTimes;
            this.waypoint[1] += dist[1] * numTimes;
        };
        this.pos = [0, 0];
        this.dir = [1, 0];
        this.dirName = 'E';
        this.waypoint = [10, 1];
    }
}
const moveShip = (ship, newMove) => {
    let val = Number(newMove.slice(1).trim());
    switch (newMove[0]) {
        case 'F':
            ship.moveTowardWaypoint(val);
            break;
        case 'L':
            ship.rotateWaypoint(360 - val);
            break;
        case 'R':
            ship.rotateWaypoint(val);
            break;
        case 'N':
            ship.moveWaypoint([0, 1], val);
            break;
        case 'S':
            ship.moveWaypoint([0, -1], val);
            break;
        case 'W':
            ship.moveWaypoint([-1, 0], val);
            break;
        case 'E':
            ship.moveWaypoint([1, 0], val);
            break;
    }
    return ship;
};
const moveShipFromInput = (input) => {
    let ship = new Ship();
    for (let line of input) {
        ship = moveShip(ship, line);
    }
    return ship;
};
const manhattenDistance = (pos) => Math.abs(pos[0]) + Math.abs(pos[1]);
//main logic
let input = input_1.readInputToStringArr("./day_12/input.txt");
let ship = moveShipFromInput(input);
console.log(manhattenDistance(ship.pos));
