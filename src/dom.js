import Board from './board';
import Knight from './knight';
import Vector2 from './vector2';
import { delay, transitionProperty } from './animations';

// Source: https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
// Created by Colin M.L. Burnett https://en.wikipedia.org/wiki/User:Cburnett
// Under the GNU Free Documentation License.
// Many thanks!
import knightIcon from './knight_icon.svg';
import { getRangedRandomInt } from './util';

let startPos = null;
let endPos = null;

let knightElement = null;
let isMoving = false;
let autoMove = true;

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

  if (autoMove) doRandomMoveSequence();
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
    // After user interaction, disable autoMove
    autoMove = false;
    // If knight is already moving, cancel
    if (isMoving) return;
    let x = event.target.getAttribute('data-x');
    let y = event.target.getAttribute('data-y');

    // 1st click gets startPos, 2nd click gets endPos
    if (!startPos) {
      resetCellText();
      // Reset board selected cells colour
      resetSelectedCells();
      startPos = new Vector2(x, y);
      let startCell = getCellElement(x, y);
      startCell.classList.add('selected-cell', 'start-cell');
    } else {
      endPos = new Vector2(x, y);
      // If user selects the same cell for start and end, reset and cancel
      if (Vector2.isEqual(startPos, endPos)) {
        resetSelectedCells();
        resetSelectedPositions();
        return;
      }
      let endCell = getCellElement(x, y);
      endCell.classList.add('selected-cell', 'end-cell');
      let moveSequence = Knight.moveMap.findPath(startPos, endPos, (a, b) =>
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

function resetCellText() {
  document.querySelectorAll('.cell-text').forEach((cell) => {
    cell.remove();
  });
}

function resetSelectedCells() {
  knightElement.classList.add('invisible');
  document
    .querySelectorAll('.selected-cell')
    .forEach((element) => element.classList.remove('start-cell', 'end-cell'));
}

function resetSelectedPositions() {
  startPos = null;
  endPos = null;
}

async function doRandomMoveSequence() {
  if (!autoMove) return;
  resetSelectedCells();
  resetCellText();
  startPos = new Vector2(
    getRangedRandomInt(Board.MIN_POSITION, Board.MAX_POSITION),
    getRangedRandomInt(Board.MIN_POSITION, Board.MAX_POSITION)
  );
  do {
    endPos = new Vector2(
      getRangedRandomInt(Board.MIN_POSITION, Board.MAX_POSITION),
      getRangedRandomInt(Board.MIN_POSITION, Board.MAX_POSITION)
    );
  } while (Vector2.isEqual(startPos, endPos));

  let startCell = getCellElement(startPos.x, startPos.y);
  startCell.classList.add('selected-cell', 'start-cell');

  let endCell = getCellElement(endPos.x, endPos.y);
  endCell.classList.add('selected-cell', 'end-cell');

  let moveSequence = Knight.moveMap.findPath(startPos, endPos, (a, b) =>
    Vector2.sub(
      new Vector2(b.data.x, b.data.y),
      new Vector2(a.data.x, a.data.y)
    ).magnitude()
  );
  await displayMoveSequence(moveSequence);
  resetSelectedPositions();

  await delay(3000);
  doRandomMoveSequence();
}

async function displayMoveSequence(moveSequence) {
  // If already moving, cancel
  if (isMoving) return;
  isMoving = true;
  knightElement.classList.remove('invisible');
  for (let i = 0; i < moveSequence.length; i++) {
    let currentPosition = moveSequence[i].data;

    if (i === 0) {
      // Remove css transition so knight immediately warps to start position
      knightElement.style.transition = 'none';
      knightElement.style.left = calculateKnightPositionCss(currentPosition.x);
      knightElement.style.top = calculateKnightPositionCss(currentPosition.y);
    } else {
      await moveKnight(currentPosition);
    }
    await delay(300);

    // Now update the board squares with each move number
    let cell = getCellElement(currentPosition.x, currentPosition.y);
    let cellText = document.createElement('h1');
    cellText.classList.add('cell-text');
    cellText.innerText = i == 0 ? 'S' : i;
    cell.appendChild(cellText);
  }
  isMoving = false;
}

function calculateKnightPositionCss(cellPos) {
  // 100% divided by 8 squares
  const squareSize = 12.5;
  return `${cellPos * squareSize}%`;
}

async function moveKnight(position) {
  const durationMs = 600;
  await transitionProperty(
    knightElement,
    'left',
    `${durationMs}ms`,
    calculateKnightPositionCss(position.x)
  );

  await transitionProperty(
    knightElement,
    'top',
    `${durationMs}ms`,
    calculateKnightPositionCss(position.y)
  );
}
