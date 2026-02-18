import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

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

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId => 
      <div key={starId} className='star' />
    )}
  </>
)

const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);

  const candidatesAreWrong = utils.sum(candidateNums) > stars;

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
    if (currentStatus == 'used') {
      return;
    }

    //candidateNums
    const newCandidateNums = currentStatus === 'available' ? candidateNums.concat(number) : candidateNums.filter(cn => cn !== number);;

    if (utils.sum(newCandidateNums) !== stars) {
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
          <StarsDisplay count={stars}/>
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
      <div className='timer'>Time Remaining: 10</div>
    </div>
  )
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
    const sets = [[]];
    const sums = [];

    for (let i=0;i<arr.length;i++) {
      for (let j=0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);

        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  }
}

export default StarMatch;
