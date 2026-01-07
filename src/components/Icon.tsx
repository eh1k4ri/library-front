export type IconName =
  | 'home'
  | 'books'
  | 'users'
  | 'loans'
  | 'reservations'
  | 'sparkles'
  | 'star'
  | 'clock'
  | 'tag'

const paths: Record<IconName, JSX.Element> = {
  home: (
    <path
      d="M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V15a2 2 0 0 0-4 0v5.5a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  books: (
    <path
      d="M7 4h8.5a2.5 2.5 0 0 1 0 5H7Zm0 5h8.5a2.5 2.5 0 0 1 0 5H7Zm0 5h8.5a2.5 2.5 0 1 1 0 5H7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  users: (
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  loans: (
    <path
      d="M6 5h9l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 0v3h3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  reservations: (
    <path
      d="M7 4h10a1 1 0 0 1 1 1v14l-6-3.5L6 19V5a1 1 0 0 1 1-1Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  sparkles: (
    <path
      d="M12 3 13 7l3 1-3 1-1 4-1-4-3-1 3-1Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="m12 4 2.1 4.6 5 .6-3.7 3.4 1 4.8L12 15.8l-4.4 2.6 1-4.8L4.9 9.2l5-.6Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  clock: (
    <path
      d="M12 6v6l3 2M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  tag: (
    <path
      d="M4 12 12 4l8 8-6 6H6a2 2 0 0 1-2-2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
}

type IconProps = {
  name: IconName
  size?: number
}

function Icon({ name, size = 18 }: IconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
    >
      {paths[name] ?? paths.star}
    </svg>
  )
}

export default Icon
