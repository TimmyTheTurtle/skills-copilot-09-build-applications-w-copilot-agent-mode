import { useEffect, useState } from 'react'
import { fetchResource, normalizeCollection } from '../lib/api.js'

function Activities() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadActivities() {
      try {
        const payload = await fetchResource('activities')
        const records = normalizeCollection(payload)

        if (isMounted) {
          setRows(records)
          setError('')
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadActivities()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header d-flex align-items-center justify-content-between py-3 px-4">
        <div>
          <p className="text-uppercase text-muted small mb-1">Fitness log</p>
          <h2 className="h4 mb-0">Activities</h2>
        </div>
        <span className="metric-pill">{rows.length} total</span>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-muted">Loading activities...</div>
        ) : error ? (
          <div className="p-4 text-danger">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-muted">No activities recorded yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>User</th>
                  <th>Team</th>
                  <th>Duration</th>
                  <th>Distance</th>
                  <th>Calories</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((activity) => (
                  <tr key={activity._id ?? `${activity.type}-${activity.completedAt}`}>
                    <td><span className="badge badge-soft rounded-pill">{activity.type}</span></td>
                    <td>{activity.user?.displayName ?? activity.user?.username ?? 'Unknown user'}</td>
                    <td>{activity.team?.name ?? 'No team'}</td>
                    <td>{activity.durationMinutes ?? 0} min</td>
                    <td>{activity.distanceMiles ?? 0} mi</td>
                    <td>{activity.caloriesBurned ?? 0} kcal</td>
                    <td>{activity.completedAt ? new Date(activity.completedAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Activities
