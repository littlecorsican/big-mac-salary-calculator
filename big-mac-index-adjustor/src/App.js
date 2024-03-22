import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react'

function App() {

  const amountRef = useRef()
  const fromCountryRef = useRef()
  const toCountryRef = useRef()
  const outputRef = useRef()
  const [data, setData] = useState([])
  const [taxCalculatorFlag, setTaxCalculatorFlag] = useState(false)
  const fxUrl = "https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=EUR&quote=USD&data_type=general_currency_pair&start_date=2024-03-20&end_date=2024-03-21"
  // https://www.oanda.com/currency-converter/en/?from=EUR&to=USD&amount=1
  // http://customsgc.gov.my/cgi-bin/exchange.cgi
  // https://www.x-rates.com/table/?from=MYR&amount=1

  useEffect(()=>{
    fetch('./bigMacIndex.csv')
    .then((value)=>{
      console.log("value", value)
      return value.text()
    }).then((value)=>{
      console.log("value", value)
      const rows = value.split("\r\n").splice(1, value.split("\r\n").length-2).map((value)=>{
        return [value.split(",")[0], value.split(",")[1]]
      })
      console.log("rows", rows)
      setData(rows)
    })
  },[])

  const handleChange=()=>{
    const from_country = fromCountryRef?.current?.value;
    const to_country = toCountryRef?.current?.value;
    const amount = amountRef?.current?.value;
    console.log(from_country, amount, to_country)

    if (from_country && to_country && amount) {
      const bigMacIndexCountFrom = data.find((value)=>{
        return value[0] == from_country
      })[1].split("$")[1]
      const bigMacIndexCountTo = data.find((value)=>{
        return value[0] == to_country
      })[1].split("$")[1]
      console.log(bigMacIndexCountFrom, bigMacIndexCountTo)
      outputRef.current.innerText = Math.round(parseFloat(bigMacIndexCountFrom) * parseFloat(amount) / parseFloat(bigMacIndexCountTo))

    }
  }

  useEffect(()=>{

  },[taxCalculatorFlag])

  const handleClickTaxCalculator=()=>{
    setTaxCalculatorFlag((taxCalculatorFlag)=>!taxCalculatorFlag)
  }

  return (
    <div className="App" style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>

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
                return <tr>
                  <td>{value[0]}</td>
                  <td>{value[1]}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>


      <div style={{ margin: "4rem", padding: "4rem" }}>
        <div style={{ padding: "1rem" }}>
          <label htmlFor='from_country'>From Country:  </label>
          <select id="from_country" onChange={handleChange} ref={fromCountryRef}>
          {
              data.map((value)=>{
                return <option value={value[0]}>
                  {value[0]}
                </option>
              })
            }
          </select>
        </div>
        <div style={{ padding: "1rem" }}>
          <label htmlFor='from_amount'>Amount:  </label>
          <input type="number" ref={amountRef} id="from_amount" onChange={handleChange} />
        </div>
        <div style={{ padding: "1rem" }}>
          <label htmlFor='to_country'>To Country:  </label>
          <select id="to_country" onChange={handleChange} ref={toCountryRef}>
            {
              data.map((value)=>{
                return <option value={value[0]}>
                  {value[0]}
                </option>
              })
            }
          </select>
        </div>
        <button onClick={handleClickTaxCalculator}>{`Turn ${taxCalculatorFlag? "Off" : "On"} tax calculator`}</button>
        {
          taxCalculatorFlag && <div>
            <form>
              {/* <div style={{ padding: "1rem" }}>
                <label htmlFor='from_amount'>Amount</label>
                <input type="number" ref={amountRef} id="from_amount" onChange={handleChange} />
              </div>
              <div style={{ padding: "1rem" }}>
                <label htmlFor='from_amount'>Amount</label>
                <input type="number" ref={amountRef} id="from_amount" onChange={handleChange} />
              </div> */}
            </form>
          </div>
        }
        <div style={{ margin: "1rem", padding: "1rem" }}>
          <label>You should ask for </label><label id="output" ref={outputRef}></label><label> USD to enjoy the same standard of living</label>
        </div>
      </div>
    </div>
  );
}

export default App;
