"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, serverFetch } from "@/lib/api/server";
import type { UserStatus } from "./api";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
}

/**
 * Traduce un fallo de la API a algo que el formulario pueda mostrar.
 *
 * El 403 recibe mensaje propio: es un caso que el usuario puede entender y
 * resolver pidiendo permisos, no un error del sistema.
 */
function toFormState(error: unknown): FormState {
  if (error instanceof ApiError) {
    if (error.isForbidden) {
      return { error: "No tienes permiso para esta accion." };
    }
    const fieldErrors = error.fieldErrors.reduce<Record<string, string>>((acc, item) => {
      acc[item.field] = item.message;
      return acc;
    }, {});
    return { error: error.message, fieldErrors };
  }
  return { error: "No pudimos contactar el servidor. Intenta de nuevo." };
}

export async function createUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const roles = formData.getAll("roles").map(String).filter(Boolean);

  if (roles.length === 0) {
    return { error: "Asigna al menos un rol." };
  }

  try {
    await serverFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: String(formData.get("email") ?? "").trim(),
        documentNumber: String(formData.get("documentNumber") ?? "").trim(),
        fullName: String(formData.get("fullName") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        roles,
      }),
    });
  } catch (error) {
    return toFormState(error);
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function changeUserStatus(userId: string, status: UserStatus): Promise<FormState> {
  try {
    await serverFetch(`/admin/users/${userId}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    return toFormState(error);
  }

  revalidatePath("/admin/usuarios");
  return { success: status === "ACTIVE" ? "Cuenta activada." : "Cuenta desactivada." };
}

/** Invocada desde un formulario, de ahi que reciba FormData. */
export async function toggleUserStatus(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId"));
  const status = String(formData.get("status")) as UserStatus;
  await changeUserStatus(userId, status);
}

export async function updateRolePermissions(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const roleId = String(formData.get("roleId"));
  const permissions = formData.getAll("permissions").map(String);

  try {
    await serverFetch(`/admin/roles/${roleId}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  } catch (error) {
    return toFormState(error);
  }

  revalidatePath("/admin/roles");
  return { success: `Permisos actualizados (${permissions.length}).` };
}
