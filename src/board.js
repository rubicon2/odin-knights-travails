export default class Board {
    static MIN_POSITION = 0;
    static MAX_POSITION = 7;

    static isPositionValid(position) {
        return (
            position.x >= Board.MIN_POSITION &&
            position.x <= Board.MAX_POSITION &&
            position.y >= Board.MIN_POSITION &&
            position.y <= Board.MAX_POSITION
        );
    }
}
