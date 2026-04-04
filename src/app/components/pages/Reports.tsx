import { Download, FileText, FileSpreadsheet } from "lucide-react";

export function Reports() {
  const reportTypes = [
    {
      id: "sales",
      title: "Sales Report",
      description: "Comprehensive sales data and trends",
      icon: FileText,
      lastGenerated: "2026-04-03",
    },
    {
      id: "revenue",
      title: "Revenue Report",
      description: "Detailed revenue breakdown by product",
      icon: FileSpreadsheet,
      lastGenerated: "2026-04-03",
    },
    {
      id: "forecast",
      title: "Forecast Report",
      description: "AI predictions and accuracy metrics",
      icon: FileText,
      lastGenerated: "2026-04-04",
    },
    {
      id: "inventory",
      title: "Inventory Report",
      description: "Stock levels and reorder recommendations",
      icon: FileSpreadsheet,
      lastGenerated: "2026-04-02",
    },
  ];

  const summaryInsights = [
    { label: "Total Sales This Month", value: "$1,234,567" },
    { label: "Top Performing Category", value: "Electronics" },
    { label: "Average Order Value", value: "$248.50" },
    { label: "Forecast Accuracy", value: "94.2%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Reports</h1>
        <p className="text-gray-400">Generate and export comprehensive reports</p>
      </div>

      {/* Summary Insights */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <h2 className="text-white mb-4">Summary Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-[#0B0B0B] rounded-lg">
              <p className="text-sm text-gray-400 mb-1">{insight.label}</p>
              <p className="text-xl text-white">{insight.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
                <report.icon className="w-6 h-6 text-[#FF3B3B]" />
              </div>
              <span className="text-xs text-gray-500">Last: {report.lastGenerated}</span>
            </div>

            <h3 className="text-white mb-2">{report.title}</h3>
            <p className="text-sm text-gray-400 mb-6">{report.description}</p>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FF3B3B] text-white rounded-lg hover:bg-[#FF3B3B]/90 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0B0B0B] text-gray-400 rounded-lg hover:bg-[#2A2A2A] hover:text-white border border-[#2A2A2A] transition-colors">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <h2 className="text-white mb-4">Recent Report Activity</h2>
        <div className="space-y-3">
          {[
            {
              report: "Sales Report",
              date: "2026-04-03 14:32",
              user: "Admin",
              format: "CSV",
            },
            {
              report: "Forecast Report",
              date: "2026-04-04 09:15",
              user: "Admin",
              format: "PDF",
            },
            {
              report: "Revenue Report",
              date: "2026-04-03 11:20",
              user: "Admin",
              format: "CSV",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-white">{activity.report}</p>
                  <p className="text-xs text-gray-500">
                    {activity.date} • {activity.user}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#2A2A2A] text-gray-300 text-xs rounded-full">
                {activity.format}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
