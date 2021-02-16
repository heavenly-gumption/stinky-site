import useSWR from 'swr'
import Page from '../../components/scaffolding/page'
import ClipRow from '../../components/clips/clip-row'
import { isAdminRole, isDefaultRole } from '../../utils/roles'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function ClipsIndex() {
  const { data, error } = useSWR('/api/clips', fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  // Map clips to ClipRow in reverse chronological order
  const rows = data.sort((a, b) => b.time - a.time)
    .map(clip => <ClipRow key={clip.id} clip={clip}/>)

  return (
    <Page
      isAllowedWithRoles={isDefaultRole}
      page={
        <>
          <table>
            <thead>
              <tr>
                <th> ID </th>
                <th> Name </th>
                <th> Date </th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </>
      }
    />
  )
}