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
  name: string;
  email: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
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
  );
};

// Extracted UsersTable component
const UsersTable = ({ 
  users, 
  onRoleChange, 
  currentUserId 
}: { 
  users: UserData[],
  onRoleChange: (userId: string, newRole: UserRole) => Promise<boolean>,
  currentUserId: string
}) => {
  const [pendingRoleChanges, setPendingRoleChanges] = useState<Record<string, UserRole>>({});
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({}); // Track saving state per user
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({}); // Track success state per user
  const [usersList, setUsersList] = useState<UserData[]>(users);
  const { toast } = useToast();
  
  // Update local state when the users prop changes
  useEffect(() => {
    setUsersList(users);
  }, [users]);

  // Clear success states after a timeout
  useEffect(() => {
    const successIds = Object.keys(successStates).filter(id => successStates[id]);
    if (successIds.length > 0) {
      const timers = successIds.map(id => {
        return setTimeout(() => {
          setSuccessStates(prev => ({
            ...prev,
            [id]: false
          }));
        }, 3000); // Clear success state after 3 seconds
      });
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [successStates]);

  // Subscribe to role change events
  useEffect(() => {
    if (!supabase) return;
    
    console.log('Setting up admin dashboard realtime subscription for role changes');
    
    // Set up subscription to role_changes table
    let channel: any;
    
    try {
      channel = supabase
        .channel('admin-role-changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'role_changes',
        }, (payload) => {
          console.log('Admin received role change notification:', payload);
          
          const { user_id, new_role, email } = payload.new as { 
            user_id: string, 
            new_role: UserRole,
            email: string 
          };
          
          console.log(`Role change detected: User ${email} (${user_id}) → ${new_role}`);
          
          // Update our local state to reflect the change
          setUsersList(prevUsers => 
            prevUsers.map(user => 
              user.id === user_id ? { ...user, role: new_role as UserRole } : user
            )
          );
          
          // Clear any pending changes for this user
          if (pendingRoleChanges[user_id]) {
            setPendingRoleChanges(prev => {
              const updated = { ...prev };
              delete updated[user_id];
              return updated;
            });
          }
          
          // Reset any saving state for this user
          if (savingStates[user_id]) {
            setSavingStates(prev => ({ ...prev, [user_id]: false }));
            
            // Set success state
            setSuccessStates(prev => ({ ...prev, [user_id]: true }));
          }
          
          // Show a toast to admin that a role was changed
          toast({
            title: "User Role Updated",
            description: `${email} is now ${new_role}`,
          });
        })
        .subscribe((status) => {
          console.log('Admin role changes subscription status:', status);
        });
    } catch (error) {
      console.error('Error setting up role changes subscription:', error);
    }
      
    // Cleanup function
    return () => {
      console.log('Unsubscribing from admin role changes');
      if (supabase && channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      }
    };
  }, [supabase, pendingRoleChanges, savingStates, toast]);

  const handleRoleSelectChange = useCallback((userId: string, newRole: UserRole) => {
    // Prevent changing if already saving
    if (savingStates[userId]) return;
    
    console.log(`Selected new role for user ${userId}: ${newRole}`);
    setPendingRoleChanges(prev => ({ ...prev, [userId]: newRole }));
    
    // Clear any success state when making a new change
    if (successStates[userId]) {
      setSuccessStates(prev => ({ ...prev, [userId]: false }));
    }
  }, [savingStates, successStates]);

  const handleSaveChanges = useCallback(async (userId: string) => {
    const newRole = pendingRoleChanges[userId];
    if (!newRole || savingStates[userId]) return;
    
    console.log(`Saving role change for user ${userId} to ${newRole}`);
    
    // Find the user in our list
    const user = usersList.find(u => u.id === userId);
    if (!user) {
      console.error(`User ${userId} not found in usersList`);
      return;
    }
    
    // Get the current role to compare
    const normalizedCurrentRole = typeof user.role === 'string' ? 
      user.role.toLowerCase() as UserRole : 'user';
      
    // Skip if the new role is the same as the current role
    if (newRole === normalizedCurrentRole) {
      console.log(`New role ${newRole} is the same as current role ${normalizedCurrentRole}, skipping`);
      
      // Clear pending change
      setPendingRoleChanges(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      
      return;
    }
    
    // Clear any existing success state
    setSuccessStates(prev => ({ ...prev, [userId]: false }));
    
    // Set saving state to true
    setSavingStates(prev => ({ ...prev, [userId]: true }));
    
    try {
      console.log(`Calling onRoleChange for user ${userId} with new role ${newRole}`);
      const success = await onRoleChange(userId, newRole); // Await the result
      
      console.log(`Role change result for user ${userId}: ${success ? 'success' : 'failure'}`);
      
      if (success) {
        // The UI update will happen in updateUserRole or via the realtime subscription
        
        // Set success state
        setSuccessStates(prev => ({ ...prev, [userId]: true }));
        
        // Clear pending change
        setPendingRoleChanges(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
      // If !success, the pending change remains, allowing retry
    } catch (error) {
      console.error(`Error saving role change for user ${userId}:`, error);
    } finally {
      setSavingStates(prev => ({ ...prev, [userId]: false })); // Reset saving state
    }
  }, [pendingRoleChanges, savingStates, usersList, onRoleChange]);

  const clearPendingChange = useCallback((userId: string) => {
    setPendingRoleChanges(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  }, []);

  if (usersList.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-md">
        <p className="text-gray-500">No users in the system yet</p>
      </div>
    );
  }
  
  // Define available roles in lowercase to match the expected format in the API
  const availableRoles: UserRole[] = ['user', 'arbitrator', 'admin'];

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
              Current Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Change Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usersList.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const isSaving = savingStates[user.id] || false;
            const isSuccess = successStates[user.id] || false;
            
            // Normalize the user's current role to lowercase for the select component
            const normalizedRole = typeof user.role === 'string' ? user.role.toLowerCase() as UserRole : 'user';
            const selectedRole = pendingRoleChanges[user.id] || normalizedRole;
            const hasChange = pendingRoleChanges[user.id] && pendingRoleChanges[user.id] !== normalizedRole;

            return (
              <tr key={user.id} className={isSaving ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.full_name || 'Not provided'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <RoleBadge role={user.role} />
                  
                  {/* Show a success indicator after role change */}
                  {isSuccess && (
                    <span className="ml-2 text-green-500 inline-flex items-center">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Role Change Select */}
                  <Select 
                    value={selectedRole}
                    onValueChange={(value) => handleRoleSelectChange(user.id, value as UserRole)}
                    disabled={isCurrentUser || isSaving} // Disable for current admin or while saving
                  >
                    <SelectTrigger 
                      className={`w-[180px] ${hasChange ? 'border-blue-500' : ''} ${isSuccess ? 'border-green-500' : ''}`} 
                      aria-label={`Change role for ${user.email}`}
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role} className="capitalize">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                   {/* Save Role Change Button */}
                   <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSaveChanges(user.id)}
                    disabled={!hasChange || isCurrentUser || isSaving || isSuccess}
                    aria-label={`Save role change for ${user.email}`}
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> 
                    ) : isSuccess ? (
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    {isSaving ? 'Saving...' : isSuccess ? 'Updated!' : 'Save Role'}
                  </Button>
                  
                  {/* Cancel Button - Only show if there are pending changes */}
                  {hasChange && !isSaving && !isSuccess && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearPendingChange(user.id)}
                      aria-label={`Cancel role change for ${user.email}`}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </Button>
                  )}
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'cases' | 'users'>('users'); // Default to users view
  const [isSyncing, setIsSyncing] = useState(false); // State for syncing roles
  const { toast } = useToast();

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
      
      // Fetch all users (assuming roles are in 'profiles' table)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles') 
        .select('id, email, full_name, role, created_at') // Removed is_approved
        .order('created_at', { ascending: false });
      
      if (usersError) {
        // Check if the error is specifically about the column missing
        if (usersError.message.includes("column") && usersError.message.includes("does not exist")) {
           console.error("Database schema mismatch:", usersError.message);
           // Potentially try fetching without the problematic column if applicable,
           // but here we assume the select list is now correct.
        }
        throw new Error(`Error fetching users: ${usersError.message}`);
      }
      
      // Ensure data matches UserData type (without is_approved)
      const formattedUsers = (usersData || []).map(u => ({
        ...u,
        role: u.role || 'user' // Default role if null
      })) as UserData[]; // Cast to UserData (which will be updated in types.ts)

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

  // Function to sync roles between tables
  const syncRoles = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/sync-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || `API request failed with status ${response.status}`);
      }
      
      toast({
        title: "Roles Sync Completed",
        description: result.message,
        variant: "default",
      });
      
      // Refresh data after sync
      fetchData();
      
    } catch (err) {
      console.error("Error syncing roles:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Roles Sync Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [toast, fetchData]);

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
  
  // Removed updateUserApproval function

  // --- updateUserRole function ---
  // Now returns a boolean indicating success
  const updateUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<boolean> => {
    if (userId === user.id) {
       toast({ title: "Action Denied", description: "Cannot change your own role.", variant: "destructive" });
       return false; // Indicate failure
    }
    
    console.log(`Sending request to update role for user ${userId} to ${newRole}`);
    toast({ 
      title: "Updating Role...", 
      description: `Processing role change to ${newRole}`,
    });
    
    try {
      const response = await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newRole }),
      });

      const result = await response.json();
      console.log('API response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || `API request failed with status ${response.status}`);
      }

      console.log(`Successfully updated role for user ${userId} to ${newRole}`);
      
      // Get the formatted role from the API response if available, otherwise format it locally
      // This ensures consistency with the database format
      const formattedRole = result.data?.newRole || 
        (newRole.charAt(0).toUpperCase() + newRole.slice(1).toLowerCase() as UserRole);
      
      // Update local state only after successful API call
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: formattedRole } : u
      ));
      
      toast({ 
        title: "Success! Role Updated", 
        description: `User role successfully changed to ${formattedRole}`,
        variant: "default",
      });
      
      return true; // Indicate success

    } catch (err) {
       console.error("Error updating user role:", err);
       const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while updating role.";
       
       toast({ 
         title: "Role Update Failed", 
         description: errorMessage, 
         variant: "destructive" 
       });
       
       return false; // Indicate failure
    }
  }, [toast, user.id, setUsers]);
  // --- End of updateUserRole function ---

  // Memoize components for performance
  const casesTableMemo = useMemo(() => 
    <CasesTable cases={cases} onStatusChange={updateCaseStatus} />, 
    [cases, updateCaseStatus]
  );
  
  const usersTableMemo = useMemo(() => 
    <UsersTable 
      users={users} 
      onRoleChange={updateUserRole} 
      currentUserId={user.id} 
    />, 
    [users, updateUserRole, user.id]
  );

  return (
    <div>
      <div className="bg-primary/5 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage arbitration cases, user access, and platform settings
        </p>
      </div>
      
      <div className="flex space-x-4 mb-6 border-b pb-4">
        <Button 
          variant={activeView === 'cases' ? "secondary" : "ghost"} 
          onClick={() => setActiveView('cases')}
          aria-pressed={activeView === 'cases'}
          className={`font-medium ${activeView === 'cases' ? 'text-primary' : 'text-gray-600'}`}
        >
          Manage Cases
        </Button>
        <Button 
          variant={activeView === 'users' ? "secondary" : "ghost"} 
          onClick={() => setActiveView('users')}
          aria-pressed={activeView === 'users'}
           className={`font-medium ${activeView === 'users' ? 'text-primary' : 'text-gray-600'}`}
        >
          Manage Users
        </Button>
        
        <div className="ml-auto flex space-x-2">
          {/* Only show sync button in users view */}
          {activeView === 'users' && (
            <Button
              variant="outline"
              size="sm"
              onClick={syncRoles}
              disabled={isLoading || isSyncing}
              className="relative"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing Roles...' : 'Sync Roles'}
              {isSyncing && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            disabled={isLoading || isSyncing}
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
           {/* Removed retry button from error message as refresh is available */}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      ) : activeView === 'cases' ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">All Arbitration Cases</h2>
          {casesTableMemo}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">User Management</h2>
          {usersTableMemo}
        </div>
      )}
    </div>
  );
}
