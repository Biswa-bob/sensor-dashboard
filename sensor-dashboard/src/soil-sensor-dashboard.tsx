import { Calendar, Droplets, RefreshCw, Thermometer, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import StatCard from './statistic-card';

// Sample data generator
const generateSampleData = () => {
	const data = [];
	const now = new Date();

	for (let i = 23; i >= 0; i--) {
		const time = new Date(now.getTime() - i * 60 * 60 * 1000);
		data.push({
			time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
			fullTime: time.toISOString(),
			temperature: Math.round((20 + Math.sin(i * 0.3) * 8 + Math.random() * 4) * 10) / 10,
			humidity: Math.round((45 + Math.cos(i * 0.2) * 15 + Math.random() * 8) * 10) / 10,
		});
	}
	return data;
};

const SoilSensorDashboard = () => {
	const [data, setData] = useState(generateSampleData());
	const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [lastUpdate, setLastUpdate] = useState(new Date());

	// Auto-refresh data every 30 seconds
	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			setData(generateSampleData());
			setLastUpdate(new Date());
		}, 30000);

		return () => clearInterval(interval);
	}, [autoRefresh]);

	const currentTemp = data[data.length - 1]?.temperature || 0;
	const currentHumidity = data[data.length - 1]?.humidity || 0;
	const avgTemp = Math.round((data.reduce((sum, item) => sum + item.temperature, 0) / data.length) * 10) / 10;
	const avgHumidity = Math.round((data.reduce((sum, item) => sum + item.humidity, 0) / data.length) * 10) / 10;

	const refreshData = () => {
		setData(generateSampleData());
		setLastUpdate(new Date());
	};

	return (
		<div className='min-h-screen bg-gray-50 p-4'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='bg-white rounded-lg shadow-md p-6 mb-6'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>Soil Sensor Dashboard</h1>
							<p className='text-gray-600'>Real-time monitoring of soil conditions</p>
						</div>
						<div className='flex items-center space-x-4 mt-4 sm:mt-0'>
							<div className='flex items-center space-x-2'>
								<Calendar size={16} className='text-gray-500' />
								<span className='text-sm text-gray-600'>
									Last updated: {lastUpdate.toLocaleTimeString()}
								</span>
							</div>
							<button
								onClick={refreshData}
								className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
							>
								<RefreshCw size={16} />
								<span>Refresh</span>
							</button>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
					<StatCard
						title='Current Temperature'
						value={currentTemp}
						unit='°C'
						icon={Thermometer}
						color='#ef4444'
						trend={avgTemp}
					/>
					<StatCard
						title='Current Humidity'
						value={currentHumidity}
						unit='%'
						icon={Droplets}
						color='#3b82f6'
						trend={avgHumidity}
					/>
					<StatCard
						title='Temperature Range'
						value={`${Math.min(...data.map((d) => d.temperature))} - ${Math.max(
							...data.map((d) => d.temperature)
						)}`}
						unit='°C'
						icon={TrendingUp}
						color='#10b981'
					/>
					<StatCard
						title='Humidity Range'
						value={`${Math.min(...data.map((d) => d.humidity))} - ${Math.max(
							...data.map((d) => d.humidity)
						)}`}
						unit='%'
						icon={TrendingUp}
						color='#f59e0b'
					/>
				</div>

				{/* Controls */}
				<div className='bg-white rounded-lg shadow-md p-6 mb-6'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0'>
						<div className='flex items-center space-x-4'>
							<label className='text-sm font-medium text-gray-700'>Time Range:</label>
							<select
								value={selectedTimeRange}
								onChange={(e) => setSelectedTimeRange(e.target.value)}
								className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								<option value='1h'>Last Hour</option>
								<option value='6h'>Last 6 Hours</option>
								<option value='24h'>Last 24 Hours</option>
								<option value='7d'>Last 7 Days</option>
							</select>
						</div>
						<div className='flex items-center space-x-2'>
							<input
								type='checkbox'
								id='autoRefresh'
								checked={autoRefresh}
								onChange={(e) => setAutoRefresh(e.target.checked)}
								className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
							/>
							<label htmlFor='autoRefresh' className='text-sm text-gray-700'>
								Auto-refresh every 30s
							</label>
						</div>
					</div>
				</div>

				{/* Charts Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
					{/* Combined Line Chart */}
					<div className='bg-white rounded-lg shadow-md p-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>Temperature & Humidity Trends</h3>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={data}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='time' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type='monotone'
									dataKey='temperature'
									stroke='#ef4444'
									strokeWidth={2}
									name='Temperature (°C)'
								/>
								<Line
									type='monotone'
									dataKey='humidity'
									stroke='#3b82f6'
									strokeWidth={2}
									name='Humidity (%)'
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					{/* Temperature Area Chart */}
					<div className='bg-white rounded-lg shadow-md p-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>Temperature Distribution</h3>
						<ResponsiveContainer width='100%' height={300}>
							<AreaChart data={data}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='time' />
								<YAxis />
								<Tooltip />
								<Area
									type='monotone'
									dataKey='temperature'
									stroke='#ef4444'
									fill='#ef444420'
									name='Temperature (°C)'
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Humidity Area Chart */}
					<div className='bg-white rounded-lg shadow-md p-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>Humidity Distribution</h3>
						<ResponsiveContainer width='100%' height={300}>
							<AreaChart data={data}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='time' />
								<YAxis />
								<Tooltip />
								<Area
									type='monotone'
									dataKey='humidity'
									stroke='#3b82f6'
									fill='#3b82f620'
									name='Humidity (%)'
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>

					{/* Bar Chart Comparison */}
					<div className='bg-white rounded-lg shadow-md p-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>Last 12 Hours Comparison</h3>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={data.slice(-12)}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='time' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey='temperature' fill='#ef4444' name='Temperature (°C)' />
								<Bar dataKey='humidity' fill='#3b82f6' name='Humidity (%)' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Status Footer */}
				<div className='bg-white rounded-lg shadow-md p-6 mt-6'>
					<div className='flex flex-col sm:flex-row justify-between items-center'>
						<div className='flex items-center space-x-4'>
							<div className='flex items-center space-x-2'>
								<div className='w-3 h-3 bg-green-500 rounded-full'></div>
								<span className='text-sm text-gray-600'>Sensor Online</span>
							</div>
							<div className='flex items-center space-x-2'>
								<div className='w-3 h-3 bg-blue-500 rounded-full'></div>
								<span className='text-sm text-gray-600'>Data Streaming</span>
							</div>
						</div>
						<p className='text-xs text-gray-500 mt-2 sm:mt-0'>
							Dashboard showing simulated soil sensor data • Update frequency: 30 seconds
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SoilSensorDashboard;
