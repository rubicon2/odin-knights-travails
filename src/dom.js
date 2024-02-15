import { default as Board } from './board';
import Knight from './knight';
import Vector2 from './vector2';

let startPos = null;
let endPos = null;

export function createPage(parent) {
    createChessBoard(parent);
}

export function createChessBoard(parent) {
    let chessBoard = document.createElement('div');
    chessBoard.classList.add('chessboard');

    let isCellBlack = true;
    for (let y = Board.MIN_POSITION; y <= Board.MAX_POSITION; y++) {
        for (let x = Board.MIN_POSITION; x <= Board.MAX_POSITION; x++) {
            createCell(chessBoard, x, y, isCellBlack);
            isCellBlack = !isCellBlack;
        }
        isCellBlack = !isCellBlack;
    }
    parent.appendChild(chessBoard);
}

function getCellElement(x, y) {
    return document.querySelector(`.board-cell[data-x="${x}"][data-y="${y}"]`);
}

function createCell(parent, x, y, isCellBlack) {
    let cell = document.createElement('div');
    cell.classList.add('board-cell');

    if (isCellBlack) cell.classList.add('black-cell');
    else cell.classList.add('white-cell');
    isCellBlack = !isCellBlack;

    cell.setAttribute('data-x', x);
    cell.setAttribute('data-y', y);

    cell.onclick = (event) => {
        let x = event.target.getAttribute('data-x');
        let y = event.target.getAttribute('data-y');

        // 1st click gets startPos, 2nd click gets endPos
        if (!startPos) {
            // Remove any leftover text from last path shown
            document.querySelectorAll('.cell-text').forEach((cell) => {
                cell.remove();
            });
            // Reset board selected cells colour
            resetSelectedCells();
            startPos = new Vector2(x, y);
            let startCell = getCellElement(x, y);
            startCell.classList.add('selected-cell', 'start-cell');
        } else {
            endPos = new Vector2(x, y);
            if (Vector2.isEqual(startPos, endPos)) {
                resetSelectedCells();
                resetSelectedPositions();
                return;
            }
            let endCell = getCellElement(x, y);
            endCell.classList.add('selected-cell', 'end-cell');
            let moveSequence = Knight.moveMap.findPath(
                startPos,
                endPos,
                (a, b) =>
                    Vector2.sub(
                        new Vector2(b.data.x, b.data.y),
                        new Vector2(a.data.x, a.data.y)
                    ).magnitude()
            );
            displayMoveSequence(moveSequence);
            resetSelectedPositions();
        }
    };

    parent.appendChild(cell);
}

function resetSelectedCells() {
    document
    .querySelectorAll('.selected-cell')
    .forEach((element) =>
        element.classList.remove('start-cell', 'end-cell')
    );
}

function resetSelectedPositions() {
    startPos = null;
    endPos = null;
}

function displayMoveSequence(moveSequence) {
    for (let i = 0; i < moveSequence.length; i++) {
        let currentPosition = moveSequence[i].data;
        let cell = getCellElement(currentPosition.x, currentPosition.y);

        let cellText = document.createElement('h1');
        cellText.classList.add('cell-text');
        cellText.innerText = i == 0 ? 'S' : i;
        cell.appendChild(cellText);
    }
}
