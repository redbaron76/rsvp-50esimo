import { Link } from '@tanstack/react-router'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-foreground no-underline"
        >
          Festa 11 Luglio
        </Link>
      </nav>
    </header>
  )
}

export default Header
