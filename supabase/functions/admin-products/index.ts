
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Check auth
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No authorization header')
        }

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
        )

        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        // Check admin
        const { data: isAdmin } = await supabaseClient.rpc('is_admin', { user_id: user.id })
        if (!isAdmin) {
            return new Response(
                JSON.stringify({ error: 'Forbidden: Admin access required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
            )
        }

        if (req.method === 'POST') {
            const body = await req.json()
            const { data, error } = await supabaseClient
                .from('products')
                .insert(body)
                .select()
                .single()

            if (error) throw error
            return new Response(
                JSON.stringify(data),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        if (req.method === 'PUT') {
            const body = await req.json()
            const { id, ...updates } = body
            if (!id) throw new Error('ID required for update')

            const { data, error } = await supabaseClient
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return new Response(
                JSON.stringify(data),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        if (req.method === 'DELETE') {
            const body = await req.json()
            const { id } = body
            if (!id) throw new Error('ID required for deletion')

            const { error } = await supabaseClient
                .from('products')
                .delete()
                .eq('id', id)

            if (error) throw error
            return new Response(
                JSON.stringify({ message: 'Deleted successfully' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        throw new Error('Method not allowed')

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
