export class Graph {
    constructor(nodes) {
        this.nodes = nodes;
        this.edges = new Map();
    }

    addDirectedEdge(nodeA, nodeB, weight = 1) {
        if (this.edges.has(nodeA)) {
            this.edges.get(nodeA).push(new Edge(nodeB, weight));
        } else {
            this.edges.set(nodeA, [new Edge(nodeB, weight)]);
        }
    }

    addUndirectedEdge(nodeA, nodeB, weight = 1) {
        this.addDirectedEdge(nodeA, nodeB, weight);
        this.addDirectedEdge(nodeB, nodeA, weight);
    }

    addDirectedEdges(nodeA, weight, ...neighbors) {
        for (let neighbor of neighbors)
            this.addDirectedEdge(nodeA, neighbor, weight);
    }

    addUndirectedEdges(nodeA, weight, ...neighbors) {
        for (let neighbor of neighbors)
            this.addUndirectedEdge(nodeA, neighbor, weight);
    }

    getEdges(node) {
        return this.edges.get(node) || null;
    }

    findNode(data) {
        for (let node of this.nodes) {
            if (Node.isEquivalent(node, new Node(data))) {
                return node;
            }
        }
        // No node found
        return null;
    }
}

export class Edge {
    constructor(node, weight = 1) {
        this.neighbor = node;
        this.weight = weight;
    }
}

export class Node {
    constructor(data) {
        this.data = data; // e.g. { x, y }
    }

    static createGrid(min, max) {
        let gridNodes = [];
        for (let y = min; y <= max; y++) {
            for (let x = min; x <= max; x++) {
                gridNodes.push(new Node({ x, y }));
            }
        }
        return gridNodes;
    }

    static isEquivalent(a, b) {
        a = a.data;
        b = b.data;
        // Checks if data value is the same, or if data is an object, checks all its members
        if (typeof a === 'object' && typeof b === 'object') {
            let allUniqueKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
            for (let key of allUniqueKeys) if (a[key] !== b[key]) return false;
            return true;
        } else {
            return a === b;
        }
    }
}
