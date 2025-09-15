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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🍔 Big Mac Index Salary Calculator
            </h1>
            <p className="text-lg text-gray-600">
              Calculate equivalent salaries across countries using purchasing power parity
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Big Mac Index Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                📊 Big Mac Index Data
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Big Mac Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((value, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {value[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {value[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Salary Calculator */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                💰 Salary Calculator
              </h2>
            </div>
            <div className="p-6 space-y-6">
              
              {/* From Country */}
              <div>
                <label htmlFor='from_country' className="block text-sm font-medium text-gray-700 mb-2">
                  From Country
                </label>
                <select 
                  id="from_country" 
                  onChange={handleChange} 
                  ref={fromCountryRef}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a country...</option>
                  {data.map((value, index) => (
                    <option key={index} value={value[0]}>
                      {value[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor='from_amount' className="block text-sm font-medium text-gray-700 mb-2">
                  Current Salary Amount
                </label>
                <input 
                  type="number" 
                  ref={amountRef} 
                  id="from_amount" 
                  onChange={handleChange}
                  placeholder="Enter your salary amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* To Country */}
              <div>
                <label htmlFor='to_country' className="block text-sm font-medium text-gray-700 mb-2">
                  To Country
                </label>
                <select 
                  id="to_country" 
                  onChange={handleChange} 
                  ref={toCountryRef}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a country...</option>
                  {data.map((value, index) => (
                    <option key={index} value={value[0]}>
                      {value[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tax Calculator Toggle */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={handleClickTaxCalculator}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    taxCalculatorFlag 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {`${taxCalculatorFlag ? '🔴 Turn Off' : '🟢 Turn On'} Tax Calculator`}
                </button>
                
                {taxCalculatorFlag && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      🚧 Tax calculator feature coming soon!
                    </p>
                  </div>
                )}
              </div>

              {/* Result Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-lg text-gray-700 mb-2">
                    💡 Equivalent Salary Recommendation:
                  </p>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    $<span id="output" ref={outputRef} className="text-4xl">0</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    USD to enjoy the same standard of living
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Based on The Economist's Big Mac Index • 
              <a href="https://www.economist.com/big-mac-index" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                Learn more about the Big Mac Index
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
