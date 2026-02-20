import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const PlayNumber = props => (
  // What makes click handler access the value of each number
  // each onClick function here closes over the scope of its owner number & gives access to props
  // each onClick handlers has different closures closing over different scopes
  // Stateful functional components depends on closures
  <button 
    className='number'
    style={{ backgroundColor: colors[props.status]}}
    onClick={() => props.onClick(props.number, props.status)}
  >
      {props.number}
  </button>
);

const PlayAgain = props => (
  <div className='game-done'>
    <div 
      className='message'
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green' }}
    >
      {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId => 
      <div key={starId} className='star' />
    )}
  </>
)

const Game = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  // const gameIsWon = availableNums.length === 0;
  const gameStatus = availableNums.length === 0 ? 'won' : secondsLeft === 0 ? 'lost' : 'active';

  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
  }

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong':'candidate';
    }
    return 'available';
  }

  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== 'active' || currentStatus == 'used') {
      return;
    }

    //candidateNums
    const newCandidateNums = currentStatus === 'available' ? candidateNums.concat(number) : candidateNums.filter(cn => cn !== number);;

    if (utils.sum(newCandidateNums) !== stars) {
      console.log('newCandidateNums: ', newCandidateNums);
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(n => !newCandidateNums.includes(n));
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }

  return (
    <div className='game'>
      <div className='help'>
          Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className='body'>
        <div className='left'>
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={resetGame} gameStatus={gameStatus} />
          ) : (
            <StarsDisplay count={stars}/>
          )}
        </div>
        <div className='right'>
          {utils.range(1, 9).map(number => 
            <PlayNumber
             key={number} 
             status={numberStatus(number)}
             number={number}
             onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className='timer'>Time Remaining: {secondsLeft}</div>
    </div>
  )
}

const StarMatch = () => {
  return <Game/>
}

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue'
};

const utils = {
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  range: (min, max) => Array.from({length: max - min + 1}, (_, i) => min + i),

  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  randomSumIn: (arr, max) => {
    console.log("New Candidate Available nums: ", arr);
    const sets = [[]];
    const sums = [];
    
    for (let i=0;i<arr.length;i++) {
      for (let j=0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);

        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
          // console.log('sets: ', sets);
          // console.log('sums: ', sums);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  }
}

export default StarMatch;
