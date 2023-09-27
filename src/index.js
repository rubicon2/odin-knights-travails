import './style.css';
import Knight from './knight';
import Vector2 from './vector2';

let knightA = new Knight(0, 0);

let node = Knight.moveMap.findNode({ x: 0, y: 0 });
let targetNode = Knight.moveMap.findNode({ x: 7, y: 2 });

// Returns moves as an array of nodes
console.log(
    Knight.moveMap.findPath(node, targetNode, (a, b) =>
        Vector2.sub(
            new Vector2(b.data.x, b.data.y),
            new Vector2(a.data.x, a.data.y)
        ).magnitude()
    )
);

// Returns moves as a string as per Odin project assignment
console.log(Knight.moves([0, 0], [7, 2]));
