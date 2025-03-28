-- Create role_changes table to track role change events
CREATE TABLE IF NOT EXISTS public.role_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    email TEXT NOT NULL,
    new_role TEXT NOT NULL,
    updated_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable row level security
ALTER TABLE public.role_changes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert for authenticated users with admin role
CREATE POLICY "Allow admins to insert role changes" ON public.role_changes
    FOR INSERT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );
    
-- Create policy to allow admins to read all role changes
CREATE POLICY "Allow admins to read all role changes" ON public.role_changes
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Create policy for users to read their own role changes
CREATE POLICY "Allow users to read their own role changes" ON public.role_changes
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Enable realtime for the role_changes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.role_changes; 