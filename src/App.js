import logo from './logo.svg';
import './App.css';

const StarMatch = () => {
  return (
    <div className='game'>
      <div className='help'>
          Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className='body'>
        <div className='left'>
          <div className='star' />
          <div className='star' />
          <div className='star' />
          <div className='star' />
          <div className='star' />
          <div className='star' />
          <div className='star' />
          <div className='star' />
          <div className='star' />
        </div>
        <div className='right'>
          <button className='number'>1</button>
          <button className='number'>2</button>
          <button className='number'>3</button>
          <button className='number'>4</button>
          <button className='number'>5</button>
          <button className='number'>6</button>
          <button className='number'>7</button>
          <button className='number'>8</button>
          <button className='number'>9</button>
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
