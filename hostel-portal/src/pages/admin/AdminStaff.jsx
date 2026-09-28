import { getStaffUsers, getComplaints } from '../../utils/storage'

export default function AdminStaff() {
  const staff = getStaffUsers()
  const complaints = getComplaints()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Staff Directory</h1>
        <p className="text-slate-400 text-sm mt-1">Maintenance staff workload and specialties</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {staff.map((s) => {
          const assigned = complaints.filter((c) => c.assignedStaff === s.id)
          const active = assigned.filter((c) => !['Closed'].includes(c.status)).length
          const done = assigned.filter((c) => ['Work Completed', 'Closed'].includes(c.status)).length
          return (
            <div key={s.id} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal font-display font-bold">
                  {s.name[0]}
                </div>
                <div>
                  <p className="font-medium text-slate-100">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.email}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3">Specialty: <span className="text-slate-200">{s.specialty}</span></p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-navy-900/60 rounded-lg py-2"><p className="text-lg font-display font-bold text-white">{assigned.length}</p><p className="text-[10px] text-slate-500">Total</p></div>
                <div className="bg-navy-900/60 rounded-lg py-2"><p className="text-lg font-display font-bold text-amber-400">{active}</p><p className="text-[10px] text-slate-500">Active</p></div>
                <div className="bg-navy-900/60 rounded-lg py-2"><p className="text-lg font-display font-bold text-emerald-400">{done}</p><p className="text-[10px] text-slate-500">Done</p></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
