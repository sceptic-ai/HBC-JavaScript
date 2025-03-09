var origBoard;
const getEleId = (id) =>document.getElementById(id);
const replayBtn = document.getElementById('replay-btn'),
    cells = document.querySelectorAll('.cell'),
    endGameDiv = document.querySelector('.endgame'),
    humanPlayer = 'X', 
    AIPlayer = 'O',
    winCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
// 012
// 345
// 678

const minMaxAI = (newBoard,player) =>{
    let availSpots = emptySquares(newBoard);
    if(getGameWonCheck(newBoard,player)){
        return {score:-10};
    }else if (getGameWonCheck(newBoard,AIPlayer)){
        return {score:20};
    }else if(availSpots.length===0){
        return {score:0};
    }

    var moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {}; 
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]]=player;
        if(player==AIPlayer){
            let result = minMaxAI(newBoard,humanPlayer);
            move.score= result.score;
        }else{
            let result = minMaxAI(newBoard,AIPlayer);
            move.score= result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);    
    }
    let bestMove;
    if(player==AIPlayer){
        var bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if(moves[i].score   >   bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }   
        }
    }else{
        var bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if(moves[i].score   <   bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];

};
const declareWinner = (msg)=>{
    endGameDiv.style.display="block";
    document.querySelector('.endgame .text').innerHTML=msg;
};
const emptySquares = ()=>{
    return origBoard.filter(item =>  typeof item == 'number');
};
const bestSpotForAI = ()=>{
    return minMaxAI(origBoard,AIPlayer).index;
}; 
const checkGameTie = ()=>{
    if(emptySquares().length == 0 ){
        for (const itemCells of cells) {
            itemCells.style.backgroundColor="green";
            itemCells.removeEventListener('click',clickInCell,false);
        }
        declareWinner("Tie Game !!");
        return true;
    }
    return false;
};
const gameOver = (gameWon) =>{
    for (let index of winCombos[gameWon.index]) {
        getEleId(index).style.backgroundColor = gameWon.player==humanPlayer ? "blue":"red";
    }
    for (const iterator of cells) {
        iterator.removeEventListener('click',clickInCell,false);    
    }
    declareWinner(gameWon.player==humanPlayer ? "You Win!!" : "Computer Win!!");
};
const getGameWonCheck = (board,player) => {
    let plays = board.reduce(
        (a,e,i ) => (e === player)? 
                        a.concat(i): 
                        a ,[]);
    
    let gameWon = null;
    for (const [index, win] of winCombos.entries()) {
        
        if(win.every(element=> plays.indexOf(element) > -1)){
            
            gameWon = {index:index,player:player};
            break;
        }
    }
    return gameWon;
};


const turn = (squareId,player)=>{
    origBoard[squareId] = player;
    getEleId(squareId).innerHTML = player;
    let gameWonCheck = getGameWonCheck(origBoard,player);
    if(gameWonCheck) gameOver(gameWonCheck);
};

const clickInCell = (square)=>{
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id,humanPlayer);
        if(!checkGameTie()) turn(bestSpotForAI(),AIPlayer);
    }
    
    
    
};
const startGame = ()=> {
    endGameDiv.style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for(let i = 0; i < cells.length;i++){
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',clickInCell,false);
    }
};

const replayFun = ()=>{
    
    startGame();
};
startGame();


replayBtn.addEventListener('click',replayFun);