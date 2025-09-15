import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

function App() {

  const amountRef = useRef()
  const fromCountryRef = useRef()
  const toCountryRef = useRef()
  const outputRef = useRef()
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('table') // 'table' or 'map'
  const [tooltipContent, setTooltipContent] = useState("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [zoom, setZoom] = useState(1)

  // Country name to ISO code mapping
  const countryMapping = {
    "Switzerland": "CHE",
    "Norway": "NOR", 
    "Uruguay": "URY",
    "Sweden": "SWE",
    "Canada": "CAN",
    "United States": "USA",
    "Lebanon": "LBN",
    "Israel": "ISR",
    "United Arab Emirates": "ARE",
    "Australia": "AUS",
    "Argentina": "ARG",
    "Saudi Arabia": "SAU",
    "New Zealand": "NZL",
    "Brazil": "BRA",
    "Singapore": "SGP",
    "Bahrain": "BHR",
    "Kuwait": "KWT",
    "Czech Republic": "CZE",
    "Costa Rica": "CRI",
    "Nicaragua": "NIC",
    "Sri Lanka": "LKA",
    "Oman": "OMN",
    "Croatia": "HRV",
    "Chile": "CHL",
    "Honduras": "HND",
    "Poland": "POL",
    "Peru": "PER",
    "Qatar": "QAT",
    "China": "CHN",
    "Thailand": "THA",
    "South Korea": "KOR",
    "Colombia": "COL",
    "Mexico": "MEX",
    "Guatemala": "GTM",
    "Jordan": "JOR",
    "Pakistan": "PAK",
    "Moldova": "MDA",
    "Vietnam": "VNM",
    "Japan": "JPN",
    "Azerbaijan": "AZE",
    "Philippines": "PHL",
    "Turkey": "TUR",
    "Hong Kong": "HKG",
    "Hungary": "HUN",
    "Taiwan": "TWN",
    "Malaysia": "MYS",
    "Egypt": "EGY",
    "India": "IND",
    "Indonesia": "IDN",
    "South Africa": "ZAF",
    "Romania": "ROU",
    "Venezuela": "VEN"
  }
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


  // Zoom control functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }


  const getCountryColor = (geo) => {
    const countryName = geo.properties.NAME || geo.properties.name || geo.properties.ADMIN || geo.properties.NAME_LONG;
    const countryData = data.find(item => {
      const csvName = item[0];
      return csvName === countryName || 
             csvName === geo.properties.NAME || 
             csvName === geo.properties.name ||
             csvName === geo.properties.ADMIN ||
             csvName === geo.properties.NAME_LONG;
    });
    
    if (!countryData) return "#E5E7EB"; // Default gray for countries without data
    
    const price = parseFloat(countryData[1].split("$")[1]);
    
    // Color coding based on Big Mac price ranges
    if (price >= 6) return "#DC2626"; // Red for expensive
    if (price >= 5) return "#EA580C"; // Orange
    if (price >= 4) return "#D97706"; // Amber
    if (price >= 3) return "#CA8A04"; // Yellow
    if (price >= 2) return "#65A30D"; // Lime
    return "#16A34A"; // Green for cheap
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
          
          {/* Big Mac Index Data Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                📊 Big Mac Index Data
              </h2>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'table'
                    ? 'bg-white text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Table View
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'map'
                    ? 'bg-white text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🗺️ Map View
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-0">
              {activeTab === 'table' ? (
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
              ) : (
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      🎨 Color Legend: <span className="text-red-600">Expensive</span> → <span className="text-green-600">Cheap</span>
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      💡 <strong>Hover over countries</strong> to see Big Mac prices • Click to select for calculator
                    </p>
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Tip:</strong> Try hovering over United States, Switzerland, or India to see tooltips!
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <button
                      onClick={handleZoomOut}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
                      disabled={zoom <= 0.5}
                    >
                      🔍−
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded text-sm font-medium transition-colors"
                    >
                      🎯 Reset
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
                      disabled={zoom >= 2}
                    >
                      🔍+
                    </button>
                    <span className="text-xs text-gray-500 ml-2">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  
                  {/* World Map */}
                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <div 
                      style={{ 
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <ComposableMap
                        projection="geoEqualEarth"
                        projectionConfig={{
                          scale: 80,
                          center: [0, 0]
                        }}
                        width={400}
                        height={250}
                        style={{ width: "100%", height: "auto" }}
                      >
                      <Geographies geography="https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson">
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            // Try to match country names from different possible properties
                            const countryName = geo.properties.NAME || geo.properties.name || geo.properties.ADMIN || geo.properties.NAME_LONG;
                            const countryData = data.find(item => {
                              const csvName = item[0];
                              // More flexible matching - try different property names
                              return csvName === countryName || 
                                     csvName === geo.properties.NAME || 
                                     csvName === geo.properties.name ||
                                     csvName === geo.properties.ADMIN ||
                                     csvName === geo.properties.NAME_LONG;
                            });
                            
                            // Debug logging for first few countries
                            if (geo.rsmKey < 5) {
                              console.log('Country:', countryName, 'CSV Data:', countryData);
                            }
                            
                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={countryData ? getCountryColor(geo) : "#E5E7EB"}
                                stroke="#FFFFFF"
                                strokeWidth={0.5}
                                style={{
                                  default: {
                                    fill: countryData ? getCountryColor(geo) : "#E5E7EB",
                                    stroke: "#FFFFFF",
                                    strokeWidth: 0.5,
                                    outline: "none",
                                  },
                                  hover: {
                                    fill: "#3B82F6",
                                    stroke: "#FFFFFF",
                                    strokeWidth: 1,
                                    outline: "none",
                                  },
                                  pressed: {
                                    fill: "#1D4ED8",
                                    stroke: "#FFFFFF",
                                    strokeWidth: 1,
                                    outline: "none",
                                  },
                                }}
                                onMouseEnter={(event) => {
                                  if (countryData) {
                                    setTooltipContent(`${countryData[0]}: ${countryData[1]}`);
                                    setTooltipPosition({ x: event.clientX, y: event.clientY });
                                    setShowTooltip(true);
                                  } else {
                                    // Show country name even if no Big Mac data
                                    const countryName = geo.properties.NAME || geo.properties.name || geo.properties.ADMIN || geo.properties.NAME_LONG;
                                    setTooltipContent(`${countryName}: No data available`);
                                    setTooltipPosition({ x: event.clientX, y: event.clientY });
                                    setShowTooltip(true);
                                  }
                                }}
                                onMouseLeave={() => setShowTooltip(false)}
                                onClick={() => {
                                  if (countryData && toCountryRef.current) {
                                    toCountryRef.current.value = countryData[0];
                                    handleChange();
                                  }
                                }}
                              />
                            );
                          })
                        }
                      </Geographies>
                    </ComposableMap>
                    </div>
                    
                    {/* Tooltip */}
                    {showTooltip && (
                      <div
                        className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
                        style={{
                          left: tooltipPosition.x - 50,
                          top: tooltipPosition.y - 40,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        {tooltipContent}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
