# Database Setup Instructions

## Setting up Supabase Database

1. **Go to your Supabase project dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `lttpegiinnbnafwcscjb`

2. **Run the database schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database/schema.sql`
   - Click "Run" to execute the SQL

3. **Verify the setup**
   - Go to the Table Editor
   - You should see these tables:
     - `products`
     - `product_categories` 
     - `product_filters`
     - `user_sessions`

4. **Check default data**
   - The `product_categories` table should have 5 default categories
   - The `product_filters` table should have 8 default filters

## Environment Variables

Make sure your `.env` file has these Supabase variables:

```
SUPABASE_URL="https://lttpegiinnbnafwcscjb.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://lttpegiinnbnafwcscjb.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

## Testing the Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Try logging in with: `admin` / `neowave342`
4. Test creating a product in the admin panel

## Troubleshooting

If you encounter issues:

1. **Database connection errors**: Check your Supabase URL and keys
2. **Permission errors**: Make sure RLS (Row Level Security) is disabled for development
3. **Missing tables**: Re-run the schema.sql file
4. **Authentication issues**: Check the user_sessions table is created properly