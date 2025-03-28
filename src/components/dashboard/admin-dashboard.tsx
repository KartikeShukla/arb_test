"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { supabase } from "@/config/supabase"
import { AlertCircle, RefreshCw } from "lucide-react"

type CaseData = {
  id: string
  name: string
  email: string
  description: string
  status: string
  created_at: string
  updated_at: string
  documents: Document[]
}

type Document = {
  id: string
  filename: string
  url: string
  content_type: string
  size: number
}

type UserData = {
  id: string
  email: string
  full_name: string
  role: string
  approved: boolean
  created_at: string
}

// Status badge component for reusability
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor()}`}>
      {status || 'Pending'}
    </span>
  )
}

// Role badge component
const RoleBadge = ({ role }: { role: string }) => {
  const isAdmin = role === 'Admin'
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
      ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
      {role}
    </span>
  )
}

// Extracted CasesTable component
const CasesTable = ({ 
  cases, 
  onStatusChange 
}: { 
  cases: CaseData[], 
  onStatusChange: (caseId: string, newStatus: string) => void 
}) => {
  if (cases.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-md">
        <p className="text-gray-500">No cases submitted yet</p>
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" aria-labelledby="cases-table-heading">
        <caption id="cases-table-heading" className="sr-only">List of all arbitration cases</caption>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted By
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases.map((caseItem) => (
            <tr key={caseItem.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {caseItem.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {caseItem.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={caseItem.status || 'Pending'} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(caseItem.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <select 
                  className="text-sm border border-gray-300 rounded p-1"
                  value={caseItem.status || 'Pending'}
                  onChange={(e) => onStatusChange(caseItem.id, e.target.value)}
                  aria-label={`Change status for case ${caseItem.name}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Extracted UsersTable component
const UsersTable = ({ 
  users, 
  onApprovalChange 
}: { 
  users: UserData[], 
  onApprovalChange: (userId: string, approved: boolean) => void 
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-md">
        <p className="text-gray-500">No users in the system yet</p>
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" aria-labelledby="users-table-heading">
        <caption id="users-table-heading" className="sr-only">List of all system users</caption>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.full_name || 'Not provided'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.approved ? 'Approved' : 'Not Approved'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => onApprovalChange(user.id, !user.approved)}
                  aria-label={user.approved ? `Revoke access for ${user.email}` : `Approve access for ${user.email}`}
                >
                  {user.approved ? 'Revoke Access' : 'Approve Access'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdminDashboard({ user }: { user: User }) {
  const [cases, setCases] = useState<CaseData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'cases' | 'users'>('cases')

  const fetchData = useCallback(async () => {
    if (!supabase) {
      setError("Unable to connect to the database");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all cases
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (casesError) {
        throw new Error(`Error fetching cases: ${casesError.message}`);
      }
      
      setCases(casesData || []);
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) {
        throw new Error(`Error fetching users: ${usersError.message}`);
      }
      
      setUsers(usersData || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const updateCaseStatus = useCallback(async (caseId: string, newStatus: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', caseId);
      
      if (error) {
        throw new Error(`Error updating case status: ${error.message}`);
      }
      
      // Update local state
      setCases(prev => prev.map(c => 
        c.id === caseId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
      ));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }, []);
  
  const updateUserApproval = useCallback(async (userId: string, approved: boolean) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approved })
        .eq('id', userId);
      
      if (error) {
        throw new Error(`Error updating user approval: ${error.message}`);
      }
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, approved } : u
      ));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }, []);

  // Memoize components for performance
  const casesTableMemo = useMemo(() => 
    <CasesTable cases={cases} onStatusChange={updateCaseStatus} />, 
    [cases, updateCaseStatus]
  );
  
  const usersTableMemo = useMemo(() => 
    <UsersTable users={users} onApprovalChange={updateUserApproval} />, 
    [users, updateUserApproval]
  );

  return (
    <div>
      <div className="bg-primary/5 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage arbitration cases, user access, and platform settings
        </p>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <Button 
          variant={activeView === 'cases' ? "default" : "outline"} 
          onClick={() => setActiveView('cases')}
          aria-pressed={activeView === 'cases'}
        >
          Manage Cases
        </Button>
        <Button 
          variant={activeView === 'users' ? "default" : "outline"} 
          onClick={() => setActiveView('users')}
          aria-pressed={activeView === 'users'}
        >
          Manage Users
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            className="border-red-300 hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      ) : activeView === 'cases' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Arbitration Cases</h2>
          {casesTableMemo}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          {usersTableMemo}
        </div>
      )}
    </div>
  )
} 