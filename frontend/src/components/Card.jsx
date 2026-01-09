import clsx from 'clsx'

export default function Card({ className, children }) {
  return (
    <div className={clsx('rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-glow', className)}>
      {children}
    </div>
  )
}
