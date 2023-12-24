import { useState } from 'react'

// Create a header component
const Header = ({ text }) => <h1>{text}</h1>

// Create a button component
const Button = ({ title, onPress }) => <button onClick={onPress}>{title}</button>

// Create a statistic component
const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

// Create a poll statistics component
const Statistics = ({ good, neutral, bad }) => {
  // returns feedback count
  const all = () => (good + neutral + bad)
  // returns weighted average of feedback where good (1); neutral (0); bad (-1)
  const avg = () => ((good * 1) + (neutral * 0) + (bad * -1)) / (all())
  // returns percentage of positive feedback
  const positive = () => (good) / (all()) * (100)

  if (all() > 0) {
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all()} />
          <StatisticLine text="average" value={avg()} />
          <StatisticLine text="positive" value={positive() + ' %'} />
        </tbody>
      </table>
    );
  }
  else {
    return (
      <p>No feedback given</p>
    );
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // actions each button will perform when pressed
  const onGoodPress = () => {
    return (
      () => {
        // notify this button was pressed
        console.log('button good pressed')
        // log previous good button state
        console.log('previous state', good)
        // create new good state
        const newGood = good + 1
        // update state to the new good state
        setGood(newGood)
        // log new good button state
        console.log('new state', newGood)
      }
    )
  }
  const onNeutralPress = () => {
    return (
      () => {
        // notify this button was pressed
        console.log('button neutral pressed')
        // log previous neutral button state
        console.log('previous state', neutral)
        // create new neutral state
        const newNeutral = neutral + 1
        // update state to the new neutral state
        setNeutral(newNeutral)
        // log new neutral button state
        console.log('new state', newNeutral)
      }
    )
  }
  const onBadPress = () => {
    return (
      () => {
        // notify this button was pressed
        console.log('button bad pressed')
        // log previous bad button state
        console.log('previous state', bad)
        // create new bad state
        const newBad = bad + 1
        // update state to the new bad state
        setBad(newBad)
        // log new bad button state
        console.log('new state', newBad)
      }
    )
  }

  return (
    <div>
      <Header text='give feedback' />
      <Button title='good' onPress={onGoodPress()} />
      <Button title='neutral' onPress={onNeutralPress()} />
      <Button title='bad' onPress={onBadPress()} />
      <Header text='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
