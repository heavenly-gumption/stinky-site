import React from 'react'
import styles from '../styles/DiscordUser.module.css'

type Props = {
  id: string
  username: string
  avatar?: string
}

const fetcher = (url) => fetch(url).then((res) => res.json())

function DiscordUser(props: Props) {
  const defaultAvatarSrc = 'https://cdn.discordapp.com/embed/avatars/0.png'
  const avatarSrc = props.avatar ? 
    `https://cdn.discordapp.com/avatars/${props.id}/${props.avatar}.png` :
    defaultAvatarSrc
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <img src={avatarSrc}/>
      </div>
      <div>
        {props.username}
      </div>
    </div>
  )
}

const memoized = React.memo(DiscordUser)
export default memoized