"use strict";

const vocabulary = [
    { id: 1, rus: 'Яблоко', eng: 'Apple', exapmle: "You wouldn't like an apple, would you?" },
    { id: 2, rus: 'Поезд', eng: 'Train', exapmle: "I have missed my train, said Poirot." },
    { id: 3, rus: 'Kлавиатура', eng: 'Keyboard', exapmle: "It's a little toy keyboard" },
    { id: 4, rus: 'Ковер', eng: 'Carpet', exapmle: "That's a magic carpet?" },
    { id: 5, rus: 'Подушка', eng: 'Pillow', exapmle: "Look under my pillow" },
    { id: 6, rus: 'Счетчик', eng: 'Counter', exapmle: "I reset that counter last night" },
    { id: 7, rus: 'Цветок', eng: 'Flower', exapmle: "Look at the flower" },
    { id: 8, rus: 'Сайт', eng: 'Website', exapmle: "Those websites actually work?" },
    { id: 9, rus: 'Поддержка', eng: 'Support', exapmle: "He needed support, but instead he was being pushed down into a pit." },
    { id: 10, rus: 'Пример', eng: 'Example', exapmle: "You want to set a better example for your sister!" },

];


const buttonNext = document.querySelector('#next');
const buttonBack = document.querySelector('#back');
const engWord = document.querySelector('#eng');
const rusWord = document.querySelector('#rus');
const example = document.querySelector('#example');
const buttonExam = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const allExamCards = examCards.children;
const cards = document.querySelector('.study-cards');
let currentWord = document.querySelector('#current-word');
const card = document.querySelector('.flip-card');



const randomIndexes = _.shuffle(_.range(0, 10)).slice(0, 5);
let currentCardIndex = -1;

function fillNextTestCard() {
    let currentIndex = 0;
    for (currentCardIndex; currentCardIndex < randomIndexes.length - 1;) {
        currentCardIndex = currentCardIndex + 1;
        currentIndex = randomIndexes[currentCardIndex];
        engWord.innerHTML = vocabulary[currentIndex].eng;
        rusWord.innerHTML = vocabulary[currentIndex].rus;
        example.innerHTML = vocabulary[currentIndex].exapmle;
        currentWord.innerHTML = currentCardIndex + 1;
        break;
    }
}

function fillPreviousTestCard() {
    let currentIndex = 0;
    for (currentCardIndex; currentCardIndex >= 0;) {
        currentCardIndex = currentCardIndex - 1;
        currentIndex = randomIndexes[currentCardIndex];
        engWord.innerHTML = vocabulary[currentIndex].eng;
        rusWord.innerHTML = vocabulary[currentIndex].rus;
        example.innerHTML = vocabulary[currentIndex].exapmle;
        currentWord.textContent = currentCardIndex + 1;
        break;
    }
}

function btnDisable(button) {
    button.setAttribute('disabled', '');
}

function btnEnable(button) {
    button.removeAttribute('disabled');
}


function checkExamCards() {
    for (let card of allExamCards) {
        if (card.classList.contains('correct')) {
            return card;
        }
    }
};

function checkExamCardsAmount() {
    let fadedCards = 0;
    for(let card of allExamCards) {
        if(card.classList.contains('fade-out')){
           fadedCards = fadedCards + 1;
        }
    }
    if(fadedCards===10){
        alert('Экзамен успешно пройден!');
    }
}

function checkBtn(currentCardIndex) {
    if (currentCardIndex >= randomIndexes.length - 1) {
        btnDisable(buttonNext);
    }
    else if (currentCardIndex > 0 && currentCardIndex < randomIndexes.length - 1) {
        btnEnable(buttonNext);
        btnEnable(buttonBack);
    }
    else if (currentCardIndex <= 0) {
        btnEnable(buttonNext);
        btnDisable(buttonBack);
    }
}



function carusel(cards) {
    cards.innerHTMl = '';
    [...cards.children]
        .sort(() => Math.random() - 0.5)
        .forEach(v => cards.append(v));
}

function startExam() {
    cards.classList.add('hidden');
    const fragment = new DocumentFragment();
    let currentIndex = 0;
    for (let counter = 0; counter < randomIndexes.length; counter++) {
        const divEng = document.createElement('div');
        const divRus = document.createElement('div');
        divRus.classList.add('card');
        divEng.classList.add('card');
        currentIndex = randomIndexes[counter];
        divEng.innerHTML = vocabulary[currentIndex].eng;
        divRus.innerHTML = vocabulary[currentIndex].rus;
        fragment.append(divEng);
        fragment.append(divRus);
        carusel(fragment);
    }
    examCards.append(fragment);
}



function selectExamCard(event) {
    const element = event.target;
    const firstCard = checkExamCards();

    if (element.classList.contains('card') && !element.classList.contains('fade-out') && firstCard === undefined) {
        element.classList.add('correct');
    }
    else if (element.classList.contains('card') && firstCard != undefined && !element.classList.contains('fade-out')) {
        const firstWordId = vocabulary.find(word => word.rus === firstCard.textContent || word.eng === firstCard.textContent).id;
        const secondWordId = vocabulary.find(word => word.rus == element.textContent || word.eng == element.textContent).id;
        const firstWordText = firstCard.textContent;
        if (firstWordId === secondWordId && firstWordText!=event.target.textContent) {
            element.classList.add('correct');
            element.classList.add('fade-out');
            firstCard.classList.add('fade-out');
            setTimeout(function () {
                element.classList.remove('correct');
                firstCard.classList.remove('correct');
            }, 500);
            setTimeout(checkExamCardsAmount, 1100);
         
        }
        else {
            element.classList.add('wrong');
            setTimeout(function () {
                element.classList.remove('wrong');
                firstCard.classList.remove('correct');
            }, 500);
            
        }
    }
    
}


fillNextTestCard();
checkBtn(currentCardIndex);


card.addEventListener('click', function () {
    card.classList.toggle('active');
});


buttonNext.addEventListener('click', function () {
    fillNextTestCard();
    checkBtn(currentCardIndex);
});

buttonBack.addEventListener('click', function () {
    fillPreviousTestCard();
    checkBtn(currentCardIndex);
});

buttonExam.addEventListener('click', startExam);

examCards.addEventListener('click', event => selectExamCard(event));



