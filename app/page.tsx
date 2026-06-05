import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/layout'
import { LandingHero } from '@/components/landing/LandingHero'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main className="flex flex-col flex-1 items-center justify-center py-24 px-4">
      <LandingHero />
      <p className="mt-20 text-xs text-[--text-dim]">
        Sigurno za edukacijsku upotrebu · Ugrađena moderacija sadržaja
      </p>
    </main>
  )
}
