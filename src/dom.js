import { default as Board } from './board';

export function createPage(parent) {
    createChessBoard(parent);
}

export function createChessBoard(parent) {
    let chessBoard = document.createElement('div');
    chessBoard.classList.add('chessboard');

    let isCellBlack = true;
    for (let y = Board.MIN_POSITION; y <= Board.MAX_POSITION; y++) {
        isCellBlack = !isCellBlack;
        for (let x = Board.MIN_POSITION; x <= Board.MAX_POSITION; x++) {
            let cell = document.createElement('div');
            cell.classList.add('board-cell');

            if (isCellBlack) cell.classList.add('black-cell');
            else cell.classList.add('white-cell');
            isCellBlack = !isCellBlack;

            cell.setAttribute('x', x);
            cell.setAttribute('y', y);

            chessBoard.appendChild(cell);
        }
    }

    // let x = 7;
    // let mega = document.querySelector(`.board-cell[x="${x}"]`);

    parent.appendChild(chessBoard);
}
