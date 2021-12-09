export default function Player({url}) {
  return (
    <audio controls>
      <source src={url} type="audio/ogg"/>
    </audio>
  )
}