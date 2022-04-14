

const elementArray = ['fire', 'water', 'air', 'earth'];

let player1 = {
    playerElement: 'fire',
    playerSym: 'X',
    animPath: '',
    imgPath: '',
    soundPath: '',
    cutSoundPath: ''
}

let player2 = {
    playerElement: 'fire',
    playerSym: 'O',
    animPath: '',
    imgPath: ''
}
let isXRound = true;

const gameBoxes = Array.from(document.getElementsByClassName('game-box'));
const boxImgs = Array.from(document.getElementsByClassName('box-img')).map ((element) => {
    const object = {
        imgTag: element,
        symbol: ''
    };

    return object;
});

const gameSound = document.getElementsByTagName('audio')[0];
gameSound.volume = .2;

let pauseGame = true;
const buttons = Array.from(document.getElementsByClassName('elementButton'));
const player1Buttons = buttons.splice(0, 4);
const player2Buttons = buttons;

let clickedBtn = [false, false];

setElmntButtonClick();

function setElmntButtonClick(){

    player1Buttons[0].addEventListener('click', player1Buttons[0].fn = function(){
        setPlayerElement(player1, player1Buttons[0], 'fire');
    });

    player1Buttons[1].addEventListener('click', player1Buttons[1].fn = function(){
        setPlayerElement(player1, player1Buttons[1], 'water');
    });

    player1Buttons[2].addEventListener('click', player1Buttons[2].fn = function(){
        setPlayerElement(player1, player1Buttons[2], 'air');
    });

    player1Buttons[3].addEventListener('click', player1Buttons[3].fn = function(){
        setPlayerElement(player1, player1Buttons[3], 'earth');
    });

    player2Buttons[0].addEventListener('click', player2Buttons[0].fn = function(){
        setPlayerElement(player2, player2Buttons[0],'fire');
    });

    player2Buttons[1].addEventListener('click', player2Buttons[1].fn = function(){
        setPlayerElement(player2, player2Buttons[1], 'water');
    });

    player2Buttons[2].addEventListener('click', player2Buttons[2].fn = function(){
        setPlayerElement(player2, player2Buttons[2], 'air');
    });

    player2Buttons[3].addEventListener('click', player2Buttons[3].fn = function(){
        setPlayerElement(player2, player2Buttons[3], 'earth');
    });
}

function setPlayerElement(player, button, element){
    player.imgPath = './img/'+player.playerSym+'-'+element+'.gif';
    player.animPath = './img/'+player.playerSym+'-'+element+'-cut.gif';
    player.soundPath = './sound/'+element+'.wav';
    player.cutSoundPath = './sound/'+player.playerSym+'-cut.wav';

    button.classList.add('clickedBtn');

    if(player === player1){
        clickedBtn[0] = true;
        player1Buttons.forEach((item) => {
            item.removeEventListener('click', item.fn);
        });
    } else {
        clickedBtn[1] = true;
        player2Buttons.forEach((item) => {
            item.removeEventListener('click', item.fn);
        });
    }

    if(clickedBtn[0] && clickedBtn[1]){
        
        toggleStartPage();
        pauseGame = false;
    }
}

function toggleStartPage(){
    document.getElementById('p1').classList.toggle('elementSelection');
    document.getElementById('p1').classList.toggle('hidden');

    clickedBtn = [false, false];

    player1Buttons.forEach((item) => {
        if(item.classList.contains('clickedBtn')) item.classList.remove('clickedBtn');
    });

    player2Buttons.forEach((item) => {
        if(item.classList.contains('clickedBtn')) item.classList.remove('clickedBtn');
    });

    setElmntButtonClick();

    document.getElementById('p2').classList.toggle('elementSelection');
    document.getElementById('p2').classList.toggle('hidden');
}

function addClick(){
    
    gameBoxes.forEach((element) =>{
        element.addEventListener('click', () => {
            addPlayerSymbol(element);
        });
    });
}

