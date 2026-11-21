export default function Logo({ className = '' }) {
  return (
    <img
      src="/img/mood-logo.png"
      alt="Mood Indumentaria"
      draggable="false"
      className={`w-auto select-none ${className}`}
    />
  )
}
