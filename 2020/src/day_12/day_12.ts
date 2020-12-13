import {readInputToStringArr} from '../input';

const cardinalDirection = ['N', 'W', 'S', 'E'];

class Ship {
    pos: [number, number];
    dir: [number, number];
    dirName: string;
    waypoint: [number, number];

    constructor(){
        this.pos = [0,0];
        this.dir = [1,0];
        this.dirName = 'E';
        this.waypoint = [10,1];
    }

    setDirection = (newDir: string): void => {
        switch(newDir){
            case 'N':
                this.dir = [0,1];
                break;
            case 'S':
                this.dir = [0,-1];
                break;
            case 'W':
                this.dir = [-1,0];
                break;
            case 'E':
                this.dir = [1,0];
                break;
        }
        this.dirName=newDir;
    }

    turn = (val: number): void => {
        let currDirIndex: number = cardinalDirection.indexOf(this.dirName);
        let newDirIndex: number = (val/90 + currDirIndex)%4;
        this.setDirection(
            cardinalDirection[newDirIndex < 0 ? cardinalDirection.length + newDirIndex : newDirIndex]);
    }

    move = (dir:[number, number], val: number): void => {
        this.pos[0] += (dir[0]*val);
        this.pos[1] += (dir[1]*val);
    }

    moveWaypoint = (dir:[number, number], val: number): void => {
        this.waypoint[0] += (dir[0]*val);
        this.waypoint[1] += (dir[1]*val);
    }

    rotateWaypoint = (angle: number): void => {
        let cx: number = this.pos[0], cy: number = this.pos[1];
        let x: number = this.waypoint[0], y: number = this.waypoint[1];

        let radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians);

        this.waypoint[0] = Math.round((cos * (x - cx)) + (sin * (y - cy)) + cx),
        this.waypoint[1] = Math.round((cos * (y - cy)) - (sin * (x - cx)) + cy);
    }

    moveTowardWaypoint = (numTimes: number) => {
        let dist: [number, number] = [this.waypoint[0]-this.pos[0], this.waypoint[1]-this.pos[1]];

        this.pos[0] += dist[0]*numTimes;
        this.pos[1] += dist[1]*numTimes;

        this.waypoint[0] += dist[0]*numTimes;
        this.waypoint[1] += dist[1]*numTimes;
    }
}

const moveShip = (ship: Ship, newMove: string): Ship => {
    let val: number = Number(newMove.slice(1).trim());

    switch(newMove[0]){
        case 'F':
            ship.moveTowardWaypoint(val);
            break;
        case 'L':
            ship.rotateWaypoint(360-val);
            break;
        case 'R':
            ship.rotateWaypoint(val);
            break;
        case 'N':
            ship.moveWaypoint([0,1], val);
            break;
        case 'S':
            ship.moveWaypoint([0,-1], val);
            break;
        case 'W':
            ship.moveWaypoint([-1,0], val);
            break;
        case 'E':
            ship.moveWaypoint([1,0], val);
            break;
    }
    return ship;
}

const moveShipFromInput = (input:string[]): Ship => {
    let ship: Ship = new Ship();
    for (let line of input){
        ship = moveShip(ship, line);
    }
    return ship;
}

const manhattenDistance = (pos: [number, number]): number => Math.abs(pos[0]) + Math.abs(pos[1]);

//main logic
let input: string[] = readInputToStringArr("./day_12/input.txt");
let ship: Ship = moveShipFromInput(input);
console.log(manhattenDistance(ship.pos));