import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

/* ================================================================ icons == */
type IconProps = { className?: string; strokeWidth?: number }

const CardsIcon = ({ className = '', strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="6.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M6.5 3.5h11" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.6" />
  </svg>
)
const QuizIcon = ({ className = '', strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M9.6 9.4a2.4 2.4 0 1 1 3.2 2.26c-.6.22-.9.7-.9 1.34v.4"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <circle cx="12" cy="16.4" r="0.9" fill="currentColor" />
  </svg>
)
const ProfileIcon = ({ className = '', strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M5 19.5c1.4-3.4 4-5 7-5s5.6 1.6 7 5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
)
const CheckIcon = ({ className = '' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ArrowIcon = ({ className = '' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const BellIcon = ({ className = '', strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M6 9a6 6 0 1 1 12 0c0 4 1.2 5.4 2 6.3.5.6.1 1.4-.7 1.4H4.7c-.8 0-1.2-.8-.7-1.4C4.8 14.4 6 13 6 9Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
)
const ExpandIcon = ({ className = '' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const BossIcon = ({ className = '', strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M9 11.5l2 2 4-4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const LockIcon = ({ className = '' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)
const SendIcon = ({ className = '' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 12l16-7-7 16-2.5-6.5L4 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
)
const ChipIcon = ({ className = '', strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M10 3.5v2M14 3.5v2M10 18.5v2M14 18.5v2M3.5 10h2M3.5 14h2M18.5 10h2M18.5 14h2"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
)
const OfflineIcon = ({ className = '' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 12.5a10 10 0 0 1 14 0M8 15.8a5.5 5.5 0 0 1 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="19" r="1.1" fill="currentColor" />
    <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

/* ============================================================== content == */
const NICHES = [
  { key: 'science', label: 'Science', glyph: '⌬' },
  { key: 'tech', label: 'Tech', glyph: '⌘' },
  { key: 'history', label: 'History', glyph: '⌛' },
  { key: 'geography', label: 'Geography', glyph: '◈' },
  { key: 'space', label: 'Space', glyph: '✷' },
  { key: 'economy', label: 'Economy', glyph: '⌗' },
  { key: 'culture', label: 'Culture', glyph: '❖' },
  { key: 'health', label: 'Health', glyph: '✚' },
]

const CARDS = [
  {
    tag: 'Science',
    front: 'Octopuses have three hearts — and two of them stop beating when they swim.',
    back: 'The pair pumping blood to the gills pause during swimming, which is partly why octopuses prefer crawling.',
    deep: 'Two branchial hearts push blood through the gills, while a systemic heart circulates it to the body. Swimming strains this system, so octopuses tire quickly and favor crawling.',
  },
  {
    tag: 'Space',
    front: 'A day on Venus is longer than its year.',
    back: 'Venus rotates once every 243 Earth days but orbits the Sun in just 225.',
    deep: 'Venus spins retrograde and extremely slowly. Its sidereal day (243 Earth days) exceeds its orbital period (225 days), so a Venusian solar day works out to about 117 Earth days.',
  },
  {
    tag: 'History',
    front: 'Oxford University is older than the Aztec Empire.',
    back: 'Teaching began at Oxford around 1096; Tenochtitlán was founded in 1325.',
    deep: 'Oxford has evidence of teaching from 1096, expanding rapidly after 1167. The Aztec capital Tenochtitlán was not founded until 1325 — meaning Oxford predates it by over two centuries.',
  },
]

const QUIZ_POOL = [
  {
    subject: 'Space',
    question: 'Which planet in our solar system rotates on its side, with an axial tilt of about 98°?',
    options: [
      { key: 'A', text: 'Neptune' },
      { key: 'B', text: 'Uranus' },
      { key: 'C', text: 'Saturn' },
      { key: 'D', text: 'Mercury' },
    ],
    correct: 'B',
  },
  {
    subject: 'History',
    question: 'The Great Fire of London, which reshaped the medieval city, took place in which year?',
    options: [
      { key: 'A', text: '1492' },
      { key: 'B', text: '1666' },
      { key: 'C', text: '1720' },
      { key: 'D', text: '1801' },
    ],
    correct: 'B',
  },
  {
    subject: 'Science',
    question: 'What is the most abundant gas in Earth’s atmosphere?',
    options: [
      { key: 'A', text: 'Oxygen' },
      { key: 'B', text: 'Carbon dioxide' },
      { key: 'C', text: 'Nitrogen' },
      { key: 'D', text: 'Argon' },
    ],
    correct: 'C',
  },
  {
    subject: 'Geography',
    question: 'Which river carries the greatest volume of water to the ocean?',
    options: [
      { key: 'A', text: 'Nile' },
      { key: 'B', text: 'Yangtze' },
      { key: 'C', text: 'Mississippi' },
      { key: 'D', text: 'Amazon' },
    ],
    correct: 'D',
  },
]

/* ---- rank ladder: E is the entry tier, S the apex --------------------- */
const RANKS = [
  { tier: 'E', min: 0 },
  { tier: 'D', min: 400 },
  { tier: 'C', min: 1000 },
  { tier: 'B', min: 2100 },
  { tier: 'A', min: 3600 },
  { tier: 'S', min: 5600 },
]

type RankInfo = {
  tier: string
  idx: number
  floor: number
  ceil: number
  pct: number
  toNext: number
  glossy: boolean // C+ unlocks glossy card borders
  gold: boolean // A+ unlocks the exclusive gold trim
}

function rankInfo(xp: number): RankInfo {
  let idx = 0
  for (let i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].min) idx = i
  const floor = RANKS[idx].min
  const ceil = idx < RANKS.length - 1 ? RANKS[idx + 1].min : floor
  const pct = ceil > floor ? Math.min(100, ((xp - floor) / (ceil - floor)) * 100) : 100
  return {
    tier: RANKS[idx].tier,
    idx,
    floor,
    ceil,
    pct,
    toNext: Math.max(0, ceil - xp),
    glossy: idx >= 2,
    gold: idx >= 4,
  }
}

const DEFAULT_QUESTS = [
  { id: 'read', text: 'Read 10 Tech cards', goal: 10, progress: 0, xp: 60, claimed: false },
  { id: 'perfect', text: 'Score 100% on a History quiz', goal: 1, progress: 0, xp: 120, claimed: false },
  { id: 'streak', text: 'Maintain your daily streak', goal: 1, progress: 1, xp: 40, claimed: false },
]

type Quest = (typeof DEFAULT_QUESTS)[number]
type Weakness = { subject: string; misses: number }

/* ============================================== persistent (local) state = */
function usePersistent<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* private mode / quota — progress simply stays in memory */
    }
  }, [key, value])
  return [value, setValue] as const
}

/* ==================================================================== app = */
type Tab = 'home' | 'quiz' | 'profile'

export default function App() {
  const [onboarded, setOnboarded] = usePersistent('gk.onboarded', false)
  const [tab, setTab] = useState<Tab>('home')

  const [xp, setXp] = usePersistent('gk.xp', 1250)
  const [streak] = usePersistent('gk.streak', 7)
  const [quests, setQuests] = usePersistent<Quest[]>('gk.quests', DEFAULT_QUESTS)
  const [weaknesses, setWeaknesses] = usePersistent<Weakness[]>('gk.weak', [
    { subject: 'History', misses: 3 },
    { subject: 'Science', misses: 2 },
  ])

  const [systemOpen, setSystemOpen] = useState(false)
  const [deepCard, setDeepCard] = useState<(typeof CARDS)[number] | null>(null)
  const [bossMode, setBossMode] = useState(false)

  const rank = useMemo(() => rankInfo(xp), [xp])
  const claimable = quests.filter((q) => q.progress >= q.goal && !q.claimed).length

  const addXp = (n: number) => setXp((x) => x + n)

  const bumpQuest = (id: string, by = 1) =>
    setQuests((qs) => qs.map((q) => (q.id === id ? { ...q, progress: Math.min(q.goal, q.progress + by) } : q)))

  const claimQuest = (id: string) =>
    setQuests((qs) =>
      qs.map((q) => {
        if (q.id === id && q.progress >= q.goal && !q.claimed) {
          addXp(q.xp)
          return { ...q, claimed: true }
        }
        return q
      }),
    )

  const recordMiss = (subject: string) =>
    setWeaknesses((w) => {
      const found = w.find((x) => x.subject === subject)
      if (found) return w.map((x) => (x.subject === subject ? { ...x, misses: x.misses + 1 } : x))
      return [...w, { subject, misses: 1 }]
    })

  const startBoss = () => {
    setBossMode(true)
    setTab('quiz')
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
      <PhoneFrame rank={rank}>
        {!onboarded ? (
          <Onboarding onDone={() => setOnboarded(true)} />
        ) : (
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
              {tab === 'home' && (
                <HomeScreen
                  rank={rank}
                  streak={streak}
                  claimable={claimable}
                  weaknesses={weaknesses}
                  onOpenSystem={() => setSystemOpen(true)}
                  onExpand={(c) => setDeepCard(c)}
                  onReadCard={() => {
                    addXp(4)
                    bumpQuest('read', 1)
                  }}
                  onStartBoss={startBoss}
                />
              )}
              {tab === 'quiz' && (
                <QuizScreen
                  rank={rank}
                  boss={bossMode}
                  weaknesses={weaknesses}
                  onExitBoss={() => setBossMode(false)}
                  onMiss={recordMiss}
                  onComplete={({ perfect, boss }) => {
                    addXp(boss ? 240 : perfect ? 90 : 45)
                    if (boss) setWeaknesses([])
                  }}
                  onPerfectHistory={() => bumpQuest('perfect', 1)}
                />
              )}
              {tab === 'profile' && <ProfileScreen rank={rank} xp={xp} streak={streak} weaknesses={weaknesses} />}
            </div>
            <TabBar tab={tab} rank={rank} onChange={(t) => { setBossMode(false); setTab(t) }} />
          </div>
        )}

        {systemOpen && (
          <SystemModal quests={quests} rank={rank} onClaim={claimQuest} onClose={() => setSystemOpen(false)} />
        )}
        {deepCard && <DeepDive card={deepCard} onClose={() => setDeepCard(null)} />}
      </PhoneFrame>
    </div>
  )
}

/* ================================================================= frame = */
function PhoneFrame({ children, rank }: { children: ReactNode; rank: RankInfo }) {
  // The device edge itself evolves with rank: sage → glossy → gold trim.
  const trim = rank.gold
    ? '0 0 0 1.5px rgba(201,162,75,0.55), 0 40px 120px rgba(61,66,53,0.45)'
    : rank.glossy
      ? '0 0 0 1.5px rgba(119,136,115,0.5), 0 40px 120px rgba(61,66,53,0.4)'
      : '0 40px 120px rgba(61,66,53,0.38), inset 0 0 0 1.5px rgba(255,255,255,0.5)'
  return (
    <div className="relative">
      <div
        className="relative h-[812px] w-[375px] overflow-hidden rounded-[46px] border border-[#3d4235]/10 bg-[var(--bg)]"
        style={{ boxShadow: trim }}
      >
        {/* status bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-11 items-center justify-between px-7 pt-2">
          <span className="font-mono text-[13px] tracking-tight text-[#3d4235]/90">9:41</span>
          <div className="absolute left-1/2 top-2 h-6 w-28 -translate-x-1/2 rounded-full bg-[#3d4235]" />
          <div className="flex items-center gap-1.5 text-[#3d4235]/80">
            <div className="flex h-2.5 items-end gap-[2px]">
              <span className="h-1 w-[3px] rounded-sm bg-[#3d4235]/80" />
              <span className="h-1.5 w-[3px] rounded-sm bg-[#3d4235]/80" />
              <span className="h-2 w-[3px] rounded-sm bg-[#3d4235]/80" />
              <span className="h-2.5 w-[3px] rounded-sm bg-[#3d4235]/40" />
            </div>
            <div className="ml-0.5 h-2.5 w-5 rounded-[3px] border border-[#3d4235]/50 p-[1.5px]">
              <div className="h-full w-3/4 rounded-[1px] bg-[#3d4235]/80" />
            </div>
          </div>
        </div>
        <div className="h-full pt-11">{children}</div>
      </div>
    </div>
  )
}

/* ============================================================ onboarding = */
function Onboarding({ onDone }: { onDone: () => void }) {
  const [selected, setSelected] = useState<string[]>(['science', 'space'])
  const toggle = (k: string) => setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))
  const enough = selected.length >= 3

  return (
    <div className="flex h-full flex-col px-6 pb-8">
      <div className="pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">The System · Step 1</p>
        <h1 className="font-display mt-4 text-[30px] font-bold leading-[1.12] tracking-tight">
          What sparks
          <br />
          your curiosity?
        </h1>
        <p className="mt-3 max-w-[16rem] text-[14px] leading-relaxed text-[#3d4235]/60">
          Pick at least three niches. Everything stays on your device — we tune your daily facts and quests locally.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {NICHES.map((n) => {
          const on = selected.includes(n.key)
          return (
            <button
              key={n.key}
              onClick={() => toggle(n.key)}
              className={[
                'group flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-medium transition-all duration-200',
                on
                  ? 'border-transparent bg-[var(--accent)] text-white glow-accent'
                  : 'border-[#3d4235]/12 bg-[#3d4235]/[0.03] text-[#3d4235]/70 hover:border-[#3d4235]/25 hover:text-[#3d4235]',
              ].join(' ')}
            >
              <span className={on ? 'text-white/80' : 'text-[var(--accent)]'}>{n.glyph}</span>
              {n.label}
            </button>
          )
        })}
      </div>

      <div className="mt-auto">
        <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[#3d4235]/40">
          <span>{selected.length} selected</span>
          <span>{enough ? 'ready' : `pick ${3 - selected.length} more`}</span>
        </div>
        <button
          disabled={!enough}
          onClick={onDone}
          className={[
            'flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-semibold transition-all duration-300',
            enough ? 'bg-[var(--accent)] text-white glow-accent' : 'cursor-not-allowed bg-[#3d4235]/[0.06] text-[#3d4235]/30',
          ].join(' ')}
        >
          Begin at E-rank
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/* ============================================================ rank badge = */
function RankBadge({ rank, size = 'md' }: { rank: RankInfo; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14 text-[26px]' : size === 'sm' ? 'h-8 w-8 text-[14px]' : 'h-10 w-10 text-[18px]'
  const style = rank.gold
    ? { background: 'linear-gradient(150deg,#e4c877,#c9a24b)', color: '#3a2e12', boxShadow: '0 0 18px rgba(201,162,75,0.6)' }
    : rank.glossy
      ? { background: 'linear-gradient(150deg,#a1bc98,#778873)', color: '#fff', boxShadow: '0 0 16px rgba(119,136,115,0.5)' }
      : { background: '#f4ece0', color: '#778873', boxShadow: 'inset 0 0 0 1.5px rgba(119,136,115,0.35)' }
  return (
    <div className={`grid ${dim} place-items-center rounded-2xl font-display font-bold`} style={style}>
      {rank.tier}
    </div>
  )
}

/* ============================================================ home/cards = */
function HomeScreen({
  rank,
  streak,
  claimable,
  weaknesses,
  onOpenSystem,
  onExpand,
  onReadCard,
  onStartBoss,
}: {
  rank: RankInfo
  streak: number
  claimable: number
  weaknesses: Weakness[]
  onOpenSystem: () => void
  onExpand: (c: (typeof CARDS)[number]) => void
  onReadCard: () => void
  onStartBoss: () => void
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [drag, setDrag] = useState(0)
  const startX = useRef<number | null>(null)
  const seen = useRef<Set<number>>(new Set([0]))

  const card = CARDS[index % CARDS.length]

  const advance = (dir: 1 | -1) => {
    setFlipped(false)
    setDrag(0)
    setIndex((i) => {
      const nx = (i + dir + CARDS.length) % CARDS.length
      if (!seen.current.has(nx)) {
        seen.current.add(nx)
        onReadCard()
      }
      return nx
    })
  }

  const onDown = (e: React.PointerEvent) => (startX.current = e.clientX)
  const onMove = (e: React.PointerEvent) => {
    if (startX.current === null) return
    setDrag(e.clientX - startX.current)
  }
  const onUp = () => {
    if (Math.abs(drag) > 90) advance(drag < 0 ? 1 : -1)
    else setDrag(0)
    startX.current = null
  }

  const border = rank.gold
    ? '1.5px solid rgba(201,162,75,0.6)'
    : rank.glossy
      ? '1.5px solid rgba(119,136,115,0.55)'
      : '1px solid rgba(61,66,53,0.1)'

  return (
    <div className="flex h-full flex-col px-6">
      <header className="flex items-center justify-between pt-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">Daily News · Aug 13</p>
          <h1 className="font-display mt-1 text-[27px] font-bold leading-tight tracking-tight">Today&rsquo;s Facts</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-[#3d4235]/[0.05] px-3 py-1.5">
            <span className="text-[13px]">🔥</span>
            <span className="font-display text-[14px] font-bold leading-none text-[var(--accent)]">{streak}</span>
          </div>
          <button onClick={onOpenSystem} className="relative grid h-10 w-10 place-items-center rounded-full bg-[#3d4235]/[0.05] text-[#3d4235]/70 transition hover:bg-[#3d4235]/10">
            <BellIcon className="h-5 w-5" />
            {claimable > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--accent)] font-mono text-[9px] font-bold text-white">
                {claimable}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* one slim status line: rank + progress to next tier */}
      <div className="mt-5 flex items-center gap-3">
        <RankBadge rank={rank} size="sm" />
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3d4235]/10">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${rank.pct}%`, boxShadow: '0 0 10px rgba(119,136,115,0.6)' }} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#3d4235]/45">{rank.toNext} XP</span>
      </div>

      {/* card stack — the hero, given the most room */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
        <div className="absolute h-[92%] w-[86%] translate-y-5 scale-[0.9] rounded-[30px] border border-[#3d4235]/[0.06] bg-[#3d4235]/[0.02]" />
        <div className="absolute h-[94%] w-[92%] translate-y-2.5 scale-[0.95] rounded-[30px] border border-[#3d4235]/[0.07] bg-[#3d4235]/[0.03]" />

        <div
          key={index}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onClick={() => Math.abs(drag) < 6 && setFlipped((f) => !f)}
          className="animate-card-in relative h-[96%] w-full cursor-pointer touch-none select-none"
          style={{
            transform: `translateX(${drag}px) rotate(${drag * 0.03}deg)`,
            transition: startX.current === null ? 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' : 'none',
          }}
        >
          <div className="relative h-full w-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'none' }}>
            <CardFace border={border}>
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {card.tag}
                </span>
                <span className="font-mono text-[11px] text-[#3d4235]/40">Aug 13</span>
              </div>
              <p className="font-display mt-auto text-[26px] font-semibold leading-[1.24] tracking-tight">{card.front}</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-[#3d4235]/40">
                <span className="h-4 w-4 rounded-full border border-[#3d4235]/30" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Tap to flip</span>
              </div>
            </CardFace>

            <CardFace border={border} back>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">The detail</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onExpand(card)
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-[11px] font-semibold text-white glow-accent transition active:scale-95"
                >
                  <ExpandIcon className="h-3.5 w-3.5" /> Ask Kihoro
                </button>
              </div>
              <p className="font-display mt-auto text-[20px] font-medium leading-[1.4] text-[#3d4235]/90">{card.back}</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-[#3d4235]/40">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Swipe for next</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </div>
            </CardFace>
          </div>
        </div>
      </div>

      <button
        onClick={onStartBoss}
        className="mb-3 flex items-center justify-center gap-2 rounded-full border border-[var(--accent)]/35 bg-[var(--accent-soft)] py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] transition active:scale-[0.99]"
      >
        <BossIcon className="h-4 w-4" />
        Weekly Boss
        {weaknesses.length > 0 && <span className="text-[#3d4235]/45">· {weaknesses.length} weak spots</span>}
      </button>
    </div>
  )
}

function CardFace({ children, border, back = false }: { children: ReactNode; border: string; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col rounded-[30px] p-7"
      style={{
        backfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : 'none',
        border,
        background: 'linear-gradient(158deg, #fffdf9 0%, #f4ece0 60%, #e9ded0 100%)',
        boxShadow: '0 22px 50px rgba(61,66,53,0.16), inset 0 1px 0 rgba(255,255,255,0.7)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-[30px] bg-gradient-to-b from-white/60 to-transparent" />
      {children}
    </div>
  )
}

/* ================================================================== quiz = */
function QuizScreen({
  rank,
  boss,
  weaknesses,
  onExitBoss,
  onMiss,
  onComplete,
  onPerfectHistory,
}: {
  rank: RankInfo
  boss: boolean
  weaknesses: Weakness[]
  onExitBoss: () => void
  onMiss: (subject: string) => void
  onComplete: (r: { perfect: boolean; boss: boolean }) => void
  onPerfectHistory: () => void
}) {
  // Boss quizzes are assembled from the subjects the user is weakest at.
  const questions = useMemo(() => {
    if (boss) {
      const subs = weaknesses.map((w) => w.subject)
      const picked = QUIZ_POOL.filter((q) => subs.includes(q.subject))
      return (picked.length ? picked : QUIZ_POOL).slice(0, 3)
    }
    return QUIZ_POOL.slice(0, 3)
  }, [boss, weaknesses])

  const [bossIntro, setBossIntro] = useState(boss)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [time, setTime] = useState(20)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setBossIntro(boss)
    setStep(0)
    setPicked(null)
    setTime(20)
    setCorrectCount(0)
    setDone(false)
  }, [boss])

  useEffect(() => {
    if (picked || done || bossIntro) return
    if (time === 0) {
      // running out of time counts as a miss on this subject
      setPicked('__timeout__')
      onMiss(q.subject)
      return
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, picked, done, bossIntro])

  const q = questions[step]
  const answered = picked !== null
  const isLast = step === questions.length - 1

  const choose = (key: string) => {
    if (answered) return
    setPicked(key)
    if (key === q.correct) setCorrectCount((c) => c + 1)
    else onMiss(q.subject)
  }

  const next = () => {
    if (isLast) {
      const perfect = correctCount === questions.length
      if (perfect && questions.some((x) => x.subject === 'History')) onPerfectHistory()
      onComplete({ perfect, boss })
      setDone(true)
      return
    }
    setStep((s) => s + 1)
    setPicked(null)
    setTime(20)
  }

  if (bossIntro) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-7 text-center">
        <div className="w-full rounded-3xl border border-[var(--accent)]/45 bg-white/70 p-7 glow-accent" style={{ backdropFilter: 'blur(4px)' }}>
          <BossIcon className="mx-auto h-12 w-12 text-[var(--accent)]" strokeWidth={1.4} />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">System Alert</p>
          <h2 className="font-display mt-2 text-[26px] font-bold tracking-tight">Weekly Boss Battle</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-[#3d4235]/65">
            A cumulative gauntlet built from your weakest subjects. Clear it to wipe your weak spots and claim +240 rank XP.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {(weaknesses.length ? weaknesses : [{ subject: 'General', misses: 0 }]).map((w) => (
              <span key={w.subject} className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                {w.subject}
              </span>
            ))}
          </div>
          <button onClick={() => setBossIntro(false)} className="mt-6 w-full rounded-2xl bg-[var(--accent)] py-3.5 text-[15px] font-semibold text-white glow-accent">
            Enter the battle
          </button>
          <button onClick={onExitBoss} className="mt-2 w-full py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#3d4235]/40">
            Retreat
          </button>
        </div>
      </div>
    )
  }

  if (done) {
    const perfect = correctCount === questions.length
    return (
      <div className="flex h-full flex-col items-center justify-center px-7 text-center">
        <RankBadge rank={rank} size="lg" />
        <h2 className="font-display mt-5 text-[26px] font-bold tracking-tight">
          {boss ? 'Boss Cleared!' : perfect ? 'Flawless!' : 'Quiz Complete'}
        </h2>
        <p className="mt-2 font-mono text-[13px] tracking-wide text-[#3d4235]/60">
          {correctCount}/{questions.length} correct
        </p>
        <div className="mt-4 rounded-2xl bg-[var(--accent-soft)] px-5 py-2.5 font-display text-[18px] font-bold text-[var(--accent)]">
          +{boss ? 240 : perfect ? 90 : 45} XP
        </div>
        {boss && <p className="mt-4 max-w-[15rem] text-[13px] leading-relaxed text-[#3d4235]/60">Your weak subjects have been reset. The System recognizes your growth.</p>}
        <button
          onClick={() => {
            onExitBoss()
            setStep(0)
            setPicked(null)
            setTime(20)
            setCorrectCount(0)
            setDone(false)
          }}
          className="mt-7 w-full rounded-2xl bg-[var(--accent)] py-3.5 text-[15px] font-semibold text-white glow-accent"
        >
          Continue
        </button>
      </div>
    )
  }

  const pct = ((step + (answered ? 1 : 0)) / questions.length) * 100

  return (
    <div className="flex h-full flex-col px-6 pb-4">
      <div className="pt-5">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[#3d4235]/45">
          <span>
            Question {step + 1}
            <span className="text-[#3d4235]/25">/{questions.length}</span>
          </span>
          <span className={boss ? 'text-[var(--accent)]' : ''}>{boss ? 'Boss Battle' : 'General Knowledge'}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3d4235]/10">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${pct}%`, boxShadow: '0 0 12px rgba(119,136,115,0.7)' }} />
          </div>
          <TimerRing seconds={time} total={20} />
        </div>
      </div>

      <div className="mt-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--accent)]">{q.subject}</p>
        <h2 className="font-display mt-3 text-[23px] font-semibold leading-[1.32] tracking-tight">{q.question}</h2>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {q.options.map((o) => {
          const isPicked = picked === o.key
          const isCorrect = o.key === q.correct
          let state = 'idle'
          if (answered) {
            if (isCorrect) state = 'correct'
            else if (isPicked) state = 'wrong'
            else state = 'dim'
          }
          return (
            <button
              key={o.key}
              disabled={answered}
              onClick={() => choose(o.key)}
              className={[
                'flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200',
                state === 'idle' && 'border-[#3d4235]/10 bg-[#3d4235]/[0.03] hover:border-[#3d4235]/30 hover:bg-[#3d4235]/[0.06] active:scale-[0.99]',
                state === 'correct' && 'border-transparent bg-[var(--accent)] text-white glow-accent',
                state === 'wrong' && 'border-red-400/60 bg-red-500/10',
                state === 'dim' && 'border-[#3d4235]/8 bg-[#3d4235]/[0.02] opacity-45',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className={[
                  'grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg font-mono text-[13px] font-bold',
                  state === 'correct' ? 'bg-white/25 text-white' : 'bg-[#3d4235]/8 text-[#3d4235]/70',
                ].join(' ')}
              >
                {state === 'correct' ? <CheckIcon className="h-4 w-4" /> : o.key}
              </span>
              <span className={['text-[15px] font-medium', state === 'correct' ? 'text-white' : 'text-[#3d4235]/90'].join(' ')}>{o.text}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto pt-6">
        {answered ? (
          <button onClick={next} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-4 text-[15px] font-semibold text-white glow-accent">
            {isLast ? 'Finish' : 'Next question'}
            <ArrowIcon className="h-4 w-4" />
          </button>
        ) : (
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#3d4235]/30">Answer before the timer runs out</p>
        )}
      </div>
    </div>
  )
}

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 15
  const c = 2 * Math.PI * r
  const frac = seconds / total
  const low = seconds <= 5
  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(61,66,53,0.15)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={low ? '#d1655a' : 'var(--accent)'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className={['absolute inset-0 grid place-items-center font-mono text-[12px] font-bold', low ? 'text-[#d1655a]' : 'text-[#3d4235]'].join(' ')}>{seconds}</span>
    </div>
  )
}

/* =============================================================== profile = */
function ProfileScreen({ rank, xp, streak, weaknesses }: { rank: RankInfo; xp: number; streak: number; weaknesses: Weakness[] }) {
  const [localAi, setLocalAi] = usePersistent('gk.localAi', true)
  const [localStore, setLocalStore] = usePersistent('gk.localStore', true)

  const stats = [
    { label: 'Total XP', value: xp.toLocaleString() },
    { label: 'Quiz accuracy', value: '86%' },
    { label: 'Day streak', value: String(streak) },
  ]

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto px-6 pb-6">
      <header className="flex items-center gap-4 pt-6">
        <RankBadge rank={rank} size="lg" />
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-tight">Alex Rivera</h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">Rank {rank.tier} · Scholar</p>
        </div>
      </header>

      {/* rank ladder E → S */}
      <div className="mt-6 rounded-2xl border border-[#3d4235]/10 bg-[#3d4235]/[0.03] p-4">
        <div className="flex items-center justify-between">
          {RANKS.map((r, i) => {
            const reached = i <= rank.idx
            const isGold = r.tier === 'A' || r.tier === 'S'
            return (
              <div key={r.tier} className="flex flex-col items-center gap-1.5">
                <div
                  className="grid h-8 w-8 place-items-center rounded-xl font-display text-[13px] font-bold transition"
                  style={
                    reached
                      ? isGold && rank.gold
                        ? { background: 'linear-gradient(150deg,#e4c877,#c9a24b)', color: '#3a2e12' }
                        : { background: 'var(--accent)', color: '#fff' }
                      : { background: 'transparent', color: 'rgba(61,66,53,0.3)', boxShadow: 'inset 0 0 0 1.5px rgba(61,66,53,0.12)' }
                  }
                >
                  {reached ? r.tier : <LockIcon className="h-3.5 w-3.5" />}
                </div>
                <span className={`font-mono text-[9px] ${reached ? 'text-[var(--accent)]' : 'text-[#3d4235]/30'}`}>{r.tier}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#3d4235]/10">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${rank.pct}%` }} />
        </div>
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#3d4235]/45">
          {rank.gold ? 'Gold trim unlocked' : rank.glossy ? 'Glossy borders unlocked · gold at A-rank' : `Glossy borders unlock at C-rank`}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#3d4235]/10 bg-[#3d4235]/[0.03] p-4 text-center">
            <p className="font-display text-[20px] font-bold text-glow">{s.value}</p>
            <p className="mt-1 font-mono text-[9px] uppercase leading-tight tracking-[0.1em] text-[#3d4235]/45">{s.label}</p>
          </div>
        ))}
      </div>

      {/* weak subjects tracked for boss battles */}
      <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.22em] text-[#3d4235]/40">Tracked weak spots</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {weaknesses.length ? (
          weaknesses.map((w) => (
            <span key={w.subject} className="flex items-center gap-2 rounded-full border border-[#d1655a]/35 bg-[#d1655a]/10 px-3.5 py-2 text-[13px] font-medium text-[#a34a41]">
              {w.subject}
              <span className="font-mono text-[10px] opacity-70">×{w.misses}</span>
            </span>
          ))
        ) : (
          <span className="rounded-full border border-[var(--accent)]/35 bg-[var(--accent-soft)] px-4 py-2 text-[13px] font-medium text-[var(--accent)]">No weak spots — nice.</span>
        )}
      </div>

      {/* privacy */}
      <div className="mt-7 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#3d4235]/40">Privacy</p>
        <span className="flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--accent)]">
          <OfflineIcon className="h-3.5 w-3.5" /> Works offline
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        <SettingRow
          icon={<ChipIcon className="h-5 w-5" />}
          title="On-device AI"
          sub="Quizzes & Deep Dives run locally — habits never leave your phone."
          on={localAi}
          onToggle={() => setLocalAi((v) => !v)}
        />
        <SettingRow
          icon={<LockIcon className="h-5 w-5" />}
          title="Local storage only"
          sub="Progress stored on-device. Zero tracking, full ownership."
          on={localStore}
          onToggle={() => setLocalStore((v) => !v)}
        />
      </div>
    </div>
  )
}

function SettingRow({ icon, title, sub, on, onToggle }: { icon: ReactNode; title: string; sub: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#3d4235]/10 bg-[#3d4235]/[0.03] p-4">
      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-[#3d4235]">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-[#3d4235]/50">{sub}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${on ? 'bg-[var(--accent)]' : 'bg-[#3d4235]/15'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

/* =========================================== SYSTEM window (daily quests) = */
function SystemModal({ quests, rank, onClaim, onClose }: { quests: Quest[]; rank: RankInfo; onClaim: (id: string) => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-5" style={{ background: 'rgba(61,66,53,0.28)', backdropFilter: 'blur(3px)' }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-card-in w-full overflow-hidden rounded-3xl border border-[var(--accent)]/50 bg-white/85 glow-accent"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="border-b border-[var(--accent)]/25 px-6 py-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[var(--accent)]">⟢ Notification ⟣</p>
          <h2 className="font-display mt-1 text-[20px] font-bold tracking-[0.04em] text-[#3d4235]">DAILY QUESTS</h2>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#3d4235]/45">Resets in 07:42:10 · {rank.tier}-rank</p>
        </div>

        <div className="flex flex-col gap-2.5 p-5">
          {quests.map((q) => {
            const complete = q.progress >= q.goal
            return (
              <div key={q.id} className="rounded-2xl border border-[#3d4235]/10 bg-[#3d4235]/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] font-semibold text-[#3d4235]">{q.text}</p>
                  <span className="font-mono text-[11px] text-[var(--accent)]">+{q.xp}</span>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3d4235]/10">
                    <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${(q.progress / q.goal) * 100}%` }} />
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-[#3d4235]/45">
                    {Math.min(q.progress, q.goal)}/{q.goal}
                  </span>
                </div>
                <div className="mt-3">
                  {q.claimed ? (
                    <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-soft)] py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                      <CheckIcon className="h-3.5 w-3.5" /> Claimed
                    </div>
                  ) : complete ? (
                    <button onClick={() => onClaim(q.id)} className="w-full rounded-xl bg-[var(--accent)] py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white glow-accent">
                      Claim reward
                    </button>
                  ) : (
                    <div className="py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#3d4235]/30">In progress</div>
                  )}
                </div>
              </div>
            )
          })}
          <p className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-[#3d4235]/35">
            [ Warning ] Failure to complete daily quests risks streak loss
          </p>
        </div>
        <button onClick={onClose} className="w-full border-t border-[#3d4235]/10 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#3d4235]/55">
          Dismiss
        </button>
      </div>
    </div>
  )
}

/* ================================================== Deep Dive (AI chat) === */
type ChatMsg = { role: 'user' | 'ai'; text: string }

function deepReply(question: string, card: (typeof CARDS)[number]): string {
  const q = question.toLowerCase()
  if (q.includes('why') || q.includes('how')) return `${card.deep} Does that clear up the "how" behind it?`
  if (q.includes('example') || q.includes('like')) return `Think of it this way: ${card.back} ${card.deep.split('. ')[0]}.`
  if (q.includes('more') || q.includes('detail')) return card.deep
  return `Good question. In the context of "${card.tag}": ${card.deep.split('. ')[0]}. Want me to go deeper or simpler?`
}

// Kihoro — a warm, on-device study companion. Slides up over the card and
// stays in the app's olive / cream palette so it feels native, not bolted-on.
function suggestionsFor(card: (typeof CARDS)[number]): string[] {
  const first = (card.deep.match(/\b([A-Z][a-z]+)\b/g) || [])[0] ?? card.tag
  return ['Explain it simply', 'Why is that the case?', `What about ${first}?`, 'Give me an example', 'Go deeper']
}

function DeepDive({ card, onClose }: { card: (typeof CARDS)[number]; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'ai', text: `Hi, I'm Kihoro. Ask me anything about this ${card.tag.toLowerCase()} fact — ${card.deep} What would you like to know?` },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    setMessages((m) => [...m, { role: 'user', text: t }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: deepReply(t, card) }])
      setTyping(false)
    }, 700)
  }

  const suggestions = suggestionsFor(card)

  return (
    <div className="animate-sheet-up absolute inset-0 z-50 flex flex-col overflow-hidden rounded-[46px] bg-[var(--bg)]">
      {/* slim sticky header — miniaturized flashcard keeps the fact in view */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#3d4235]/[0.08] px-5 pb-3 pt-14"
        style={{ background: 'rgba(253,246,237,0.85)', backdropFilter: 'blur(14px)' }}
      >
        <div
          className="flex h-11 w-14 flex-shrink-0 flex-col justify-between rounded-lg p-1.5"
          style={{ background: 'linear-gradient(155deg,#fffdf9,#e9ded0)', boxShadow: 'inset 0 0 0 1px rgba(61,66,53,0.1)' }}
        >
          <span className="font-mono text-[6px] uppercase tracking-[0.14em] text-[var(--accent)]">{card.tag}</span>
          <span className="text-[6.5px] font-medium leading-[1.15] text-[#3d4235]/70 line-clamp-2">{card.front}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#3d4235]/40">Referencing</p>
          <p className="truncate text-[13.5px] font-semibold leading-tight text-[#3d4235]">{card.front}</p>
        </div>
        <button
          onClick={onClose}
          className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#3d4235]/[0.06] text-[#3d4235]/55 transition hover:bg-[#3d4235]/10"
        >
          ✕
        </button>
      </header>

      {/* Kihoro identity */}
      <div className="flex items-center gap-3 px-5 pb-1 pt-4">
        <KihoroMark className="h-10 w-10" />
        <div>
          <p className="font-display text-[17px] font-bold leading-none tracking-tight text-[#3d4235]">Kihoro</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-[#3d4235]/50">
            <OfflineIcon className="h-3 w-3 text-[var(--accent)]" /> Your on-device study companion
          </p>
        </div>
      </div>

      {/* conversation */}
      <div ref={scroller} className="no-scrollbar min-h-0 flex-1 space-y-3.5 overflow-y-auto px-5 py-4">
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[var(--accent)] px-4 py-2.5 text-[14px] leading-relaxed text-white">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2">
              <KihoroMark className="mb-0.5 h-7 w-7 flex-shrink-0" />
              <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-[#3d4235]/10 bg-[#fffdf9] px-4 py-2.5 text-[14px] leading-relaxed text-[#3d4235] shadow-[0_2px_10px_rgba(61,66,53,0.06)]">
                {m.text}
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="flex items-end gap-2">
            <KihoroMark className="mb-0.5 h-7 w-7 flex-shrink-0" />
            <div className="flex gap-1 rounded-2xl rounded-bl-md border border-[#3d4235]/10 bg-[#fffdf9] px-4 py-3">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* quick prompts + input */}
      <div className="border-t border-[#3d4235]/[0.08] px-5 pb-7 pt-3">
        <div className="no-scrollbar -mx-5 mb-3 flex gap-2 overflow-x-auto px-5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="flex-shrink-0 rounded-full border border-[#3d4235]/15 bg-[#3d4235]/[0.03] px-3.5 py-1.5 text-[12.5px] font-medium text-[#3d4235]/75 transition hover:border-[var(--accent)]/50 hover:text-[#3d4235] active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[#3d4235]/12 bg-[#fffdf9] px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask Kihoro a follow-up…"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#3d4235] outline-none placeholder:text-[#3d4235]/35"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-[var(--accent)] text-white glow-accent transition active:scale-95 disabled:opacity-40 disabled:shadow-none"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* Kihoro's mark — a simple olive monogram, warmer than a robot glyph. */
function KihoroMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-full font-display font-bold text-white ${className}`}
      style={{ background: 'linear-gradient(150deg,#a1bc98,#778873)', fontSize: '0.62em', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}
    >
      K
    </span>
  )
}

/* ================================================================ tabbar = */
function TabBar({ tab, rank, onChange }: { tab: Tab; rank: RankInfo; onChange: (t: Tab) => void }) {
  const items: { key: Tab; label: string; Icon: (p: IconProps) => ReactNode }[] = [
    { key: 'home', label: 'Cards', Icon: CardsIcon },
    { key: 'quiz', label: 'Quiz', Icon: QuizIcon },
    { key: 'profile', label: 'Profile', Icon: ProfileIcon },
  ]
  return (
    <nav className="border-t border-[#3d4235]/[0.08] bg-[#fdf6ed]/72 px-8 pb-7 pt-3 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {items.map(({ key, label, Icon }) => {
          const active = tab === key
          return (
            <button key={key} onClick={() => onChange(key)} className="group flex flex-1 flex-col items-center gap-1.5">
              <span
                className={[
                  'grid h-11 w-11 place-items-center rounded-2xl transition-all duration-300',
                  active ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[#3d4235]/45 group-hover:text-[#3d4235]/80',
                ].join(' ')}
                style={active ? { boxShadow: rank.gold ? '0 0 20px rgba(201,162,75,0.35)' : '0 0 20px rgba(119,136,115,0.3)' } : undefined}
              >
                <Icon className="h-6 w-6" strokeWidth={active ? 1.9 : 1.6} />
              </span>
              <span className={['font-mono text-[9px] uppercase tracking-[0.16em] transition-colors', active ? 'text-[var(--accent)]' : 'text-[#3d4235]/35'].join(' ')}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
