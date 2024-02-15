import Board from './board';
import Knight from './knight';
import Vector2 from './vector2';
import { delay, transitionProperty } from './animations';

// Source: https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
// Created by Colin M.L. Burnett https://en.wikipedia.org/wiki/User:Cburnett
// Under the GNU Free Documentation License.
// Many thanks!
import knightIcon from './knight_icon.svg';

let startPos = null;
let endPos = null;

let knightElement = null;

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

    knightElement = document.createElement('img');
    knightElement.src = knightIcon;
    knightElement.classList.add('knight', 'invisible');
    chessBoard.appendChild(knightElement);

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
    knightElement.classList.add('invisible');
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

async function displayMoveSequence(moveSequence) {
    knightElement.classList.remove('invisible');
    for (let i = 0; i < moveSequence.length; i++) {
        let currentPosition = moveSequence[i].data;

        if (i === 0) {
            knightElement.style.transition = 'none';
            knightElement.style.left = calculateKnightPositionCss(
                currentPosition.x
            );
            knightElement.style.top = calculateKnightPositionCss(
                currentPosition.y
            );
        } else {
            await moveKnight(currentPosition);
        }
        await delay(100);

        // Now update the board squares with each move number
        let cell = getCellElement(currentPosition.x, currentPosition.y);
        let cellText = document.createElement('h1');
        cellText.classList.add('cell-text');
        cellText.innerText = i == 0 ? 'S' : i;
        cell.appendChild(cellText);
    }
}

function calculateKnightPositionCss(cellPos) {
    // 100% divided by 8 squares
    const squareSize = 12.5;
    return `${cellPos * squareSize}%`;
}

async function moveKnight(position) {
    await transitionProperty(
        knightElement,
        'left',
        '800ms',
        calculateKnightPositionCss(position.x)
    );
    await transitionProperty(
        knightElement,
        'top',
        '800ms',
        calculateKnightPositionCss(position.y)
    );
}
