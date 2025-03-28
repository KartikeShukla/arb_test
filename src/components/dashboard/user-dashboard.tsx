"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { supabase } from "@/config/supabase"
import { CaseFormModal } from "@/components/case-form/case-form-modal"
import { AlertCircle, RefreshCw } from "lucide-react"

type Document = {
  id: string
  filename: string
  url: string
  content_type: string
  size: number
}

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

// Cases table component
const UserCasesTable = ({ cases, isLoading, onNewCase }: { 
  cases: CaseData[],
  isLoading: boolean,
  onNewCase: () => void
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your cases...</p>
      </div>
    );
  }
  
  if (cases.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-md">
        <p className="text-gray-500">You haven't submitted any cases yet</p>
        <Button 
          className="mt-4 bg-primary text-white"
          onClick={onNewCase}
        >
          Submit Your First Case
        </Button>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" aria-labelledby="cases-table-heading">
        <caption id="cases-table-heading" className="sr-only">Your submitted arbitration cases</caption>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Submitted
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases.map((caseItem) => (
            <tr key={caseItem.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {caseItem.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={caseItem.status || 'Pending'} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(caseItem.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(caseItem.updated_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function UserDashboard({ user }: { user: User }) {
  const [cases, setCases] = useState<CaseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchUserCases = useCallback(async () => {
    if (!supabase || !user) {
      setError("Unable to connect to the database or user not authenticated");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch cases submitted by the current user
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching cases: ${error.message}`);
      }
      
      setCases(data || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserCases();
  }, [fetchUserCases]);
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchUserCases();
  };

  // Memoize the user cases table for performance
  const userCasesTableMemo = useMemo(() => (
    <UserCasesTable
      cases={cases}
      isLoading={isLoading}
      onNewCase={openModal}
    />
  ), [cases, isLoading]);

  return (
    <div>
      <div className="bg-primary/5 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Your Dashboard</h1>
        <p className="text-gray-600">
          Manage your arbitration cases and track their progress
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user.user_metadata?.full_name || "Not provided"}</p>
          </div>
        </div>
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
            onClick={fetchUserCases}
            className="border-red-300 hover:bg-red-50"
            aria-label="Retry loading cases"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Cases</h2>
          <Button 
            className="bg-primary text-white"
            onClick={openModal}
            aria-label="Submit a new case"
          >
            Submit a New Case
          </Button>
        </div>
        
        {userCasesTableMemo}
      </div>
      
      {/* Case submission modal */}
      <CaseFormModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
} 