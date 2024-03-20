import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react'

function App() {

  const amountRef = useRef()
  const fromCountryRef = useRef()
  const toCountryRef = useRef()
  const [data, setData] = useState([])

  useEffect(()=>{
    fetch('./bigMacIndex.csv')
    .then((value)=>{
      console.log("value", value)
      return value.text()
    }).then((value)=>{
      console.log("value", value)
      const rows = value.split("\r\n").splice(1, value.split("\r\n").length-2)
      console.log("rows", rows)
      setData(rows)
    })
  },[])

  const handleChange=()=>{
    const from_country = fromCountryRef.current.value;
    const to_country = toCountryRef.current.value;
    const amount = amountRef.current.value;
    console.log(from_country, amount)
  }

  return (
    <div className="App">

      <div>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Big Mac Index</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((value)=>{
                const country = value.split(",")[0]
                const index = value.split(",")[1]
                return <tr>
                  <td>{country}</td>
                  <td>{index}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>


      <div>
        <label htmlFor='from_country'>From Country</label>
        <select id="from_country" onChange={handleChange} ref={fromCountryRef}>
          {
            data.map((value)=>{
              const country = value.split(",")[0]
              //const index = value.split(",")[1]
              return <option value={country}>
                {country}
              </option>
            })
          }
        </select>
        <label htmlFor='from_amount'>Amount</label>
        <input type="number" ref={amountRef} id="from_amount" onChange={handleChange} />
        <label htmlFor='to_country'>To Country</label>
        <select id="to_country" onChange={handleChange} ref={toCountryRef}>
          {
            data.map((value)=>{
              const country = value.split(",")[0]
              return <option value={country}>
                {country}
              </option>
            })
          }
        </select>
        <label></label>
      </div>
    </div>
  );
}

export default App;
