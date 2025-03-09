"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, FolderPlus, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StorageBucket {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}

export default function StorageManagement() {
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBucketName, setNewBucketName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/storage/buckets");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch storage buckets");
      }

      setBuckets(data.buckets || []);
    } catch (err) {
      console.error("Error fetching buckets:", err);
      setError("Failed to load storage buckets");
    } finally {
      setIsLoading(false);
    }
  };

  const createBucket = async () => {
    if (!newBucketName.trim()) {
      setError("Bucket name is required");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/storage/buckets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketName: newBucketName.trim(),
          isPublic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create bucket");
      }

      // Reset form
      setNewBucketName("");
      setIsPublic(false);

      // Refresh buckets list
      fetchBuckets();
    } catch (err) {
      console.error("Error creating bucket:", err);
      setError("Failed to create storage bucket");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Storage Management</CardTitle>
              <CardDescription>
                Manage storage buckets for document storage
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchBuckets}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Create New Bucket</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new storage bucket for document storage
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="bucket-name">Bucket Name</Label>
                  <Input
                    id="bucket-name"
                    placeholder="Enter bucket name"
                    value={newBucketName}
                    onChange={(e) => setNewBucketName(e.target.value)}
                    disabled={isCreating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="is-public"
                    className="flex items-center gap-2"
                  >
                    Public Access
                    <span className="text-xs text-muted-foreground">
                      (Not recommended for sensitive documents)
                    </span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-public"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                      disabled={isCreating}
                    />
                    <Label htmlFor="is-public" className="text-sm">
                      {isPublic ? "Public" : "Private"}
                    </Label>
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={createBucket}
                    disabled={!newBucketName.trim() || isCreating}
                    className="w-full"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Create Bucket
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Existing Buckets</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage existing storage buckets
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : buckets.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <Database className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No storage buckets found
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bucket Name</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Owner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {buckets.map((bucket) => (
                        <TableRow key={bucket.id}>
                          <TableCell className="font-medium">
                            {bucket.name}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${bucket.public ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
                            >
                              {bucket.public ? "Public" : "Private"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(bucket.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>{bucket.owner || "System"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
