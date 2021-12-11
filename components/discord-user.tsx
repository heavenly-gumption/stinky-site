import useSWR from 'swr'

import styles from '../styles/DiscordUser.module.css'

type Props = {
  id: string
}

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function DiscordUser(props: Props) {
  const { data, error } = useSWR(`/api/discord/users/${props.id}`, fetcher)

  const defaultAvatarSrc = 'https://cdn.discordapp.com/embed/avatars/0.png'

  if (error) return <div>NO USER FOUND</div>
  if (!data) {
    return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <img src={defaultAvatarSrc}/>
      </div>
      <div>
        { props.id }
      </div>
    </div>
    )
  }

  const avatarSrc = data.avatar ? 
    `https://cdn.discordapp.com/avatars/${props.id}/${data.avatar}.png` :
    defaultAvatarSrc
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <img src={avatarSrc}/>
      </div>
      <div>
        {data.username}
      </div>
    </div>
  )
}