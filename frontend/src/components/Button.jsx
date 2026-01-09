import clsx from 'clsx'

export default function Button({ className, variant = 'primary', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-400/60 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-400',
    ghost: 'bg-transparent text-slate-200 hover:bg-white/5 border border-white/10',
    danger: 'bg-rose-500 text-white hover:bg-rose-400'
  }

  return <button className={clsx(base, variants[variant], className)} {...props} />
}
