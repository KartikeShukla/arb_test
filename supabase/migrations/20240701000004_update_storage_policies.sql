-- Update storage policies to be more permissive for development

BEGIN;
  -- Make the documents bucket public for development purposes
  -- This is not recommended for production, but helps with development
  UPDATE storage.buckets SET public = true WHERE id = 'documents';

  -- Create a policy that allows anyone to read from the documents bucket
  DROP POLICY IF EXISTS "Public read access" ON storage.objects;
  CREATE POLICY "Public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'documents');

  -- Create a policy that allows authenticated users to insert into the documents bucket
  DROP POLICY IF EXISTS "Authenticated insert access" ON storage.objects;
  CREATE POLICY "Authenticated insert access"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'documents');

  -- Create a policy that allows authenticated users to update objects in the documents bucket
  DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
  CREATE POLICY "Authenticated update access"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'documents');

  -- Create a policy that allows authenticated users to delete objects in the documents bucket
  DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;
  CREATE POLICY "Authenticated delete access"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'documents');
END;