function addPlayerSymbol(element){

    const boxImg = element.getElementsByClassName('box-img')[0];

    //Get the list of all boxImg tags elements
    const boxImgItems = boxImgs.map((item) => {
        return item.imgTag;
    });

    const listPosition = boxImgItems.indexOf(boxImg);
    //Get a index starting on 1 of boxImgs list
    const index = listPosition + 1;
    // -.001 is to force the math.floor to reduce the number when (index / 3 = integer)
    const divPosition = [index - Math.floor((index -.001) / 3) * 3, Math.ceil(index / 3)];

    if(!pauseGame && boxImgs[listPosition].symbol === ''){
        {    
            if(isXRound){
                
                animate(divPosition, listPosition, player1);
                document.getElementById('player').innerText = 'Jogador: X';
                isXRound = !isXRound;
                return;
            } 

            animate(divPosition, listPosition, player2);
            document.getElementById('player').innerText = 'Jogador: O';
            isXRound = !isXRound;
        }
    }

}

function animate(divPos, listPosition, player){
    //plays the cut sound
    gameSound.src = player.cutSoundPath;
    gameSound.play();

    pauseGame = true;
    const boxImg = boxImgs[listPosition];
    boxImg.imgTag.src = player.animPath;

    setTimeout(() => {
        boxImg.imgTag.src = player.imgPath;
        boxImg.symbol = player.playerSym;

        //plays the element sound
        gameSound.src = player.soundPath;
        gameSound.play();

        pauseGame = false;
        verifyWinner(divPos, listPosition, player.playerSym);
    }, 400);
}

