import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      null
    )
  }
  return (
    <h1>Statistics</h1>
  )
}

const StatisticLine = (props) => {
  if (props.all === 0) {
    return(
      null
    )
  }
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.prop} {props.percentage}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics all={all}/>
      <table>
        <tbody>
          <StatisticLine prop={good} all={all} text="good" />
          <StatisticLine prop={neutral} all={all} text="neutral" />
          <StatisticLine prop={bad} all={all} text="bad" />
          <StatisticLine prop={all} all={all} text="all" />
          <StatisticLine prop={(good-bad)/all} all={all} text="average" />
          <StatisticLine prop={(good/all)*100} all={all} text="positive" percentage="%"/>
        </tbody>
      </table> 
    </div>
  )
}

export default App