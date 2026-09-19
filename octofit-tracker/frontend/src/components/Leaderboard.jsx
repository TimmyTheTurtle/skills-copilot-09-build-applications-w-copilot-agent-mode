import { useEffect, useState } from 'react'
import { fetchResource, normalizeCollection } from '../lib/api.js'

function Leaderboard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadLeaderboard() {
      try {
        const payload = await fetchResource('leaderboard')
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

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header d-flex align-items-center justify-content-between py-3 px-4">
        <div>
          <p className="text-uppercase text-muted small mb-1">Competition</p>
          <h2 className="h4 mb-0">Leaderboard</h2>
        </div>
        <span className="metric-pill">Top {rows.length}</span>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-muted">Loading leaderboard...</div>
        ) : error ? (
          <div className="p-4 text-danger">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-muted">No leaderboard entries available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Team</th>
                  <th>Points</th>
                  <th>Goal completion</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((entry) => (
                  <tr key={entry._id ?? `${entry.rank}-${entry.user?._id}`}>
                    <td>#{entry.rank ?? '—'}</td>
                    <td>{entry.user?.displayName ?? entry.user?.username ?? 'Unknown athlete'}</td>
                    <td>{entry.team?.name ?? 'No team'}</td>
                    <td>{entry.points ?? 0}</td>
                    <td>{entry.weeklyGoalCompletion ?? 0}%</td>
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

export default Leaderboard
