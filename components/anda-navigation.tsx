'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const andModules = [
  { name: 'Directory', href: 'https://neurodiversityalliance.vercel.app/directory', status: 'live' },
  { name: 'Learning', href: 'https://neurodiversityalliance.vercel.app/learning', status: 'live' },
  { name: 'Community', href: 'https://neurodiversityalliance.vercel.app/community', status: 'coming-soon' },
  { name: 'Tools', href: 'https://neurodiversityalliance.vercel.app/tools', status: 'coming-soon' },
  { name: 'Advocacy', href: 'https://neurodiversityalliance.vercel.app/advocacy', status: 'coming-soon' },
] as const

export const ANDANavigation = () => (
  <nav aria-label="ANDA Ecosystem" className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
    {andModules.map(({ name, href, status }) => (
      <Button
        key={name}
        variant={status === 'live' ? 'default' : 'secondary'}
        disabled={status === 'coming-soon'}
        asChild={status === 'live'}
        className={`transition ${
          status === 'coming-soon' ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {status === 'live' ? (
          <Link href={href} target="_blank" rel="noopener noreferrer" className="flex gap-1">
            <span>ANDA {name}</span>
          </Link>
        ) : (
          <span className="flex gap-1">
            <span>ANDA {name}</span>
            <span className="text-[10px] uppercase tracking-wide opacity-60">Soon</span>
          </span>
        )}
      </Button>
    ))}
  </nav>
)
