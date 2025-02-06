import React, { useState, useEffect } from 'react';
import { 
  Sun, Battery, Home, Car, ArrowRight, Cloud, Zap,
  Wind, Droplets, ThermometerSun, DollarSign, Leaf,
  ChevronDown, BatteryCharging, Power, Settings,
  Globe
} from 'lucide-react';

function App() {
  // Existing state
  const [solarOutput, setSolarOutput] = useState(0);
  const [batteryCharge, setBatteryCharge] = useState(50);
  const [carCharge, setCarCharge] = useState(70);
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [weather, setWeather] = useState({ temp: 72, condition: 'sunny', humidity: 45, windSpeed: 8 });
  const [energySaved, setEnergySaved] = useState(0);
  const [co2Reduced, setCo2Reduced] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [isCharging, setIsCharging] = useState(true);
  const [powerUsage, setPowerUsage] = useState({ home: 2.4, car: 7.6, total: 10 });
  const [showDetails, setShowDetails] = useState(false);
  const [efficiency, setEfficiency] = useState(92);

  // Global monitoring state
  const [selectedRegion, setSelectedRegion] = useState('North America');
  const [globalStats, setGlobalStats] = useState({
    totalPowerwall: 458932,
    totalSolarRoof: 234567,
    totalVehicles: 987654,
    globalOutput: 4.5, // GW
    co2Offset: 12.3, // Million tons
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay((prev) => (prev % 24) + 1);
      
      const weatherMultiplier = weather.condition === 'sunny' ? 1 : 0.6;
      const newSolarOutput = timeOfDay >= 6 && timeOfDay <= 18 
        ? Math.sin((timeOfDay - 6) * Math.PI / 12) * 100 * weatherMultiplier
        : 0;
      setSolarOutput(Math.max(0, Math.min(100, newSolarOutput)));

      setBatteryCharge((prev) => {
        const solarContribution = newSolarOutput > 50 ? 1 : -0.5;
        const usageImpact = powerUsage.total > 8 ? -0.8 : -0.3;
        return Math.max(0, Math.min(100, prev + solarContribution + usageImpact));
      });

      setEnergySaved((prev) => prev + (newSolarOutput > 0 ? 0.1 : 0));
      setCo2Reduced((prev) => prev + (newSolarOutput > 0 ? 0.05 : 0));
      setMoneySaved((prev) => prev + (newSolarOutput > 0 ? 0.02 : 0));

      if (Math.random() < 0.1) {
        setWeather(prev => ({
          ...prev,
          temp: prev.temp + (Math.random() * 2 - 1),
          humidity: Math.max(30, Math.min(70, prev.humidity + (Math.random() * 4 - 2))),
          windSpeed: Math.max(0, Math.min(15, prev.windSpeed + (Math.random() * 2 - 1)))
        }));
      }

      setEfficiency(Math.round(90 + (weather.condition === 'sunny' ? 5 : 0) - (weather.temp > 85 ? 3 : 0)));

      setGlobalStats(prev => ({
        ...prev,
        globalOutput: +(prev.globalOutput + (Math.random() * 0.1 - 0.05)).toFixed(2),
        co2Offset: +(prev.co2Offset + 0.01).toFixed(2),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeOfDay, weather, powerUsage]);

  const formatNumber = (num: number, decimals = 1) => num.toFixed(decimals);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <img 
          src="https://images.unsplash.com/photo-1536566482680-fca31930a0bd?auto=format&fit=crop&w=2000"
          alt="Tesla Solar Panels at Sunset"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30">
          <nav className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <Zap className="w-8 h-8 text-white" />
                <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-full">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer text-black font-semibold"
                  >
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia Pacific</option>
                    <option>South America</option>
                    <option>Africa</option>
                  </select>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-gray-800/50 rounded-full transition-colors"
                onClick={() => console.log('Settings clicked')}
              >
                <Settings className="w-6 h-6 text-white hover:text-gray-300 transition-colors" />
              </button>
            </div>
          </nav>
          <div className="container mx-auto px-4 pt-20">
            <div className="flex items-center space-x-4 mb-6">
              <h1 className="text-6xl font-bold">Global Energy Ecosystem</h1>
              <div className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                {selectedRegion}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 mb-2">Total Powerwalls</h3>
                <p className="text-2xl font-bold">{globalStats.totalPowerwall.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 mb-2">Solar Roofs</h3>
                <p className="text-2xl font-bold">{globalStats.totalSolarRoof.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 mb-2">Global Output</h3>
                <p className="text-2xl font-bold">{globalStats.globalOutput} GW</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 mb-2">CO₂ Offset</h3>
                <p className="text-2xl font-bold">{globalStats.co2Offset}M tons</p>
              </div>
            </div>
            <ChevronDown className="w-8 h-8 animate-bounce mt-8" />
          </div>
        </div>
      </div>

      {/* Weather and Time Panel */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Cloud className={`w-5 h-5 mr-2 ${timeOfDay >= 6 && timeOfDay <= 18 ? 'text-yellow-400' : 'text-blue-400'}`} />
                <span className="text-lg font-mono">{timeOfDay.toString().padStart(2, '0')}:00</span>
              </div>
              <div className="flex items-center">
                <ThermometerSun className="w-5 h-5 mr-2 text-red-400" />
                <span>{Math.round(weather.temp)}°F</span>
              </div>
              <div className="flex items-center">
                <Wind className="w-5 h-5 mr-2 text-blue-400" />
                <span>{Math.round(weather.windSpeed)} mph</span>
              </div>
              <div className="flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-blue-400" />
                <span>{Math.round(weather.humidity)}%</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400">System Efficiency: </span>
              <span className={`ml-2 font-bold ${efficiency > 95 ? 'text-green-400' : efficiency > 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                {efficiency}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Dashboard */}
      <div className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Live Energy Flow</h2>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsCharging(!isCharging)}
                  className={`px-4 py-2 rounded-lg ${isCharging ? 'bg-green-500' : 'bg-gray-600'} transition-colors`}
                >
                  {isCharging ? 'Charging' : 'Paused'}
                </button>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Solar Production */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Sun className="w-8 h-8 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-xl">Solar Production</h3>
                      <p className="text-sm text-gray-400">Current Output</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{Math.round(solarOutput)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${solarOutput}%` }}
                  />
                </div>
                {showDetails && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Peak Today</span>
                      <span>7.8 kW</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Daily Average</span>
                      <span>5.2 kW</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Powerwall Status */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Battery className="w-8 h-8 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-xl">Powerwall</h3>
                      <p className="text-sm text-gray-400">Battery Status</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{Math.round(batteryCharge)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-400 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${batteryCharge}%` }}
                  />
                </div>
                {showDetails && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Time to Full</span>
                      <span>{Math.ceil((100 - batteryCharge) / 10)} hours</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Backup Reserve</span>
                      <span>20%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Status */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Car className="w-8 h-8 text-blue-400" />
                    <div className="ml-3">
                      <h3 className="text-xl">Model 3</h3>
                      <p className="text-sm text-gray-400">Vehicle Status</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isCharging && <BatteryCharging className="w-5 h-5 text-green-400 mr-2 animate-pulse" />}
                    <span className="text-2xl font-bold">{Math.round(carCharge)}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-400 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${carCharge}%` }}
                  />
                </div>
                {showDetails && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Range</span>
                      <span>{Math.round(carCharge * 3.5)} mi</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Charging Rate</span>
                      <span>48 mph</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Energy Flow Visualization */}
            <div className="mt-12">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex flex-col items-center">
                  <Sun className="w-16 h-16 text-yellow-400 animate-pulse" />
                  <span>Solar</span>
                  <span className="text-sm text-gray-400">{formatNumber(solarOutput / 10)} kW</span>
                </div>
                <ArrowRight className="w-8 h-8" />
                <div className="flex flex-col items-center">
                  <Battery className="w-16 h-16 text-green-400" />
                  <span>Storage</span>
                  <span className="text-sm text-gray-400">{formatNumber(batteryCharge / 10)} kWh</span>
                </div>
                <ArrowRight className="w-8 h-8" />
                <div className="flex flex-col items-center">
                  <Home className="w-16 h-16 text-purple-400" />
                  <span>Home</span>
                  <span className="text-sm text-gray-400">{powerUsage.home} kW</span>
                </div>
                <ArrowRight className="w-8 h-8" />
                <div className="flex flex-col items-center">
                  <Car className="w-16 h-16 text-blue-400" />
                  <span>Vehicle</span>
                  <span className="text-sm text-gray-400">{powerUsage.car} kW</span>
                </div>
              </div>
            </div>

            {/* Impact Statistics */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <Power className="w-6 h-6 text-yellow-400 mr-2" />
                  <h4 className="text-lg">Energy Saved</h4>
                </div>
                <p className="text-2xl font-bold">{formatNumber(energySaved)} kWh</p>
                <p className="text-sm text-gray-400">Today's Generation</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <Leaf className="w-6 h-6 text-green-400 mr-2" />
                  <h4 className="text-lg">CO₂ Reduced</h4>
                </div>
                <p className="text-2xl font-bold">{formatNumber(co2Reduced)} tons</p>
                <p className="text-sm text-gray-400">Carbon Offset</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-6 h-6 text-green-400 mr-2" />
                  <h4 className="text-lg">Money Saved</h4>
                </div>
                <p className="text-2xl font-bold">${formatNumber(moneySaved)}</p>
                <p className="text-sm text-gray-400">Grid Power Savings</p>
              </div>
            </div>

            {showDetails && (
              <div className="mt-8 bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Predictive Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg mb-2">Next 24 Hours</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Expected Generation</span>
                        <span className="text-green-400">45.2 kWh</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Estimated Usage</span>
                        <span className="text-blue-400">38.7 kWh</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Grid Dependency</span>
                        <span className="text-yellow-400">12%</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg mb-2">Optimization Tips</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-green-400">
                        <Zap className="w-4 h-4 mr-2" />
                        Best charging time: 10:00 AM - 2:00 PM
                      </li>
                      <li className="flex items-center text-yellow-400">
                        <Sun className="w-4 h-4 mr-2" />
                        Peak production expected: 12:30 PM
                      </li>
                      <li className="flex items-center text-blue-400">
                        <Battery className="w-4 h-4 mr-2" />
                        Suggested backup reserve: 30%
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-center py-8">
        <p className="text-gray-500">
          Built with React + TypeScript. Inspired by Tesla's mission for sustainable energy.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <span className="text-sm text-gray-600">Global Energy Management</span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm text-gray-600">Predictive Analytics</span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm text-gray-600">Smart Grid Integration</span>
        </div>
      </footer>
    </div>
  );
}

export default App;