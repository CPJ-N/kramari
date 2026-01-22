'use client'

import { useEffect, useState } from 'react'

interface MetricData {
  day: string
  calls: number
  duration: number
}

export function CallMetrics() {
  const [data, setData] = useState<MetricData[]>([])

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: MetricData[] = [
      { day: 'Mon', calls: 45, duration: 135 },
      { day: 'Tue', calls: 52, duration: 158 },
      { day: 'Wed', calls: 38, duration: 114 },
      { day: 'Thu', calls: 65, duration: 195 },
      { day: 'Fri', calls: 72, duration: 216 },
      { day: 'Sat', calls: 28, duration: 84 },
      { day: 'Sun', calls: 24, duration: 72 },
    ]
    setData(mockData)
  }, [])

  const maxCalls = Math.max(...data.map((d) => d.calls))

  return (
    <div className="space-y-4">
      {/* Bar chart */}
      <div className="flex items-end gap-2 h-48">
        {data.map((item) => (
          <div key={item.day} className="flex-1 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <div
                className="w-8 bg-blue-600 rounded-t transition-all hover:bg-blue-700"
                style={{
                  height: `${(item.calls / maxCalls) * 100}%`,
                  minHeight: '4px',
                }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {item.day}
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {item.calls}
            </span>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Calls</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, d) => sum + d.calls, 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(
              data.reduce((sum, d) => sum + d.duration, 0) / data.length / 60
            )}
            m
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Peak Day</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.find((d) => d.calls === maxCalls)?.day}
          </p>
        </div>
      </div>
    </div>
  )
}