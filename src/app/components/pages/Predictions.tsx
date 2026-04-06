import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export function Predictions() {
  const [forecastPeriod, setForecastPeriod] = useState<7 | 30>(7);

  const predictionData = useMemo(() => {
    return Array.from({ length: forecastPeriod }, (_, i) => {
      const baseValue = 20000;
      const trend = i * 500;
      const variance = Math.random() * 2000;
      return {
        day: `Day ${i + 1}`,
        predicted: baseValue + trend + variance,
        actual: i < forecastPeriod / 2 ? baseValue + trend + (Math.random() * 1800) : null,
        upperBound: baseValue + trend + variance + 2000,
        lowerBound: baseValue + trend + variance - 2000,
      };
    });
  }, [forecastPeriod]);

  const modelMetrics = {
    accuracy: 94.2,
    mae: 1250.5,
    mape: 5.8,
    rmse: 1680.3,
  };

  const nextWeekPrediction = 156789;
  const nextMonthPrediction = 687345;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Predictions</h1>
        <p className="text-gray-400">AI-powered sales forecasting and predictions</p>
      </div>

      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#FF3B3B]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Next 7 Days</p>
              <h3 className="text-2xl text-white">${nextWeekPrediction.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">+12.5%</span>
            <span className="text-gray-400">vs previous period</span>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#FF3B3B]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Next 30 Days</p>
              <h3 className="text-2xl text-white">${nextMonthPrediction.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">+18.3%</span>
            <span className="text-gray-400">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Forecast Visualization</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setForecastPeriod(7)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                forecastPeriod === 7
                  ? "bg-[#FF3B3B] text-white"
                  : "bg-[#0B0B0B] text-gray-400 hover:text-white"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setForecastPeriod(30)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                forecastPeriod === 30
                  ? "bg-[#FF3B3B] text-white"
                  : "bg-[#0B0B0B] text-gray-400 hover:text-white"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#FF3B3B"
              strokeWidth={2}
              dot={{ fill: '#FF3B3B', r: 4 }}
              name="Actual Sales"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#666"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#666', r: 4 }}
              name="Predicted Sales"
            />
            <Line
              type="monotone"
              dataKey="upperBound"
              stroke="#444"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              name="Upper Bound"
            />
            <Line
              type="monotone"
              dataKey="lowerBound"
              stroke="#444"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              name="Lower Bound"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <h2 className="text-white mb-4">Model Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-300">Model Accuracy</span>
              </div>
              <span className="text-white">{modelMetrics.accuracy}%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-400">Mean Absolute Error (MAE)</span>
              <span className="text-white">${modelMetrics.mae.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-400">Mean Absolute % Error (MAPE)</span>
              <span className="text-white">{modelMetrics.mape}%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-400">Root Mean Squared Error (RMSE)</span>
              <span className="text-white">${modelMetrics.rmse.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
          <h2 className="text-white mb-4">Forecast Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#0B0B0B] rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm text-white mb-1">Strong Growth Expected</p>
                  <p className="text-sm text-gray-400">Sales projected to increase by 15% next week</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0B0B0B] rounded-lg border-l-4 border-[#FF3B3B]">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF3B3B] mt-0.5" />
                <div>
                  <p className="text-sm text-white mb-1">Stock Alert</p>
                  <p className="text-sm text-gray-400">Consider restocking high-demand items</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0B0B0B] rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-white mb-1">Seasonal Trend</p>
                  <p className="text-sm text-gray-400">Q2 typically shows 20% higher sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
