"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import { AlertCircle, RefreshCw, Save, CheckCircle } from "lucide-react"; // Added CheckCircle icon
import { UserRole, UserData as UserDataType } from "@/types"; // Import UserRole and UserData types
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; // Import Select components
import { useToast } from "@/components/ui/use-toast"; // Removed .ts extension

type CaseData = {
  id: string;
  title?: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  documents: Document[];
};

type Document = {
  id: string;
  filename: string;
  url: string;
  content_type: string;
  size: number;
};

// Use the imported UserData type
type UserData = UserDataType;

// Status badge component for reusability
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor()}`}>
      {status || 'Pending'}
    </span>
  );
};

// Role badge component
const RoleBadge = ({ role }: { role: UserRole }) => { // Use UserRole type
  const getRoleColor = () => {
    // Normalize to lowercase for comparison
    const normalizedRole = typeof role === 'string' ? role.toLowerCase() : 'user';
    
    switch (normalizedRole) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'arbitrator': return 'bg-indigo-100 text-indigo-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getRoleColor()}`}>
      {role}
    </span>
  );
};

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
    );
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
                {caseItem.title || 'Untitled Case'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {caseItem.user_id}
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
                  aria-label={`Change status for case ${caseItem.title || 'Untitled Case'}`}
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
  );
};

// Update the UsersTable component to remove role change functionality
const UsersTable = ({ 
  usersList, 
  currentUserId,
}: { 
  usersList: UserData[];
  currentUserId: string;
}) => {
  // Remove role change related state variables and hooks
  const { toast } = useToast();

  if (usersList.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-md">
        <p className="text-gray-500">No users in the system yet</p>
      </div>
    );
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
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usersList.map((user) => {
            return (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export function AdminDashboard({ user }: { user: User }) {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [activeView, setActiveView] = useState<'cases' | 'users'>('cases');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!supabase) {
      setError("Supabase client not available");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching admin dashboard data...');
      
      // Fetch cases
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (casesError) {
        throw new Error(`Error fetching cases: ${casesError.message}`);
      }
      
      // Format cases data with proper type annotation that matches our CaseData type
      const formattedCases = (casesData || []).map((caseItem: any) => ({
        id: caseItem.id,
        title: caseItem.title || 'Untitled Case',
        description: caseItem.description || '',
        status: caseItem.status || 'pending',
        created_at: caseItem.created_at,
        updated_at: caseItem.updated_at,
        user_id: caseItem.user_id,
        documents: []
      })) as unknown as CaseData[]; // Use unknown as intermediate type to resolve type mismatch
      
      setCases(formattedCases);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) {
        throw new Error(`Error fetching users: ${usersError.message}`);
      }
      
      // Ensure data matches UserData type with proper type annotation
      const formattedUsers = (usersData || []).map((u: any) => ({
        ...u,
        role: u.role || 'user' // Default role if null
      })) as UserData[];

      setUsers(formattedUsers);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error Fetching Data",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
      
      if (error) throw error;
      
      setCases(prev => prev.map(c => 
        c.id === caseId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
      ));
      toast({ title: "Case Status Updated", description: `Case status changed to ${newStatus}.` });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? `Error updating case status: ${err.message}` : "An unknown error occurred";
      setError(errorMessage);
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage cases and users</p>
        </div>
        
        {/* User info */}
        <div className="flex items-center">
          <div className="mr-2 text-right">
            <div className="text-sm font-medium text-gray-900">{user.user_metadata?.full_name || user.email}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          {/* Simplified user avatar display if component not available */}
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
            {user.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* View selection tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Admin dashboard views">
          <button
            onClick={() => setActiveView('cases')}
            className={`border-transparent ${
              activeView === 'cases'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 font-medium text-sm`}
            aria-current={activeView === 'cases' ? 'page' : undefined}
          >
            Cases
          </button>
          <button
            onClick={() => setActiveView('users')}
            className={`border-transparent ${
              activeView === 'users'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 font-medium text-sm`}
            aria-current={activeView === 'users' ? 'page' : undefined}
          >
            Users
          </button>
        </nav>
      </div>

      {/* Actions and refresh */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeView === 'cases' ? 'All Cases' : 'All Users'} 
          {isLoading && <span className="ml-2 text-gray-400 text-sm">(Loading...)</span>}
        </h2>
        
        <div className="ml-auto flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>
      
      {error && !isLoading && ( // Only show error if not loading
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Content based on selected view */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <RefreshCw className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      ) : activeView === 'cases' ? (
        <CasesTable 
          cases={cases} 
          onStatusChange={updateCaseStatus} 
        />
      ) : (
        <UsersTable 
          usersList={users} 
          currentUserId={user.id} 
        />
      )}
    </div>
  );
}
