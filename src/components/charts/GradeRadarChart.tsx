import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { GradeResponse } from '../../types'

interface Props {
  grades: GradeResponse[]
}

export default function GradeRadarChart({ grades }: Props) {
  if (grades.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        성적 데이터가 없습니다.
      </div>
    )
  }

  // 과목별 평균 점수 집계
  const subjectMap: Record<string, { total: number; count: number }> = {}
  for (const g of grades) {
    if (!subjectMap[g.subjectName]) subjectMap[g.subjectName] = { total: 0, count: 0 }
    subjectMap[g.subjectName].total += g.average
    subjectMap[g.subjectName].count += 1
  }

  const data = Object.entries(subjectMap).map(([name, { total, count }]) => ({
    subject: name,
    점수: Math.round(total / count),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar
          name="점수"
          dataKey="점수"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.25}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  )
}
