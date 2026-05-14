import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", sales: 120000 },
  { month: "Feb", sales: 180000 },
  { month: "Mar", sales: 210000 },
  { month: "Apr", sales: 260000 },
  { month: "May", sales: 320000 },
  { month: "Jun", sales: 410000 },
];

function SalesChart() {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
            Revenue Analytics
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Sales Performance
          </h2>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
          +24%
        </div>
      </div>

      <div className="mt-8 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#22c55e"
              fill="url(#salesGradient)"
              strokeWidth={4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesChart;