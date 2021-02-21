import { Clip } from "../../types/models"
import Link from 'next/link'

export default function ClipRow({clip}) {
  const date = new Date(clip.time)
  return (
    <tr>
      <td className="text-blue-500 hover:text-blue-600">
        <Link href={`/clips/${clip.id}`}>
          {clip.id}
        </Link>
      </td>
      <td> {clip.name} </td>
      <td> {date.toLocaleDateString("en-US")} </td>
    </tr>
  )
}