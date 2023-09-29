import './style.css';
import Knight from './knight';
import Vector2 from './vector2';

// Returns moves as an array of nodes
console.log(
    Knight.moveMap.findPath({ x: 0, y: 0 }, { x: 7, y: 7 }, (a, b) =>
        Vector2.sub(
            new Vector2(b.data.x, b.data.y),
            new Vector2(a.data.x, a.data.y)
        ).magnitude()
    )
);

// Returns moves as a string as per Odin project assignment
console.log(Knight.moves([0, 7], [7, 7]));
console.log(Knight.moves([7, 7], [0, 0]));
console.log(Knight.moves([0, 7], [7, 0]));
console.log(Knight.moves([7, 0], [0, 7]));

console.log(Knight.moves([0, 0], [0, 0]));
console.log(Knight.moves([7, 7], [7, 7]));

console.log(Knight.moves([3, 3], [0, 0]));
console.log(Knight.moves([0, 0], [3, 3]));
