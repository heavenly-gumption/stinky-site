import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'
import moment from 'moment-timezone'

import Page from '../../components/scaffolding/page'
import { isAdminRole, isDefaultRole } from '../../utils/roles'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Label } from 'recharts'

const COLOR_LOSS = '#ff4d4d'
const COLOR_WIN = '#9eff6e'

const fetcher = (url) => fetch(url).then((res) => res.json())

const CustomDot = (props) => {
  const { cx, cy, payload, value } = props;
  if (payload.newMMR < payload.oldMMR) {
    return (
      <svg x={cx - 8} y={cy - 8} width={16} height={16} fill={COLOR_LOSS} viewBox="0 0 2 2">
        <path d="M 0 0 H 2 L 1 1 L 0 0"/>
      </svg>
    )
  } else {
    return (
      <svg x={cx - 8} y={cy} width={16} height={16} fill={COLOR_WIN} viewBox="0 0 2 2">
        <path d="M 0 1 H 2 L 1 0 L 0 1"/>
      </svg>
    )
  }
}

export default function DotaPlayersIndex() {
  const router = useRouter()
  const { playerid } = router.query
  const { data, error } = useSWR(playerid ? `/api/dotaplayers/${playerid}` : null, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const timezone = moment.tz.guess()
  const gamesByHour = [];
  for (let i = 0 ; i < 24; i++) {
    gamesByHour[i] = {hour: i, wins: 0, losses: 0}
  }
  for (const game of data.mmrHistory) {
    const hour = moment.tz(game.timestamp, timezone).hour()
    if (game.newMMR > game.oldMMR) {
      gamesByHour[hour].wins += 1
    } else {
      gamesByHour[hour].losses += 1
    }
  }

  const dataToTimestamp = data => {
    return data.timestamp
  }

  const timeFormatter = timestamp => {
    return moment.tz(timestamp, timezone).format('YYYY/MM/DD HH:mm z')
  }

  const dateFormatter = timestamp => {
    return moment(timestamp).format('MM/DD')
  }

  const mmrChart = (
    <ResponsiveContainer height={400}>
      <LineChart
        height={400}
        margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
        data={data.mmrHistory}
      >
        <Line dot={<CustomDot />} type="stepAfter" dataKey="newMMR" stroke="#8884d8" />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis domain={['auto', 'auto']} 
          type="number"
          scale="time"
          tickFormatter={dateFormatter} 
          dataKey='timestamp'>
          <Label value="Date" position="bottom"/>
        </XAxis>
        <YAxis domain={['auto', 'auto']}>
          <Label value="MMR" position="left"/>
        </YAxis>
        <Tooltip labelFormatter={timeFormatter} />
      </LineChart>
    </ResponsiveContainer>
  )

  const gamesByHourChart = (
    <ResponsiveContainer height={400}>
      <BarChart
        height={400}
        margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
        data={gamesByHour}
      >
        <XAxis dataKey="hour">
          <Label value={`Hour (${timezone})`} position="bottom"/>
        </XAxis>
        <YAxis>
          <Label value="Games" position="left"/>
        </YAxis>
        <Tooltip />
        <Bar dataKey="wins" fill={COLOR_WIN}/>
        <Bar dataKey="losses" fill={COLOR_LOSS}/>
      </BarChart>
    </ResponsiveContainer>
  )

  return (
    <Page
      isAllowedWithRoles={isDefaultRole}
      page={
        <div className="container">
          <Link href="/dotaplayers">
            <a> Back </a>
          </Link>
          <hr/>
          <div className="text-xl">
            {data.username} - {data.id}
          </div>
          {mmrChart}
          {gamesByHourChart}
        </div>
      }
    />
  )
}