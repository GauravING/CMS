import clsx from 'clsx'

export default function Input({ className, label, hint, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-xs text-slate-300">{label}</div> : null}
      <input
        className={clsx(
          'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-400/40',
          className
        )}
        {...props}
      />
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </label>
  )
}
