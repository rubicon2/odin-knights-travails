import Vector2 from './vector2';
import { Graph, Node } from './graph';
import Board from './board';

export default class Knight {
    static getValidMoves(x, y) {
        let allMoves = [];
        allMoves.push(new Vector2(x + 2, y + 1));
        allMoves.push(new Vector2(x + 1, y + 2));
        allMoves.push(new Vector2(x - 2, y + 1));
        allMoves.push(new Vector2(x - 1, y + 2));
        allMoves.push(new Vector2(x + 2, y - 1));
        allMoves.push(new Vector2(x + 1, y - 2));
        allMoves.push(new Vector2(x - 2, y - 1));
        allMoves.push(new Vector2(x - 1, y - 2));
        return allMoves.filter((move) => Board.isPositionValid(move));
    }

    static moves(startPos, endPos) {
        let nodes = Knight.moveMap.findPath(
            { x: startPos[0], y: startPos[1] },
            { x: endPos[0], y: endPos[1] },
            (a, b) =>
                Vector2.sub(
                    new Vector2(b.data.x, b.data.y),
                    new Vector2(a.data.x, a.data.y)
                ).magnitude()
        );

        let pathStr = `[`;
        for (let node of nodes) {
            pathStr += `[${node.data.x}, ${node.data.y}],`;
        }
        return pathStr.slice(0, pathStr.length - 2) + `]`;
    }

    static #initMoveMap() {
        // moveMap contains all possible positions and the links between them
        const minPosition = 0;
        const maxPosition = 7;

        let graph = new Graph(Node.createGrid(minPosition, maxPosition));

        for (let y = Board.MIN_POSITION; y <= Board.MAX_POSITION; y++) {
            for (let x = Board.MIN_POSITION; x <= Board.MAX_POSITION; x++) {
                for (const move of this.getValidMoves(x, y)) {
                    let currentNode = graph.findNode({ x, y });
                    let neighboringNode = graph.findNode(move);
                    graph.addDirectedEdge(currentNode, neighboringNode);
                }
            }
        }
        return graph;
    }

    static moveMap = this.#initMoveMap();

    constructor(x, y) {
        this.position = new Vector2(x, y);
    }
}
