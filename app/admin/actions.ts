"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { grantAdmin, isAdmin, revokeAdmin, tokenMatches } from "@/lib/admin";
import { deleteFeedback, setApproved } from "@/lib/feedback";

export async function signIn(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  if (!tokenMatches(token)) {
    // a small pause makes guessing pointless without needing a lockout
    await new Promise((r) => setTimeout(r, 800));
    redirect("/admin?wrong=1");
  }
  await grantAdmin(token);
  redirect("/admin");
}

export async function signOut() {
  await revokeAdmin();
  redirect("/admin");
}

export async function toggleApproved(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = Number(formData.get("id"));
  const next = formData.get("next") === "1";
  if (Number.isFinite(id)) await setApproved(id, next);
  revalidatePath("/admin");
}

export async function removeNote(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = Number(formData.get("id"));
  if (Number.isFinite(id)) await deleteFeedback(id);
  revalidatePath("/admin");
}