function verifyWinner(divPosition, listPosition ,symbol){

    const oneDimensionId = listPosition + 1;

    let correct = false;

    let neighbours = [0, 0];
    let winnerPos= [];

    //Horizontal
    if(divPosition[0] < 2 ){
        //Is on the left
        neighbours = [1, 2];

    } else if(divPosition[0] > 2 ){
        //Is on the right
        neighbours = [-1, -2];

    } else {
        //Is in the center
        neighbours = [1, -1];
    }
    if(boxImgs[listPosition + neighbours[0]].symbol === symbol && 
        boxImgs[listPosition + neighbours[1]].symbol === symbol && neighbours[0] != 0)
    {
        winnerPos[0] = listPosition;
        winnerPos[1] = listPosition + neighbours[0];
        winnerPos[2] = listPosition + neighbours[1];
        correct = true
    }

    //Vertical
    if(divPosition[1] < 2 ){
        //Is on the top
        neighbours = [3, 6];

    } else if(divPosition[1] > 2 ){
        //Is on the bottom
        neighbours = [-3, -6];

    } else {
        //Is in the center
        neighbours = [3, -3];
    }

    if(boxImgs[listPosition + neighbours[0]].symbol === symbol && 
        boxImgs[listPosition + neighbours[1]].symbol === symbol && neighbours[0] != 0)
    {
        winnerPos[0] = listPosition;
        winnerPos[1] = listPosition + neighbours[0];
        winnerPos[2] = listPosition + neighbours[1];
        correct = true
    }

    //Diagonal
    if(divPosition[0] < 2 && divPosition[1] < 2)
    {
        //Is on Top-Left
        neighbours = [4, 8];
    } 
    else if(divPosition[0] > 2 && divPosition[1] < 2)
    {
        //Is on Top-Right
        neighbours = [2, 4];
    } 
    else if(divPosition[0] < 2 && divPosition[1] > 2)
    {
        //Is on Bottom-Left
        neighbours = [-2,-4];
        
    } 
    else if(divPosition[0] > 2 && divPosition[1] > 2)
    {
        //Is on Bottom-Right
        neighbours = [-4, -8];

    } 
    else if(divPosition[0] === 2 && divPosition[1] === 2)
    {
        //Is on the center
        neighbours = [4, -4]

        //If the first diagonal isn't complete, verify the next
        if(!(boxImgs[listPosition + neighbours[0]].symbol === symbol && 
            boxImgs[listPosition + neighbours[1]].symbol === symbol))
        {
            console.log('verifying 2');
            neighbours = [2, -2];
        }
    }

    if(boxImgs[listPosition + neighbours[0]].symbol === symbol && 
        boxImgs[listPosition + neighbours[1]].symbol === symbol && neighbours[0] != 0)
    {
        winnerPos[0] = listPosition;
        winnerPos[1] = listPosition + neighbours[0];
        winnerPos[2] = listPosition + neighbours[1];
        correct = true
    }


    //Previous code to validate the win condition
    // //verify horizontal
    // let indexH;
    // let indexV;
    // let posH;
    // let posV;
    // let winnerPos= [];

    // const rest = id % 3;

    // //if it's in the line middle
    // if(rest === 2){
    //     indexH = [-1, 1];
    //     posH = 'middle';
    // } else if(rest === 0){

    //     indexH = [-1, -2];
    //     posH = 'right';

    // } else {
    //     indexH = [1, 2];
    //     posH = 'left';
    // }

    // if(boxImgs[arrayId + indexH[0]].symbol === symbol && boxImgs[arrayId + indexH[1]].symbol === symbol) {

    //     winnerPos[0] = arrayId;
    //     winnerPos[1] = arrayId + indexH[0];
    //     winnerPos[2] = arrayId + indexH[1];
    //     correct = true
    // }
    // console.log('Verifying horizontal: '+correct);

    // //verify vertical

    // //if it's in the column middle
    // if(id / 3 <= 2 && id / 3 > 1){
    //     indexV = [-3, 3];
    //     posV = 'middle';
    // } 
    // //if it's in the column bottom
    // else if(id / 3 > 2){
    //     indexV = [-3, -6];
    //     posV = 'bottom';

    // } else {
    //     indexV = [3, 6];
    //     posV = 'top';
    // }

    // if(boxImgs[arrayId + indexV[0]].symbol === symbol && boxImgs[arrayId + indexV[1]].symbol === symbol) {
    //     winnerPos[0] = arrayId;
    //     winnerPos[1] = arrayId + indexV[0];
    //     winnerPos[2] = arrayId + indexV[1];
    //     correct = true;
    // }
    // console.log('Verifying vertical: '+correct);

    // //Verify diagonal

    // if(id === 4){
    //     if(boxImgs[0].symbol == symbol && boxImgs[8].symbol === symbol) {

    //         winnerPos[0] = arrayId;
    //         winnerPos[1] = 0;
    //         winnerPos[2] = 8;
    //         correct = true;
    //     }

    //     if(boxImgs[2].symbol == symbol && boxImgs[6].symbol === symbol) {

    //         winnerPos[0] = arrayId;
    //         winnerPos[1] = 2;
    //         winnerPos[2] = 6;
    //         correct = true;
    //     }

    // } else if(posH != 'middle' && posV != 'middle'){
    //     console.log('entered here');
    //     if(boxImgs[arrayId + indexH[0] + indexV[0]].symbol === symbol && boxImgs[arrayId + indexH[1] + indexV[1]].symbol === symbol) {
            
    //         winnerPos[0] = arrayId;
    //         winnerPos[1] = arrayId + indexV[0] + indexH[0];
    //         winnerPos[2] = arrayId + indexV[1] + indexH[1];

    //         correct = true;
    //     }
    // }

    if(correct){
        pauseGame = true;
        document.getElementById('winner').innerText = 'Vencedor: '+symbol;
        addWinnerColor(winnerPos);
    }
}

function addWinnerColor(id){
    gameBoxes[id[0]].classList.add('winner-color');
    gameBoxes[id[1]].classList.add('winner-color');
    gameBoxes[id[2]].classList.add('winner-color');
}

function reset(){
    boxImgs.forEach((element) =>{
        element.imgTag.src = 'img/transp.png';
        element.symbol = '';
    });

    gameBoxes.forEach((element) => {
        element.classList.remove('winner-color');
    });

    pauseGame = true;

    isXRound = true;
    document.getElementById('player').innerText = 'Jogador: X';

    document.getElementById('winner').innerText = 'Vencedor: ';
    toggleStartPage();
}

document.getElementById('reset-button').addEventListener('click', reset);
addClick();