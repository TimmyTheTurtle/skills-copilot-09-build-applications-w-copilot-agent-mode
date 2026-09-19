import { useEffect, useState } from 'react'
import { fetchResource, normalizeCollection } from '../lib/api.js'

function Workouts() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadWorkouts() {
      try {
        const payload = await fetchResource('workouts')
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

    loadWorkouts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header d-flex align-items-center justify-content-between py-3 px-4">
        <div>
          <p className="text-uppercase text-muted small mb-1">Training plans</p>
          <h2 className="h4 mb-0">Workouts</h2>
        </div>
        <span className="metric-pill">{rows.length} plans</span>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-muted">Loading workouts...</div>
        ) : error ? (
          <div className="p-4 text-danger">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-muted">No workouts available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Focus</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Recommended for</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((workout) => (
                  <tr key={workout._id ?? workout.title}>
                    <td><strong>{workout.title}</strong></td>
                    <td>{workout.focus ?? 'General'}</td>
                    <td>{workout.difficulty ?? '—'}</td>
                    <td>{workout.durationMinutes ?? 0} min</td>
                    <td>{Array.isArray(workout.recommendedFor) ? workout.recommendedFor.length : 0}</td>
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

export default Workouts
