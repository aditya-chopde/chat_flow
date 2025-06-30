import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export const fetchContacts = async () => {
  const { data, error } = await supabase.rpc("get_user_contacts");

  if (error) {
    toast.error(error.message);
  }

  const finalData = data.reverse();

  return finalData;
};
