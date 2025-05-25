interface StatCardProps {
	title: string;
	value: number | string;
	unit?: string;
	icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
	color: string;
	trend?: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon: Icon, color, trend }) => (
	<div className='bg-white rounded-lg shadow-md p-6 border-l-4' style={{ borderLeftColor: color }}>
		<div className='flex items-center justify-between'>
			<div>
				<p className='text-sm font-medium text-gray-600'>{title}</p>
				<p className='text-2xl font-bold text-gray-900'>
					{value}
					<span className='text-lg text-gray-500 ml-1'>{unit}</span>
				</p>
				{trend && (
					<p className='text-xs text-gray-500 mt-1'>
						Avg: {trend}
						{unit}
					</p>
				)}
			</div>
			<div className='p-3 rounded-full' style={{ backgroundColor: color + '20' }}>
				<Icon size={24} style={{ color }} />
			</div>
		</div>
	</div>
);
export default StatCard;
