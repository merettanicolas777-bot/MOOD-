export default function Logo({ className = '' }) {
  return (
    <img
      src="/img/shadday-logo.jpeg"
      alt="Shadday Indumentaria"
      draggable="false"
      className={`shrink-0 select-none rounded-full object-cover ${className}`}
    />
  )
}
