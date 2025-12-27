import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client for auth
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ef0f32bc/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth Routes

// Sign up endpoint
app.post("/make-server-ef0f32bc/auth/signup", async (c) => {
  try {
    const { name, phone, password } = await c.req.json();

    if (!name || !phone || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create email from phone for Supabase auth (since Supabase requires email)
    const email = `${phone}@roommate.local`;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    if (!data.user) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      name,
      phone,
      createdAt: new Date().toISOString(),
    });

    return c.json({ 
      user: {
        id: data.user.id,
        name,
        phone,
      }
    });
  } catch (error) {
    console.log(`Error during sign up: ${error}`);
    return c.json({ error: "Internal server error during sign up" }, 500);
  }
});

// Sign in endpoint
app.post("/make-server-ef0f32bc/auth/signin", async (c) => {
  try {
    const { phone, password } = await c.req.json();

    if (!phone || !password) {
      return c.json({ error: "Missing phone or password" }, 400);
    }

    const email = `${phone}@roommate.local`;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Sign in error: ${error.message}`);
      return c.json({ error: "Invalid phone or password" }, 401);
    }

    if (!data.session) {
      return c.json({ error: "Failed to create session" }, 500);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${data.user.id}`);

    return c.json({ 
      accessToken: data.session.access_token,
      user: userProfile || {
        id: data.user.id,
        name: data.user.user_metadata?.name,
        phone: data.user.user_metadata?.phone,
        profileCompleted: false,
      }
    });
  } catch (error) {
    console.log(`Error during sign in: ${error}`);
    return c.json({ error: "Internal server error during sign in" }, 500);
  }
});

// Get current session
app.get("/make-server-ef0f32bc/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ user: null });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ user: null });
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${user.id}`);

    return c.json({ 
      user: userProfile || {
        id: user.id,
        name: user.user_metadata?.name,
        phone: user.user_metadata?.phone,
      }
    });
  } catch (error) {
    console.log(`Error getting session: ${error}`);
    return c.json({ user: null });
  }
});

// Sign out
app.post("/make-server-ef0f32bc/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.signOut();

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error during sign out: ${error}`);
    return c.json({ error: "Internal server error during sign out" }, 500);
  }
});

// User Profile Routes

// Complete user profile after signup
app.post("/make-server-ef0f32bc/user/complete-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profileData = await c.req.json();

    // Get current profile
    const currentProfile = await kv.get(`user:${user.id}`) || {};
    
    // Merge with new data
    const updatedProfile = {
      ...currentProfile,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Error completing user profile: ${error}`);
    return c.json({ error: "Internal server error while completing profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-ef0f32bc/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { name, phone } = await c.req.json();

    // Update user profile in KV store
    const currentProfile = await kv.get(`user:${user.id}`) || {};
    const updatedProfile = {
      ...currentProfile,
      name: name || currentProfile.name,
      phone: phone || currentProfile.phone,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ user: updatedProfile });
  } catch (error) {
    console.log(`Error updating user profile: ${error}`);
    return c.json({ error: "Internal server error while updating profile" }, 500);
  }
});

// Get full user profile
app.get("/make-server-ef0f32bc/user/profile-full", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`) || {};

    return c.json({ profile });
  } catch (error) {
    console.log(`Error getting full user profile: ${error}`);
    return c.json({ error: "Internal server error while getting profile" }, 500);
  }
});

// Update full user profile
app.put("/make-server-ef0f32bc/user/profile-full", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();

    // Update user profile in KV store
    const currentProfile = await kv.get(`user:${user.id}`) || {};
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id, // Ensure ID is preserved
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating full user profile: ${error}`);
    return c.json({ error: "Internal server error while updating full profile" }, 500);
  }
});

// Favorite Rooms Routes

// Add favorite room
app.post("/make-server-ef0f32bc/favorites/:roomId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const roomId = c.req.param('roomId');
    const favorites = await kv.get(`favorites:${user.id}`) || [];

    if (!favorites.includes(roomId)) {
      favorites.push(roomId);
      await kv.set(`favorites:${user.id}`, favorites);
    }

    return c.json({ favorites });
  } catch (error) {
    console.log(`Error adding favorite room: ${error}`);
    return c.json({ error: "Internal server error while adding favorite" }, 500);
  }
});

// Remove favorite room
app.delete("/make-server-ef0f32bc/favorites/:roomId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const roomId = c.req.param('roomId');
    let favorites = await kv.get(`favorites:${user.id}`) || [];

    favorites = favorites.filter((id: string) => id !== roomId);
    await kv.set(`favorites:${user.id}`, favorites);

    return c.json({ favorites });
  } catch (error) {
    console.log(`Error removing favorite room: ${error}`);
    return c.json({ error: "Internal server error while removing favorite" }, 500);
  }
});

// Get favorite rooms
app.get("/make-server-ef0f32bc/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const favorites = await kv.get(`favorites:${user.id}`) || [];

    return c.json({ favorites });
  } catch (error) {
    console.log(`Error getting favorite rooms: ${error}`);
    return c.json({ error: "Internal server error while getting favorites" }, 500);
  }
});

// Viewed Rooms Routes

// Mark room as viewed
app.post("/make-server-ef0f32bc/viewed/:roomId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const roomId = c.req.param('roomId');
    const viewed = await kv.get(`viewed:${user.id}`) || [];

    if (!viewed.includes(roomId)) {
      viewed.push(roomId);
      await kv.set(`viewed:${user.id}`, viewed);
    }

    return c.json({ viewed });
  } catch (error) {
    console.log(`Error marking room as viewed: ${error}`);
    return c.json({ error: "Internal server error while marking room as viewed" }, 500);
  }
});

// Get viewed rooms
app.get("/make-server-ef0f32bc/viewed", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const viewed = await kv.get(`viewed:${user.id}`) || [];

    return c.json({ viewed });
  } catch (error) {
    console.log(`Error getting viewed rooms: ${error}`);
    return c.json({ error: "Internal server error while getting viewed rooms" }, 500);
  }
});

Deno.serve(app.fetch);