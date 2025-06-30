import { supabase } from "@/lib/supabaseClient";
import type { SearchUser, user_contact } from "@/types/chat";

export const searchUsers = async (query: string): Promise<SearchUser[]> => {
  // Get current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) throw new Error("Not Authenticated");

  const currentUserId = session.user.id;

  const { data: contactData, error: contactError } = await supabase
    .from("user_contacts")
    .select("contactId")
    .eq("userId", currentUserId) as { data: user_contact[] | null; error: any };

  if (contactError) throw contactError;

  const existingContactIds = (contactData ?? []).map((c) => c.contactId);

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, name, email, avatar, status")
    .ilike("email", `%${query}%`)
    .neq("id", currentUserId);

  if (usersError) throw usersError;

  const results = (users ?? []).map((user) => ({
    ...user,
    isContact: existingContactIds.includes(user.id),
  }));

  return results;
};
