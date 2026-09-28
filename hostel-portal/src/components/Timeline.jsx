const STAGES = ['Submitted', 'Assigned', 'In Progress', 'Work Completed', 'Closed']

export default function Timeline({ timeline = [] }) {
  const reached = new Set(timeline.map((t) => t.status))
  const dateFor = (stage) => timeline.find((t) => t.status === stage)?.date

  return (
    <div className="flex flex-col md:flex-row md:items-start gap-0 md:gap-2 w-full">
      {STAGES.map((stage, idx) => {
        const done = reached.has(stage)
        const date = dateFor(stage)
        return (
          <div key={stage} className="flex md:flex-col items-start md:items-center flex-1 gap-3 md:gap-2">
            <div className="flex md:flex-col items-center gap-2 md:gap-2">
              <div
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  done ? 'bg-accent-teal border-accent-teal' : 'bg-transparent border-slate-600'
                }`}
              />
              {idx < STAGES.length - 1 && (
                <div className={`hidden md:block h-0.5 flex-1 w-full ${done ? 'bg-accent-teal' : 'bg-slate-700'}`} />
              )}
            </div>
            <div className="pb-4 md:pb-0 md:text-center">
              <p className={`text-xs font-semibold ${done ? 'text-slate-100' : 'text-slate-500'}`}>{stage}</p>
              {date && <p className="text-[10px] text-slate-500 mt-0.5">{new Date(date).toLocaleString()}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
