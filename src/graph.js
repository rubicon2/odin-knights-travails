import { MergeSort } from './sort';

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

    getEdge(nodeA, nodeB) {
        return (
            this.edges
                .get(nodeA)
                .filter((edge) => Node.isEquivalent(edge.neighbor, nodeB))[0] ||
            null
        );
    }

    getEdges(node) {
        return this.edges.get(node) || null;
    }

    getNeighbor(nodeA, nodeB) {
        return this.getEdge(nodeA, nodeB).neighbor;
    }

    getNeighbors(node) {
        return this.getEdges(node).map((edge) => edge.neighbor);
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

    #reconstructPath(cameFrom, current) {
        let pathFromDestination = [current];
        while (
            cameFrom.has(pathFromDestination[pathFromDestination.length - 1])
        ) {
            pathFromDestination.push(
                cameFrom.get(
                    pathFromDestination[pathFromDestination.length - 1]
                )
            );
        }
        return pathFromDestination.reverse();
    }

    findPath(startData, endData, estimateCostFn) {
        let startNode = this.findNode(startData);
        let endNode = this.findNode(endData);

        // A* algorithm
        let openSet = [startNode];

        // Will use current node to find previous node in sequence
        let cameFrom = new Map();

        // Cost of path from start to current node
        let gScore = new Map();
        gScore.set(startNode, 0);

        // Estimate of cheapest path from start to end nodes
        let fScore = new Map();
        fScore.set(startNode, estimateCostFn(startNode, endNode));

        while (openSet.length > 0) {
            // Move lower fCost pathNodes to the end so they can be popped off the end of the array instead of shifted off the front
            openSet = MergeSort(
                openSet,
                (a, b) => fScore.get(a) || 0 > fScore.get(b) || 0
            );

            let currentGraphNode = openSet.pop();
            if (currentGraphNode === endNode)
                return this.#reconstructPath(cameFrom, currentGraphNode);

            for (let neighbor of this.getNeighbors(currentGraphNode)) {
                let tentativeG =
                    gScore.get(currentGraphNode) +
                    this.getEdge(currentGraphNode, neighbor).weight;
                if (
                    !gScore.has(neighbor) ||
                    tentativeG < gScore.get(neighbor)
                ) {
                    cameFrom.set(neighbor, currentGraphNode);
                    gScore.set(neighbor, tentativeG);
                    fScore.set(
                        neighbor,
                        tentativeG + estimateCostFn(neighbor, endNode)
                    );
                    if (!openSet.includes(neighbor)) openSet.push(neighbor);
                }
            }
        }
        // No path found, openSet is empty
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
