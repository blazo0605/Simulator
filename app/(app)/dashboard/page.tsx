import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/server'
import { PageContent } from '@/components/ui/layout'
import { FadeIn, springs } from '@/components/ui/motion'
import { CharacterGrid } from '@/components/dashboard/CharacterGrid'
import type { Character } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('characters')
    .select('*')
    .order('created_at', { ascending: false })

  const characters = (data ?? []) as Character[]

  return (
    <PageContent>
      <FadeIn>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[--text]">Vaši likovi</h1>
              <p className="text-sm text-[--text-muted] mt-0.5">
                {characters.length > 0
                  ? `${characters.length} ${characters.length === 1 ? 'lik' : 'lika'}`
                  : 'Napravi lik da počneš.'}
              </p>
            </div>
            <motion.div
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
            >
              <Link
                href="/characters/new"
                className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white
                           transition-colors"
                style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
              >
                + Novi lik
              </Link>
            </motion.div>
          </div>

          <CharacterGrid characters={characters} />
        </div>
      </FadeIn>
    </PageContent>
  )
}
