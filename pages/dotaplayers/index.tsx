import useSWR from 'swr'
import Link from 'next/link'

import Page from '../../components/scaffolding/page'
import { isAdminRole, isDefaultRole } from '../../utils/roles'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function DotaPlayersIndex() {
  const { data, error } = useSWR('/api/dotaplayers', fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const rows = data.sort((a, b) => a.steamId.localeCompare(b.steamId))
    .map(player => (
      <tr key={player.id}>
        <td>
          <Link href={`/dotaplayers/${player.id}`}>
            <a> {player.username} </a>
          </Link>
        </td>
        <td>
          <Link href={`/dotaplayers/${player.id}`}>
            <a> {player.id} </a>
          </Link>
        </td>
        <td>
          <a href={`https://www.dotabuff.com/players/${player.steamId}`}>
            {player.steamId}
          </a>
        </td>
        <td>
          <div> {player.mmr} </div>
        </td>
        <td>
          <a href={`https://www.dotabuff.com/matches/${player.lastMatchId}`}>
            {player.lastMatchId}
          </a>
        </td>
      </tr>
    ))

  return (
    <Page
      isAllowedWithRoles={isDefaultRole}
      page={
        <div class="container">
          <div className="text-xl"> registered dota players </div>
          <table>
            <thead>
              <tr>
                <th> Username </th>
                <th> Discord ID </th>
                <th> Steam ID </th>
                <th> MMR </th>
                <th> Last Match ID </th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      }
    />
  )
}