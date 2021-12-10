import { clips2021 } from '../../utils/constants'
import { format } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import Page from '../../components/scaffolding/page'
import SortableTable from '../../components/sortable-table'
import DiscordUser from '../../components/discord-user'
import { isAdminRole, isDefaultRole } from '../../utils/roles'

import styles from '../../styles/ClipsArchive.module.css'

const fetcher = (url) => fetch(url).then((res) => res.json())

const BUCKET_PREFIX = 'https://heavenly-gumption-clips-archive.s3.us-east-2.amazonaws.com/2021/'

export default function ClipsArchive2021() {
  const [ loadedClip, setLoadedClip ] = useState(null)
  const [ selectedUsers, setSelectedUsers ] = useState([])
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current === null) {
      return
    }
    audioRef.current.pause()
    audioRef.current.load()
  }, [loadedClip])

  const beforeDate = new Date(2021, 11, 6)
  const afterDate = new Date(2021, 0, 1)

  const selectUser = (id: string) => {
    const idx = selectedUsers.indexOf(id)
    if (idx > -1) {
      selectedUsers.splice(idx, 1)
      setSelectedUsers([...selectedUsers])
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const filter = (row) => {
    for (const user of selectedUsers) {
      if (!row.participants.data.includes(user)) {
        return false
      }
    }
    return true
  }

  // Data manipulation
  const clipsWithDateConverted = clips2021.map(clip => {
    return {
      ...clip,
      time: new Date(clip.time._seconds * 1000)
    }
  })

  const clips = clipsWithDateConverted
  .filter(clip => (clip.time < beforeDate && clip.time > afterDate))
    .sort((a, b) => a.time.getTime() - b.time.getTime())

  const rows = clips.map(clip => {
    const durationSecs = Math.floor((clip.clipend - clip.clipstart) / 48000 / 2)
    return {
      "time": {
        data: new Date(clip.time),
        renderable: format(new Date(clip.time), 'yyyy-MM-dd HH:mm')
      },
      "name": {
        data: clip.name,
        renderable: (
          <button onClick={() => setLoadedClip(clip)}>
            <p> { clip.name } </p>
          </button>
        )
      },
      "duration": {
        data: durationSecs,
        renderable: (
          Math.floor(durationSecs / 60) + ":" + String(durationSecs % 60).padStart(2, '0')
        )
      },
      "participants": {
        data: clip.participants
      }
    }
  })

  // Render
  const pageHeader = loadedClip ? (
    <h3>
      {format(new Date(loadedClip.time), 'yyyy-MM-dd HH:mm')} - {loadedClip.name}
    </h3>
  ) : "Select a clip from the list to play."

  const clipTable = (
    <SortableTable
      headers={[
        { field: "time", name: "Date" },
        { field: "name", name: "Name" },
        { field: "duration", name: "Duration" },
      ]}
      rows={rows}
      filter={filter}
    />
  )

  const player = (
    <div>
      <audio className={styles.audioPlayer} controls ref={audioRef}>
        <source
          src={loadedClip ? `${BUCKET_PREFIX}${loadedClip.id}.pcm.ogg` : ''}
          type="audio/ogg"/>
      </audio>
    </div>
  )

  const userSet: Set<string> = new Set(clips.map(clip => clip.participants).flat())
  const userElems = Array.from(userSet.values())
    .map(id => {
      return (
        <div key={id} className={styles.userFilterItem}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={selectedUsers.includes(id)}
            onChange={() => selectUser(id)}/>
          <DiscordUser
            key={id}
            id={id}
          />
        </div>
      )
    })

  return (
    <Page
      isAllowedWithRoles={isDefaultRole}
      page={
        <>
          <div className={styles.container}>
            <div className={styles.clipPlayer}>
              {pageHeader}
              {player}
            </div>
            <div className={styles.selector}>
              <div className={styles.userFilter}>
                <h3> Clip must include... </h3>
                <div className={styles.userFilterItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedUsers.length === 0}
                    onChange={() => setSelectedUsers([])}/>
                  <p style={{marginLeft: 10}}> Any combination of users </p>
                </div>
                { userElems }
              </div>
              <div className={styles.clipTable}>
                {clipTable}
              </div>
            </div>
          </div>
        </>
      }
    />
  )
}