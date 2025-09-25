import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
    db: {
        schema: 'public'
    }
})

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        // Check if search term exists with specific column selection
        const { data: existing, error: searchError } = await supabase
            .from('search_metrics')
            .select('id, search_term, search_count')
            .eq('search_term', searchTerm)
            .single();

        if (searchError && searchError.code !== 'PGRST116') throw searchError;

        if (existing) {
            // Update existing record
            const { error: updateError } = await supabase
                .from('search_metrics')
                .update({
                    search_count: existing.search_count + 1,
                    movie_id: movie.id,
                    poster_url: movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : null
                })
                .eq('search_term', searchTerm)
                .select(); // Return the updated record

            if (updateError) throw updateError;
        } else {
            // Insert new record
            const { error: insertError } = await supabase
                .from('search_metrics')
                .insert([{
                    search_term: searchTerm,
                    search_count: 1,
                    movie_id: movie.id,
                    poster_url: movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : null
                }])
                .select(); // Return the inserted record

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error('Supabase Error:', error);
        throw new Error('Failed to update search metrics');
    }
};

export const getTrendingSearches = async (limit = 5) => {
    try {
        const { data, error } = await supabase
            .from('search_metrics')
            .select(`
                search_term,
                search_count,
                movie_id,
                poster_url
            `)
            .order('search_count', { ascending: false })
            .gte('search_count', 1)
            .limit(limit);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Supabase Error:', error);
        throw new Error('Failed to fetch trending searches');
    }
};

export const deleteSearchRecord = async (id) => {
    try {
        const { error } = await supabase
            .from('search_metrics')
            .delete()
            .eq('id', id)
            .select(); // Return the deleted record

        if (error) throw error;
    } catch (error) {
        console.error('Supabase Error:', error);
        throw new Error('Failed to delete search record');
    }
};