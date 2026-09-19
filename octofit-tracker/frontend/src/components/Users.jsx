import { useEffect, useState } from 'react'
import { fetchResource, normalizeCollection } from '../lib/api.js'

function Users() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      try {
        const payload = await fetchResource('users')
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

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header d-flex align-items-center justify-content-between py-3 px-4">
        <div>
          <p className="text-uppercase text-muted small mb-1">Athletes</p>
          <h2 className="h4 mb-0">Users</h2>
        </div>
        <span className="metric-pill">{rows.length} profiles</span>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-muted">Loading users...</div>
        ) : error ? (
          <div className="p-4 text-danger">{error}</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-muted">No users available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Bio</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user._id ?? user.username}>
                    <td><strong>{user.displayName ?? 'Unknown user'}</strong></td>
                    <td>{user.username ?? '—'}</td>
                    <td>{user.email ?? '—'}</td>
                    <td>{user.bio ?? 'No bio provided'}</td>
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

export default Users
