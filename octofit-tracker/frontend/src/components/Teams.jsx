import { useEffect, useState } from 'react'
import { fetchResource, normalizeCollection } from '../lib/api.js'

function Teams() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTeams() {
      try {
        const payload = await fetchResource('teams')
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

    loadTeams()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header d-flex align-items-center justify-content-between py-3 px-4">
        <div>
          <p className="text-uppercase text-muted small mb-1">Groupings</p>
          <h2 className="h4 mb-0">Teams</h2>
        </div>
        <span className="metric-pill">{rows.length} teams</span>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-muted">Loading teams...</div>
        ) : error ? (
          <div className="p-4 text-danger">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-muted">No teams registered yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Motto</th>
                  <th>City</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((team) => (
                  <tr key={team._id ?? team.name}>
                    <td><strong>{team.name}</strong></td>
                    <td>{team.motto ?? 'No motto yet'}</td>
                    <td>{team.city ?? 'Unknown city'}</td>
                    <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
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

export default Teams
