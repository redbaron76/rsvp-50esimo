import { createFileRoute } from '@tanstack/react-router'
import Home from '@/components/Home'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <Home />
}
